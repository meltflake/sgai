// scripts/i18n-config.ts
// ────────────────────────────────────────────────────────────────────────
// Schema-aware i18n config used by `scripts/lib/i18n-pair.ts`.
//
// Two-layer semantics, both enforced by i18n-pair:
//
//   (1) ALIGNMENT — every <field> with CJK content has each authored-locale
//       sibling populated. (Was EN-only in v1; preserved for back-compat.)
//
//   (2) COMPLETENESS — for every required field declared here, both the zh
//       side and every locale sibling must be non-empty + non-placeholder.
//
// Schema scope is disambiguated by `containingArray` (the AST identifier
// of the array literal the record sits inside). Ecosystem categories live
// at top-level `ecosystemCategories`; individual entities live inside the
// `entities` array of a category. Nested arrays like `milestones` /
// `leaders` are handled by their own (lighter) schemas if needed.
//
// Locale suffixes are derived from src/i18n/index.ts:
//   - DEFAULT_LOCALE (currently zh) is the source side and uses bare fields
//   - derived locales (currently zh-tw) are covered by their conversion
//     contract plus dist residue checks
//   - every other locale must have sibling fields and is checked here
//
// Files that don't have an entry below get only the legacy alignment
// check (no completeness gate). Add a FileSchema as you grow confidence
// the data file is "complete enough" to enforce a schema.

import { dataSiblingSuffixes } from './lib/i18n-locales.mjs';

export interface FieldRule {
  /** Source-side field name (zh by convention) */
  field: string;
  /** Locale suffixes for sibling fields. e.g. ['En'] = `<field>En` must mirror */
  locales: string[];
  /**
   * True = source-side must be non-empty + non-placeholder, AND every locale
   * sibling must be too. False/undefined = the field may be absent, but once
   * present every locale sibling is required.
   */
  required?: boolean;
}

export interface RecordSchema {
  /** Schema name shown in error reports (e.g. 'entity', 'category') */
  name: string;
  /**
   * AST predicate: the object literal must be a direct element of an array
   * whose binding name (PropertyAssignment key OR top-level VariableDeclaration)
   * equals this string.
   *
   * Example: `entities: [ {...} ]` => containingArray='entities'
   */
  containingArray: string;
  /** Field rules. Fields not listed are not checked under completeness. */
  fields: FieldRule[];
}

export interface FileSchema {
  /** Path relative to project root, matched as a suffix of the resolved file path */
  file: string;
  /** Schemas applicable to records inside this file */
  schemas: RecordSchema[];
}

const FULL_LOCALES = dataSiblingSuffixes();

export const I18N_CONFIG: FileSchema[] = [
  {
    file: 'src/data/ecosystem.ts',
    schemas: [
      {
        name: 'category',
        containingArray: 'ecosystemCategories',
        fields: [
          { field: 'name', locales: FULL_LOCALES, required: true },
          { field: 'description', locales: FULL_LOCALES, required: true },
        ],
      },
      {
        name: 'entity',
        containingArray: 'entities',
        fields: [
          { field: 'name', locales: FULL_LOCALES, required: true },
          { field: 'description', locales: FULL_LOCALES, required: true },
          { field: 'summary', locales: FULL_LOCALES },
          { field: 'whatItIs', locales: FULL_LOCALES, required: true },
          { field: 'aiRelevance', locales: FULL_LOCALES, required: true },
          { field: 'singaporeRelevance', locales: FULL_LOCALES, required: true },
          { field: 'headquarters', locales: FULL_LOCALES },
          { field: 'parentOrg', locales: FULL_LOCALES },
          { field: 'ministry', locales: FULL_LOCALES },
          { field: 'scale', locales: FULL_LOCALES },
        ],
      },
      {
        name: 'ecosystem-milestone',
        containingArray: 'milestones',
        fields: [
          { field: 'title', locales: FULL_LOCALES, required: true },
          { field: 'description', locales: FULL_LOCALES },
        ],
      },
      {
        name: 'ecosystem-leader',
        containingArray: 'leaders',
        fields: [{ field: 'title', locales: FULL_LOCALES }],
      },
      {
        name: 'ecosystem-subitem',
        containingArray: 'products',
        fields: [
          { field: 'name', locales: FULL_LOCALES, required: true },
          { field: 'description', locales: FULL_LOCALES },
        ],
      },
      {
        name: 'ecosystem-partner',
        containingArray: 'partners',
        fields: [
          { field: 'name', locales: FULL_LOCALES, required: true },
          { field: 'description', locales: FULL_LOCALES },
        ],
      },
      {
        name: 'ecosystem-source',
        containingArray: 'sources',
        fields: [{ field: 'label', locales: FULL_LOCALES, required: true }],
      },
      {
        name: 'ecosystem-further-reading',
        containingArray: 'furtherReading',
        fields: [{ field: 'label', locales: FULL_LOCALES, required: true }],
      },
    ],
  },
  {
    file: 'src/data/policies.ts',
    schemas: [
      {
        name: 'policy-category',
        containingArray: 'categories',
        fields: [{ field: 'name', locales: FULL_LOCALES, required: true }],
      },
      {
        name: 'policy',
        containingArray: 'policies',
        fields: [
          { field: 'title', locales: FULL_LOCALES, required: true },
          { field: 'source', locales: FULL_LOCALES, required: true },
          { field: 'summary', locales: FULL_LOCALES, required: true },
          { field: 'content', locales: FULL_LOCALES, required: true },
        ],
      },
      {
        name: 'policy-fact',
        containingArray: 'keyFacts',
        fields: [
          { field: 'label', locales: FULL_LOCALES, required: true },
          { field: 'value', locales: FULL_LOCALES, required: true },
        ],
      },
      {
        name: 'policy-section',
        containingArray: 'sections',
        fields: [
          { field: 'title', locales: FULL_LOCALES, required: true },
          { field: 'body', locales: FULL_LOCALES, required: true },
        ],
      },
      {
        name: 'policy-milestone',
        containingArray: 'milestones',
        fields: [
          { field: 'title', locales: FULL_LOCALES, required: true },
          { field: 'description', locales: FULL_LOCALES },
        ],
      },
      {
        name: 'policy-resource',
        containingArray: 'resources',
        fields: [{ field: 'label', locales: FULL_LOCALES, required: true }],
      },
    ],
  },
  {
    file: 'src/data/levers.ts',
    schemas: [
      {
        name: 'lever',
        containingArray: 'levers',
        fields: [
          { field: 'name', locales: FULL_LOCALES, required: true },
          { field: 'subtitle', locales: FULL_LOCALES, required: true },
          { field: 'whatStateDoes', locales: FULL_LOCALES, required: true },
          { field: 'bottleneckSolved', locales: FULL_LOCALES, required: true },
          { field: 'insight', locales: FULL_LOCALES },
        ],
      },
      {
        name: 'lever-group',
        containingArray: 'groups',
        fields: [{ field: 'title', locales: FULL_LOCALES, required: true }],
      },
      {
        name: 'lever-item',
        containingArray: 'items',
        fields: [
          { field: 'name', locales: FULL_LOCALES, required: true },
          { field: 'ministry', locales: FULL_LOCALES, required: true },
          { field: 'scale', locales: FULL_LOCALES },
          { field: 'description', locales: FULL_LOCALES, required: true },
        ],
      },
    ],
  },
  {
    file: 'src/data/voices.ts',
    schemas: [
      {
        name: 'institution',
        containingArray: 'institutions',
        fields: [
          { field: 'name', locales: FULL_LOCALES, required: true },
          { field: 'role', locales: FULL_LOCALES, required: true },
        ],
      },
      {
        name: 'social-channel',
        containingArray: 'channels',
        fields: [{ field: 'label', locales: FULL_LOCALES }],
      },
      {
        name: 'mddi-speech',
        containingArray: 'mddiSpeeches',
        fields: [
          { field: 'title', locales: FULL_LOCALES, required: true },
          { field: 'speakerTitle', locales: FULL_LOCALES, required: true },
          { field: 'event', locales: FULL_LOCALES, required: true },
        ],
      },
    ],
  },
  // Future: people.ts, debates.ts, tracker.ts, etc.
  // Add schemas as each file's data is curated to a known-complete state.
];

/** Strings treated as "empty / placeholder" for completeness purposes. */
export const PLACEHOLDER_VALUES: ReadonlyArray<string | RegExp> = [
  '',
  'Profile pending.',
  /^\[需补充\]/,
  /^\[TODO\]/i,
  /^TBD$/i,
];

export function isPlaceholderValue(value: string): boolean {
  for (const p of PLACEHOLDER_VALUES) {
    if (typeof p === 'string') {
      if (value === p) return true;
    } else if (p.test(value)) {
      return true;
    }
  }
  return false;
}
