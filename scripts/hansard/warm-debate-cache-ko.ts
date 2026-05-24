import { resolve } from 'node:path';
import { debateTranscripts } from '../../src/data/debate-transcripts.ts';
import { translateBatch } from '../lib/translate.ts';
import { ensureClaudeAvailable } from '../lib/llm.ts';

const CACHE_DIR = resolve('scripts/hansard/data/translate-cache-ko');
const idsArg = process.argv.find((a) => a.startsWith('--ids='));
const ids = idsArg ? idsArg.split('=')[1].split(',') : [];

async function main() {
  ensureClaudeAvailable();
  for (const id of ids) {
    const record = debateTranscripts[id];
    if (!record?.paragraphs?.length) { console.log(`skip ${id}: no paragraphs`); continue; }
    console.log(`warming ${id} (${record.paragraphs.length} paras)...`);
    try {
      await translateBatch(record.paragraphs, { direction: 'zh→ko', cacheDir: CACHE_DIR });
      console.log(`  done ${id}`);
    } catch (e) { console.log(`  fail ${id}: ${(e as Error).message}`); }
  }
  console.log('all done');
}
await main();
