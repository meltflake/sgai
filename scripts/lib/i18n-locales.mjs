// scripts/lib/i18n-locales.mjs
// Shared locale discovery for source-level and dist-level i18n gates.
//
// The source of truth is src/i18n/index.ts. Checks must not carry their
// own hard-coded locale lists; otherwise new languages can quietly bypass
// the veto path.

import * as ts from 'typescript';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const SOURCE_LOCALE = 'zh';

// Locales generated from another locale rather than authored as separate
// sibling fields. zh-tw is required, but its contract is OpenCC conversion
// from zh plus dist residue checks, not `titleZhTw` fields everywhere.
export const DERIVED_LOCALE_SOURCES = Object.freeze({
  'zh-tw': 'zh',
});

/**
 * @typedef {{
 *   locales: string[];
 *   sourceLocale: string;
 *   routeDefaultLocale?: string;
 *   derivedLocaleSources: Record<string, string>;
 * }} LocaleConfig
 */

function unwrapExpression(expr) {
  let current = expr;
  while (
    ts.isAsExpression(current) ||
    ts.isTypeAssertionExpression(current) ||
    ts.isSatisfiesExpression(current) ||
    ts.isParenthesizedExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

function parseI18nSource(root = process.cwd()) {
  const file = resolve(root, 'src/i18n/index.ts');
  const source = readFileSync(file, 'utf8');
  return ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
}

function findConstInitializer(sourceFile, name) {
  let found;
  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === name &&
      node.initializer
    ) {
      found = unwrapExpression(node.initializer);
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return found;
}

function readStringConst(sourceFile, name, fallback) {
  const init = findConstInitializer(sourceFile, name);
  if (!init) return fallback;
  if (ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init)) return init.text;
  return fallback;
}

function readStringArrayConst(sourceFile, name) {
  const init = findConstInitializer(sourceFile, name);
  if (!init || !ts.isArrayLiteralExpression(init)) {
    throw new Error(`Cannot find string-array const ${name} in ${sourceFile.fileName}`);
  }
  const values = [];
  for (const el of init.elements) {
    const item = unwrapExpression(el);
    if (!ts.isStringLiteral(item) && !ts.isNoSubstitutionTemplateLiteral(item)) {
      throw new Error(`Non-string locale entry in ${name} at ${sourceFile.fileName}`);
    }
    values.push(item.text);
  }
  return values;
}

/**
 * @param {string} [root]
 * @returns {LocaleConfig & { routeDefaultLocale: string }}
 */
export function getProjectLocaleConfig(root = process.cwd()) {
  const sourceFile = parseI18nSource(root);
  return {
    locales: readStringArrayConst(sourceFile, 'LOCALES'),
    sourceLocale: readStringConst(sourceFile, 'DEFAULT_LOCALE', SOURCE_LOCALE),
    routeDefaultLocale: readStringConst(sourceFile, 'ROUTE_DEFAULT_LOCALE', 'en'),
    derivedLocaleSources: DERIVED_LOCALE_SOURCES,
  };
}

export function getProjectLocales(root = process.cwd()) {
  return getProjectLocaleConfig(root).locales;
}

export function siblingSuffix(locale, sourceLocale = SOURCE_LOCALE) {
  if (locale === sourceLocale) return '';
  return locale
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * @param {string[] | LocaleConfig} [localesOrConfig]
 * @returns {string[]}
 */
export function dataSiblingLocales(localesOrConfig = getProjectLocaleConfig()) {
  const config = Array.isArray(localesOrConfig)
    ? {
        locales: localesOrConfig,
        sourceLocale: SOURCE_LOCALE,
        derivedLocaleSources: DERIVED_LOCALE_SOURCES,
      }
    : localesOrConfig;

  return config.locales.filter(
    (locale) => locale !== config.sourceLocale && !(locale in config.derivedLocaleSources)
  );
}

/**
 * @param {string[] | LocaleConfig} [localesOrConfig]
 * @returns {string[]}
 */
export function dataSiblingSuffixes(localesOrConfig = getProjectLocaleConfig()) {
  const config = Array.isArray(localesOrConfig)
    ? {
        locales: localesOrConfig,
        sourceLocale: SOURCE_LOCALE,
        derivedLocaleSources: DERIVED_LOCALE_SOURCES,
      }
    : localesOrConfig;

  return dataSiblingLocales(config).map((locale) => siblingSuffix(locale, config.sourceLocale));
}

export function localeCoverageSummary(root = process.cwd()) {
  const config = getProjectLocaleConfig(root);
  const derived = Object.entries(config.derivedLocaleSources)
    .filter(([locale]) => config.locales.includes(locale))
    .map(([locale, source]) => `${locale}->${source}`);
  return {
    source: config.sourceLocale,
    routeDefault: config.routeDefaultLocale,
    siblingLocales: dataSiblingLocales(config),
    siblingSuffixes: dataSiblingSuffixes(config),
    derivedLocales: derived,
  };
}
