// scripts/i18n-config.ts
// ────────────────────────────────────────────────────────────────────────
// Schema-aware i18n config used by `scripts/lib/i18n-pair.ts`.
//
// Two-layer semantics, both enforced by i18n-pair:
//
//   (1) ALIGNMENT — every <field> with CJK content has its <field>En sibling
//       populated. (Was the only check in v1; preserved for back-compat.)
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
// Locales are explicit data, not hard-coded. To add ja / ko later:
//   - extend `locales: ['En', 'Ja', 'Ko']` per field
//   - add corresponding `<field>Ja` / `<field>Ko` properties in the data file
//   - i18n-pair auto-checks every locale sibling
//
// Files that don't have an entry below get only the legacy alignment
// check (no completeness gate). Add a FileSchema as you grow confidence
// the data file is "complete enough" to enforce a schema.

export interface FieldRule {
  /** Source-side field name (zh by convention) */
  field: string;
  /** Locale suffixes for sibling fields. e.g. ['En'] = `<field>En` must mirror */
  locales: string[];
  /** True = source-side must be non-empty + non-placeholder, AND every locale sibling must be too */
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

export const I18N_CONFIG: FileSchema[] = [
  {
    file: 'src/data/ecosystem.ts',
    schemas: [
      {
        name: 'category',
        containingArray: 'ecosystemCategories',
        fields: [
          { field: 'name', locales: ['En'], required: true },
          { field: 'description', locales: ['En'], required: true },
        ],
      },
      {
        name: 'entity',
        containingArray: 'entities',
        fields: [
          { field: 'name', locales: ['En'], required: true },
          { field: 'description', locales: ['En'], required: true },
          { field: 'whatItIs', locales: ['En'], required: true },
          { field: 'aiRelevance', locales: ['En'], required: true },
          { field: 'singaporeRelevance', locales: ['En'], required: true },
        ],
      },
    ],
  },
  // Future: people.ts, debates.ts, policies.ts, etc.
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
