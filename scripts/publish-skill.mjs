// scripts/publish-skill.mjs
// ────────────────────────────────────────────────────────────────────────
// Copy the agent skill from `skill/` (the source of truth, reviewed in git)
// into `public/skill/`, so Astro ships it as static files and agents can
// install straight from the site:
//
//   curl -L https://sgai.md/skill/SKILL.md -o ~/.claude/skills/sgai/SKILL.md
//
// Wired as `prebuild` + `predev` in package.json. `public/skill/` is
// gitignored — never edit it by hand, edit `skill/` and rebuild.
//
// Plain Node, zero deps: this runs before anything else in the build.

import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const REPO_ROOT = resolve(import.meta.dirname, '..');
const SRC_DIR = resolve(REPO_ROOT, 'skill');
const OUT_DIR = resolve(REPO_ROOT, 'public/skill');

const FILES = ['SKILL.md', 'url-map.json', 'README.md'];

mkdirSync(OUT_DIR, { recursive: true });
for (const file of FILES) {
  copyFileSync(resolve(SRC_DIR, file), resolve(OUT_DIR, file));
}

console.log(`publish-skill: copied ${FILES.length} file(s) to public/skill/`);
