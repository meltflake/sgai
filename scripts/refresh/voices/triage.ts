// scripts/refresh/voices/triage.ts
// ────────────────────────────────────────────────────────────────────────
// Judge-only value triage for backfill candidates. Cheap pass: fetch each
// candidate body + run judgeAiRelevance, WITHOUT the expensive five-language
// translation. Writes a verdict per speech to data/triage.json so a human
// can decide which are worth backfilling (AI is a core theme, not a passing
// mention in a cyber / culture / women-in-tech address).
//
// Resumable: re-running skips speeches already in triage.json.
// Usage: npx tsx scripts/refresh/voices/triage.ts

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { loadState } from '../../lib/state.ts';
import { scan, readExistingSpeechUrls, readExistingSpeechIds } from './scan.ts';
import { fetchSpeeches } from './fetch.ts';
import { judgeAiRelevance } from './judge.ts';

interface Verdict {
  slug: string;
  relevant: boolean;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

const OUT = resolve('scripts/refresh/voices/data/triage.json');

const done: Verdict[] = existsSync(OUT) ? (JSON.parse(readFileSync(OUT, 'utf8')) as Verdict[]) : [];
const doneSet = new Set(done.map((d) => d.slug));

const r = await scan({
  state: loadState(),
  existingUrls: readExistingSpeechUrls(),
  existingSpeechIds: readExistingSpeechIds(),
});
const todo = r.candidates.filter((c) => !doneSet.has(c.speechId));
process.stdout.write(`triage: ${r.candidates.length} candidates, ${done.length} already judged, ${todo.length} to go\n`);

for (const c of todo) {
  try {
    const fr = await fetchSpeeches([{ speechId: c.speechId, sourceUrl: c.sourceUrl }]);
    if (!fr.successes.length) {
      done.push({ slug: c.speechId, relevant: false, confidence: 'low', reason: 'fetch failed' });
    } else {
      const v = await judgeAiRelevance(fr.successes[0]);
      done.push({ slug: c.speechId, relevant: v.relevant, confidence: v.confidence, reason: v.reason });
      const mark = v.relevant ? (v.confidence === 'high' ? '★ HIGH' : `· ${v.confidence}`) : '⊘ no  ';
      process.stdout.write(`${mark} | ${c.speechId.slice(0, 46).padEnd(46)} | ${v.reason.slice(0, 52)}\n`);
    }
  } catch (e) {
    done.push({
      slug: c.speechId,
      relevant: true,
      confidence: 'low',
      reason: `judge error: ${e instanceof Error ? e.message : String(e)}`,
    });
  }
  writeFileSync(OUT, `${JSON.stringify(done, null, 2)}\n`);
}

const hi = done.filter((d) => d.relevant && d.confidence === 'high');
const med = done.filter((d) => d.relevant && d.confidence === 'medium');
const any = done.filter((d) => d.relevant);
process.stdout.write(
  `\nDONE: ${done.length} judged | ★high ${hi.length} | ·medium ${med.length} | relevant-any ${any.length} | ⊘dropped ${done.length - any.length}\n`
);
