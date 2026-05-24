// scripts/lib/i18n-pair.ts
// ────────────────────────────────────────────────────────────────────────
// Source-level i18n gate for sgai data files.
//
// Two complementary checks, both run from the same AST traversal:
//
//   (1) ALIGNMENT (back-compat with v1) — every <field> with CJK content
//       has a sibling <field>En populated. Field set is configurable,
//       defaults to a generic list (`title`, `description`, `name`, ...).
//
//   (2) COMPLETENESS (new) — for files declared in `scripts/i18n-config.ts`,
//       every required field's source side AND every locale sibling must
//       be non-empty + non-placeholder. Optional fields are skipped only
//       when absent; once present, their locale siblings are required too.
//       This is what catches the "stub ecosystem entity" pattern that v1
//       missed, plus half-translated optional display fields.
//
//   (3) PURITY — authored English fields (`*En`) must not contain CJK,
//       Japanese kana, or Korean hangul. This catches the common workflow
//       bug where zh source text is drafted first and a supposedly English
//       sibling keeps source-language fragments.
//
// Parser is the TypeScript Compiler API, not regex. Handles template
// literals, multi-line strings, Prettier-wrapped values, nested arrays,
// and arbitrary attribute order in the source.
//
// USAGE (programmatic — preserved for refresh pipelines):
//
//   import { findUnpairedFields } from './lib/i18n-pair';
//   const issues = findUnpairedFields('src/data/policies.ts', { fields: ['title', 'description'], locales: ['en', 'ja', 'ko'] });
//
// USAGE (programmatic — new completeness API):
//
//   import { findIncompleteRecords } from './lib/i18n-pair';
//   const issues = findIncompleteRecords('src/data/ecosystem.ts');
//
// USAGE (cli):
//   npx tsx scripts/lib/i18n-pair.ts src/data/policies.ts            # alignment (default)
//   npx tsx scripts/lib/i18n-pair.ts --mode=alignment src/data/*.ts
//   npx tsx scripts/lib/i18n-pair.ts --mode=completeness src/data/ecosystem.ts
//   npx tsx scripts/lib/i18n-pair.ts --mode=both src/data/ecosystem.ts
//   npx tsx scripts/lib/i18n-pair.ts --fields=title,description src/data/policies.ts
//   npx tsx scripts/lib/i18n-pair.ts --locales=en,ja,ko src/data/*.ts
//   npx tsx scripts/lib/i18n-pair.ts --locales=all src/data/*.ts
//
// LOCALE CODES: pass Lang codes that mirror src/i18n/index.ts
// (en, ja, ko, future locales). The CLI converts them to sibling suffixes via the
// same `siblingSuffix` rule used by pickLocalized: 'zh-tw' → 'ZhTw'
// (kebab-cased langs are split on '-' then each part capitalized), 'ko' → 'Ko'.
// The default / `all` set is derived from src/i18n/index.ts: zh is the
// source side, zh-tw is a required derived locale covered by OpenCC + dist
// checks, and every other current/future locale requires sibling fields.
//
// Both modes respect the `i18n-allow-unpaired` annotation on the line
// preceding the record's opening brace, which exempts that record from
// BOTH checks. Use sparingly — it's the sgai equivalent of `// eslint-disable-next-line`.

import * as ts from 'typescript';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { I18N_CONFIG, isPlaceholderValue, type FileSchema, type RecordSchema } from '../i18n-config.ts';
import { dataSiblingLocales, localeCoverageSummary, siblingSuffix } from './i18n-locales.mjs';

// ── Public types ────────────────────────────────────────────────────────

export interface UnpairedField {
  file: string;
  line: number;
  recordStartLine: number;
  field: string;
  chineseValue: string;
  reason: 'missing-sibling' | 'empty-sibling';
  /** Which target locale's sibling is missing/empty (e.g. 'en', 'ja'). */
  locale: string;
}

export interface IncompleteRecord {
  file: string;
  recordStartLine: number;
  /** Schema name from i18n-config (e.g. 'entity', 'category') */
  schema: string;
  /** Field names that are missing or placeholder. Includes both source and sibling fields. */
  missingFields: string[];
  /** Best-effort identifier for the record, taken from `id` or `name` if present */
  recordIdentifier?: string;
}

export interface ImpureLocaleField {
  file: string;
  line: number;
  recordStartLine: number;
  field: string;
  locale: string;
  reason: string;
  value: string;
}

// ── Constants ───────────────────────────────────────────────────────────

const DEFAULT_FIELDS = [
  'title',
  'description',
  'name',
  'label',
  'summary',
  'note',
  'excerpt',
  'tagline',
  'role',
  'org',
  'context',
  'reason',
  'caption',
  'subtitle',
  'source',
  'content',
  'body',
  'value',
  'authority',
  'badge',
  'benchmark',
  'category',
  'current',
  'status',
  'owner',
  'type',
  'event',
  'speakerTitle',
  'ministry',
  'headquarters',
  'parentOrg',
  'scale',
  'whatItIs',
  'aiRelevance',
  'singaporeRelevance',
  'singaporeTakeaway',
  'whatStateDoes',
  'bottleneckSolved',
  'insight',
  'headline',
  'whyItMatters',
  'text',
  'region',
  'strategy',
  'investment',
  'governance',
  'strength',
  'philosophy',
  'sourceLabel',
  'sourceNote',
  'period',
  'theme',
  'issue',
  'governmentStance',
  'evidence',
  'governmentPosition',
  'oppositionPosition',
  'oppositionStance',
  'dimension',
  'sideA',
  'sideB',
  'currentBalance',
  'notablePosition',
  'notableQuote',
  'signal',
  'organization',
  'policySignal',
  'topic',
  'acquirer',
  'focus',
  'focusAreas',
  'judgment',
  'methodologyNote',
  'oneLiner',
  'rank',
  'sector',
  'shortcoming',
  'stats',
  'target',
  'highlight',
  'features',
  'highlights',
  'bullets',
  'tags',
  'points',
  'companyProfile',
  'takeaway',
  'heading',
];

const DEFAULT_LOCALES = dataSiblingLocales();

const CJK_RE = /[一-鿿]/;
const NON_ENGLISH_SCRIPT_RE = /[一-鿿぀-ゟ゠-ヿ가-힣]/;
const IGNORE_MARKER = 'i18n-allow-unpaired';
// Verbatim source material may legitimately contain multilingual quotes.
// Authored summaries/titles/descriptions are still purity-gated.
const VERBATIM_EN_SOURCE_FIELDS = new Set(['paragraphsEn', 'transcriptEn']);

// ── AST utilities ───────────────────────────────────────────────────────

function parseSourceFile(filePath: string): ts.SourceFile {
  const source = readFileSync(filePath, 'utf8');
  return ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, /* setParentNodes */ true);
}

/** Yields every ObjectLiteralExpression reachable from `node` (depth-first). */
function* walkObjectLiterals(node: ts.Node): Generator<ts.ObjectLiteralExpression> {
  if (ts.isObjectLiteralExpression(node)) yield node;
  const children: ts.Node[] = [];
  ts.forEachChild(node, (c) => {
    children.push(c);
  });
  for (const c of children) {
    yield* walkObjectLiterals(c);
  }
}

function getProperty(obj: ts.ObjectLiteralExpression, key: string): ts.PropertyAssignment | undefined {
  for (const prop of obj.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const name = prop.name;
    if (ts.isIdentifier(name) && name.text === key) return prop;
    if ((ts.isStringLiteral(name) || ts.isNoSubstitutionTemplateLiteral(name)) && name.text === key) return prop;
  }
  return undefined;
}

function getPropertyName(prop: ts.PropertyAssignment): string | undefined {
  const name = prop.name;
  if (ts.isIdentifier(name)) return name.text;
  if (ts.isStringLiteral(name) || ts.isNoSubstitutionTemplateLiteral(name)) return name.text;
  return undefined;
}

type PropertyValue =
  | { kind: 'string'; text: string }
  | { kind: 'string-array'; text: string; items: string[] }
  | { kind: 'non-string' }
  | { kind: 'absent' };

/** Read an initializer's value with three-way result:
 *    'string' → simple string literal or template literal w/o substitutions
 *    'string-array' → array where every element is a simple string
 *    'non-string' → present but non-string (array, object, identifier, expression, ...)
 */
function getInitializerValue(init: ts.Expression): Exclude<PropertyValue, { kind: 'absent' }> {
  if (ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init)) {
    return { kind: 'string', text: init.text };
  }
  if (ts.isArrayLiteralExpression(init)) {
    const items: string[] = [];
    for (const el of init.elements) {
      if (!ts.isStringLiteral(el) && !ts.isNoSubstitutionTemplateLiteral(el)) {
        return { kind: 'non-string' };
      }
      items.push(el.text);
    }
    return { kind: 'string-array', text: items.join('\n'), items };
  }
  return { kind: 'non-string' };
}

/** Read a property's value with four-way result:
 *    'string' → simple string literal or template literal w/o substitutions
 *    'string-array' → array where every element is a simple string
 *    'non-string' → present but non-string (array, object, identifier, expression, ...)
 *    'absent' → property does not exist on the literal
 */
function getPropertyValue(obj: ts.ObjectLiteralExpression, key: string): PropertyValue {
  const prop = getProperty(obj, key);
  if (!prop) return { kind: 'absent' };
  return getInitializerValue(prop.initializer);
}

/** Returns the binding name of the array literal that directly contains `node`,
 *  or undefined if `node` is not a direct element of an array bound to a
 *  PropertyAssignment / VariableDeclaration.
 *
 *  Examples:
 *    `entities: [ {...HERE...} ]`            => 'entities'
 *    `export const policies = [ {...HERE...} ]` => 'policies'
 *    `export const xs: T[] = [ {...HERE...} ] as const` => 'xs'
 */
function getContainingArrayName(node: ts.ObjectLiteralExpression): string | undefined {
  const arrayLit = node.parent;
  if (!arrayLit || !ts.isArrayLiteralExpression(arrayLit)) return undefined;
  let arrayParent: ts.Node | undefined = arrayLit.parent;
  // Unwrap `as const` / `as T[]` / type assertions
  while (arrayParent && (ts.isAsExpression(arrayParent) || ts.isTypeAssertionExpression?.(arrayParent))) {
    arrayParent = arrayParent.parent;
  }
  if (!arrayParent) return undefined;
  if (ts.isPropertyAssignment(arrayParent) && ts.isIdentifier(arrayParent.name)) {
    return arrayParent.name.text;
  }
  if (ts.isVariableDeclaration(arrayParent) && ts.isIdentifier(arrayParent.name)) {
    return arrayParent.name.text;
  }
  return undefined;
}

function hasIgnoreAnnotation(node: ts.Node, sourceFile: ts.SourceFile): boolean {
  const ranges = ts.getLeadingCommentRanges(sourceFile.text, node.getFullStart());
  if (!ranges) return false;
  for (const range of ranges) {
    const text = sourceFile.text.substring(range.pos, range.end);
    if (text.includes(IGNORE_MARKER)) return true;
  }
  return false;
}

function getLine(node: ts.Node, sourceFile: ts.SourceFile): number {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
}

function findFileSchema(filePath: string): FileSchema | undefined {
  const abs = resolve(filePath);
  return I18N_CONFIG.find((cfg) => abs.endsWith(cfg.file));
}

function findRecordSchema(file: FileSchema, containingArray: string): RecordSchema | undefined {
  return file.schemas.find((s) => s.containingArray === containingArray);
}

function isSiblingPaired(value: PropertyValue): boolean {
  if (value.kind === 'absent') return false;
  if (value.kind === 'non-string') return true; // array/object sibling = present, treat as paired (legacy)
  if (value.kind === 'string-array') return value.items.length > 0;
  return value.text.length > 0;
}

/** Field is "broken" for completeness purposes when:
 *    - missing entirely
 *    - empty string
 *    - matches a known placeholder pattern
 *  Non-string values (arrays / objects / expressions) are always treated as present. */
function isFieldBroken(value: PropertyValue): boolean {
  if (value.kind === 'absent') return true;
  if (value.kind === 'non-string') return false;
  if (value.kind === 'string-array') {
    return value.items.length === 0 || value.items.some((item) => item.length === 0 || isPlaceholderValue(item));
  }
  return value.text.length === 0 || isPlaceholderValue(value.text);
}

function getRecordIdentifier(obj: ts.ObjectLiteralExpression): string | undefined {
  for (const key of ['id', 'slug', 'number', 'name']) {
    const v = getPropertyValue(obj, key);
    if (v.kind === 'string') return v.text;
  }
  return undefined;
}

// ── Public API: alignment check (back-compat) ───────────────────────────

export function findUnpairedFields(
  filePath: string,
  options: { fields?: string[]; locales?: string[]; ignoreUnpairedAnnotation?: string } = {}
): UnpairedField[] {
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  void options.ignoreUnpairedAnnotation; // marker is fixed (`i18n-allow-unpaired`); kept for signature compat
  const fields = options.fields || DEFAULT_FIELDS;
  const locales = options.locales || DEFAULT_LOCALES;
  const sourceFile = parseSourceFile(filePath);
  const issues: UnpairedField[] = [];

  for (const obj of walkObjectLiterals(sourceFile)) {
    if (hasIgnoreAnnotation(obj, sourceFile)) continue;
    const recordStartLine = getLine(obj, sourceFile);

    for (const field of fields) {
      const value = getPropertyValue(obj, field);
      if (value.kind !== 'string' && value.kind !== 'string-array') continue;
      if (!CJK_RE.test(value.text)) continue;

      const fieldProp = getProperty(obj, field)!;
      // Per-field exemption: comment immediately above the field line.
      if (hasIgnoreAnnotation(fieldProp, sourceFile)) continue;
      const fieldLine = getLine(fieldProp, sourceFile);

      for (const locale of locales) {
        const sibKey = `${field}${siblingSuffix(locale)}`;
        const sibling = getPropertyValue(obj, sibKey);

        if (sibling.kind === 'absent') {
          issues.push({
            file: filePath,
            line: fieldLine,
            recordStartLine,
            field,
            chineseValue: value.text,
            reason: 'missing-sibling',
            locale,
          });
        } else if (sibling.kind === 'string' && sibling.text.length === 0) {
          issues.push({
            file: filePath,
            line: fieldLine,
            recordStartLine,
            field,
            chineseValue: value.text,
            reason: 'empty-sibling',
            locale,
          });
        }
      }
    }
  }

  return issues;
}

// ── Public API: completeness check (new) ────────────────────────────────

export function findIncompleteRecords(
  filePath: string,
  options: { schema?: FileSchema } = {}
): IncompleteRecord[] {
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const fileSchema = options.schema || findFileSchema(filePath);
  if (!fileSchema) return []; // no schema configured → not gated

  const sourceFile = parseSourceFile(filePath);
  const issues: IncompleteRecord[] = [];

  for (const obj of walkObjectLiterals(sourceFile)) {
    if (hasIgnoreAnnotation(obj, sourceFile)) continue;
    const containingArray = getContainingArrayName(obj);
    if (!containingArray) continue;
    const schema = findRecordSchema(fileSchema, containingArray);
    if (!schema) continue;

    const missingFields: string[] = [];
    for (const rule of schema.fields) {
      const sourceVal = getPropertyValue(obj, rule.field);
      const sourceIsAbsent = sourceVal.kind === 'absent';
      const siblingValues = rule.locales.map((locale) => {
        const sibKey = `${rule.field}${locale}`;
        return { key: sibKey, value: getPropertyValue(obj, sibKey) };
      });
      const everySideAbsent = sourceIsAbsent && siblingValues.every((sibling) => sibling.value.kind === 'absent');
      if (!rule.required && everySideAbsent) continue;

      // Source side. Required fields must exist; optional fields are
      // checked once any side is present so records cannot carry
      // half-translated data in either direction.
      if (isFieldBroken(sourceVal)) missingFields.push(rule.field);

      // Every locale sibling (independent of source — both may need fixing)
      for (const sibling of siblingValues) {
        if (isFieldBroken(sibling.value)) missingFields.push(sibling.key);
      }
    }

    if (missingFields.length === 0) continue;

    issues.push({
      file: filePath,
      recordStartLine: getLine(obj, sourceFile),
      schema: schema.name,
      missingFields,
      recordIdentifier: getRecordIdentifier(obj),
    });
  }

  return issues;
}

// ── Public API: locale purity check ─────────────────────────────────────

function describeNonEnglishScript(char: string): string {
  if (/[一-鿿]/.test(char)) return `CJK char "${char}"`;
  if (/[぀-ゟ゠-ヿ]/.test(char)) return `Japanese kana "${char}"`;
  if (/[가-힣]/.test(char)) return `Korean hangul "${char}"`;
  return `non-English script "${char}"`;
}

function checkEnglishValuePurity(value: string): { ok: true } | { ok: false; reason: string } {
  const match = value.match(NON_ENGLISH_SCRIPT_RE);
  if (!match) return { ok: true };
  return { ok: false, reason: `EN value contains ${describeNonEnglishScript(match[0])}` };
}

export function findImpureLocaleFields(
  filePath: string,
  options: { locales?: string[] } = {}
): ImpureLocaleField[] {
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const locales = options.locales || DEFAULT_LOCALES;
  if (!locales.includes('en')) return [];

  const sourceFile = parseSourceFile(filePath);
  const issues: ImpureLocaleField[] = [];

  for (const obj of walkObjectLiterals(sourceFile)) {
    if (hasIgnoreAnnotation(obj, sourceFile)) continue;
    const recordStartLine = getLine(obj, sourceFile);

    for (const prop of obj.properties) {
      if (!ts.isPropertyAssignment(prop)) continue;
      if (hasIgnoreAnnotation(prop, sourceFile)) continue;
      const field = getPropertyName(prop);
      if (!field || !field.endsWith('En')) continue;
      if (VERBATIM_EN_SOURCE_FIELDS.has(field)) continue;

      const value = getInitializerValue(prop.initializer);
      if (value.kind !== 'string' && value.kind !== 'string-array') continue;
      const result = checkEnglishValuePurity(value.text);
      if (result.ok) continue;

      issues.push({
        file: filePath,
        line: getLine(prop, sourceFile),
        recordStartLine,
        field,
        locale: 'en',
        reason: result.reason,
        value: value.text,
      });
    }
  }

  return issues;
}

// Suppress "non-string sibling unused" lint while keeping the helper for future extensions
void isSiblingPaired;

// ── CLI ─────────────────────────────────────────────────────────────────

type Mode = 'alignment' | 'completeness' | 'both';

function parseMode(argv: string[]): Mode {
  const arg = argv.find((a) => a.startsWith('--mode='));
  if (!arg) return 'alignment';
  const v = arg.split('=')[1];
  if (v === 'alignment' || v === 'completeness' || v === 'both') return v;
  process.stderr.write(`Unknown --mode: ${v}. Expected alignment | completeness | both.\n`);
  process.exit(2);
}

function parseLocales(argv: string[]): string[] | undefined {
  const arg = argv.find((a) => a.startsWith('--locales='));
  if (!arg) return undefined;
  const raw = arg
    .split('=')[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (raw.includes('all')) return dataSiblingLocales();
  return raw;
}

async function cliMain(): Promise<void> {
  const argv = process.argv.slice(2);
  const mode = parseMode(argv);
  const fieldsArg = argv.find((a) => a.startsWith('--fields='));
  const fields = fieldsArg
    ? fieldsArg
        .split('=')[1]
        .split(',')
        .map((s) => s.trim())
    : undefined;
  const locales = parseLocales(argv);
  const files = argv.filter((a) => !a.startsWith('--'));

  if (files.length === 0) {
    process.stderr.write(
      'Usage: i18n-pair <file...> [--mode=alignment|completeness|both] [--fields=title,description] [--locales=en,ja|all]\n'
    );
    process.exit(2);
  }

  const coverage = localeCoverageSummary();
  process.stdout.write(
    `[i18n-pair] source=${coverage.source}, derived=${coverage.derivedLocales.join(',') || 'none'}, sibling-locales=${coverage.siblingLocales.join(',') || 'none'}\n`
  );

  let totalUnpaired = 0;
  let totalIncomplete = 0;
  let totalImpure = 0;

  for (const file of files) {
    const abs = resolve(file);

    if (mode === 'alignment' || mode === 'both') {
      const issues = findUnpairedFields(abs, { fields, locales });
      if (issues.length > 0) {
        totalUnpaired += issues.length;
        process.stdout.write(`\n${file}: ${issues.length} unpaired (alignment)\n`);
        for (const issue of issues.slice(0, 20)) {
          process.stdout.write(
            `  L${issue.line} ${issue.field}[${issue.locale}] (${issue.reason}): ${issue.chineseValue.slice(0, 50)}\n`
          );
        }
        if (issues.length > 20) {
          process.stdout.write(`  … and ${issues.length - 20} more\n`);
        }
      }
    }

    const impure = findImpureLocaleFields(abs, { locales: locales || DEFAULT_LOCALES });
    if (impure.length > 0) {
      totalImpure += impure.length;
      process.stdout.write(`\n${file}: ${impure.length} impure English field(s)\n`);
      for (const issue of impure.slice(0, 20)) {
        process.stdout.write(
          `  L${issue.line} ${issue.field}: ${issue.reason}: ${issue.value.slice(0, 50)}\n`
        );
      }
      if (impure.length > 20) {
        process.stdout.write(`  … and ${impure.length - 20} more\n`);
      }
    }

    if (mode === 'completeness' || mode === 'both') {
      const issues = findIncompleteRecords(abs);
      if (issues.length > 0) {
        totalIncomplete += issues.length;
        process.stdout.write(`\n${file}: ${issues.length} incomplete (completeness)\n`);
        for (const issue of issues.slice(0, 20)) {
          const id = issue.recordIdentifier ? ` "${issue.recordIdentifier}"` : '';
          process.stdout.write(
            `  L${issue.recordStartLine} ${issue.schema}${id}: missing ${issue.missingFields.join(', ')}\n`
          );
        }
        if (issues.length > 20) {
          process.stdout.write(`  … and ${issues.length - 20} more\n`);
        }
      }
    }
  }

  if (totalUnpaired + totalIncomplete + totalImpure > 0) {
    process.stderr.write(
      `\nTotal: ${totalUnpaired} unpaired, ${totalIncomplete} incomplete, ${totalImpure} impure across ${files.length} file(s)\n`
    );
    process.exit(1);
  }
  process.stdout.write('OK — all checks pass.\n');
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('i18n-pair.ts')) {
  void cliMain().catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.stack || error.message : String(error)}\n`);
    process.exit(1);
  });
}
