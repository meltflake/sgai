import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { videoTranscripts } from '../../../../src/data/video-transcripts.ts';

test('emitting selected videos preserves corrected transcripts outside the selection', () => {
  const root = mkdtempSync(join(tmpdir(), 'sgai-transcript-scope-'));
  try {
    symlinkSync(resolve('node_modules'), join(root, 'node_modules'), 'dir');
    const raw = join(root, 'scripts/videos/data/transcripts');
    const translated = join(root, 'scripts/videos/data/translations');
    mkdirSync(raw, { recursive: true });
    mkdirSync(translated, { recursive: true });
    mkdirSync(join(root, 'src/data'), { recursive: true });
    writeFileSync(join(root, 'src/data/video-transcripts.ts'),
      "export const videoTranscripts = { v124: { videoId: 'v124', source: 'youtube-subtitles', paragraphs: ['Curated translation'] } };\n");
    for (const id of ['v124', 'v127']) {
      writeFileSync(join(raw, `${id}.json`), JSON.stringify({
        videoId: id, youtubeId: id, language: 'en', fetchedAt: '2026-10-28',
        source: 'youtube-subtitles', paragraphs: [`Original ${id}`],
      }));
      writeFileSync(join(translated, `${id}.zh.json`), JSON.stringify({
        translatedAt: '2026-10-28', source: 'manual',
        paragraphs: [id === 'v124' ? 'Stale translation' : 'New translation'],
      }));
    }
    const result = spawnSync(process.execPath, [
      fileURLToPath(import.meta.resolve('tsx/cli')),
      resolve('scripts/videos/fetch-transcripts.ts'), '--emit-only', '--ids=v127',
    ], { cwd: root, encoding: 'utf8', env: { ...process.env, TSX_TSCONFIG_PATH: resolve('tsconfig.json') } });
    assert.equal(result.status, 0, result.stderr);
    const emitted = readFileSync(join(root, 'src/data/video-transcripts.ts'), 'utf8');
    assert.ok(emitted.includes('Curated translation'));
    assert.ok(emitted.includes('New translation'));
    assert.ok(!emitted.includes('Stale translation'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('translated digital economy amounts match the English billion amounts', () => {
  const transcript = videoTranscripts.v124;
  const source = transcript.paragraphsEn!.join(' ').replace(/\.\s+(\d)/g, '.$1');
  const amounts = [...source.matchAll(/(\d+\.\d+) billion Singapore dollars/g)].map((m) => Number(m[1]) * 10);
  assert.equal(amounts.length, 2);
  for (const paragraphs of [transcript.paragraphs, transcript.paragraphsJa!, transcript.paragraphsKo!]) {
    const translated = [...paragraphs.join(' ').matchAll(/(\d+(?:\.\d+)?)[亿億억]/g)].map((m) => Number(m[1]));
    assert.deepEqual(translated, amounts);
  }
});

test('Chinese transcripts retain the official MDDI name', () => {
  for (const transcript of Object.values(videoTranscripts)) {
    assert.doesNotMatch(transcript.paragraphs.join(' '), /数字发展[与和]信息部/, transcript.videoId);
  }
});

// Source: MFA, Official Visit by Friedrich Merz, 27 to 28 October 2026.
test('the Germany visit transcript identifies the officials named by MFA', () => {
  const transcript = videoTranscripts.v127;
  const english = transcript.paragraphsEn!.join(' ');
  for (const name of ['Friedrich Merz', 'Tharman Shanmugaratnam', 'Lee Hsien Loong']) {
    assert.ok(english.includes(name), name);
  }
  assert.doesNotMatch(english, /Friedrich M(?:S|\.)|Thman Shamaratnam|Lisian Lung|Piamong/);
  assert.doesNotMatch(transcript.paragraphs.join(' '), /弗里德里希·M|Thman Shamaratnam|Lisian Lung/);
  assert.doesNotMatch(transcript.paragraphsJa!.join(' '), /フリードリヒ・M|リシャン・ルング/);
  assert.doesNotMatch(transcript.paragraphsKo!.join(' '), /프리드리히 M|Lisian Lung/);
});
