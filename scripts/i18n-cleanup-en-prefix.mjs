// scripts/i18n-cleanup-en-prefix.mjs
// Strip the legacy `/en/` URL prefix from internal references after the
// Phase 2 routing migration (en is now the route default at `/`).
//
// Match shapes (string-quoted, attribute-valued, template-literal):
//   '/en/foo/'      → '/foo/'
//   "/en/foo/"      → "/foo/"
//   `/en/foo/`      → `/foo/`
//   href="/en/foo/" → href="/foo/"
//
// Skip external hosts: anything matching `://<host>/en/` keeps the prefix
// (e.g. edb.gov.sg/en/, oecd.ai/en/, EU /en/).
//
// Special case: `https://sgai.md/en/` → `https://sgai.md/` (this site's
// own canonical URLs in JSON-LD).

import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';

function listTargets() {
  const out = execSync(`rg -l "/en/" src`, { encoding: 'utf8' });
  return out.split('\n').filter(Boolean);
}

function transform(src) {
  let out = src;

  // 1. Special: own-domain canonical URLs.
  out = out.replaceAll('https://sgai.md/en/', 'https://sgai.md/');

  // 2. Internal paths preceded by a string-opening token (quote, backtick,
  //    paren, equals — but NOT a dot/letter, which would indicate a host).
  //    Pattern matches `/en/` only when the preceding char isn't part of a
  //    hostname token.
  out = out.replace(/(?<![a-zA-Z0-9.])\/en\//g, '/');

  return out;
}

const files = listTargets();
let changed = 0;
for (const f of files) {
  try {
    statSync(f);
  } catch {
    continue;
  }
  const orig = readFileSync(f, 'utf8');
  const next = transform(orig);
  if (next !== orig) {
    writeFileSync(f, next);
    changed += 1;
    console.log(`[edit] ${f}`);
  }
}
console.log(`Done. ${changed}/${files.length} files updated.`);
