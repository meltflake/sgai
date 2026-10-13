// Unit tests for the TS-source record field upsert used by the video
// transcript ja/ko translators. Guards the 2026-10-09 bug: prettier folds a
// 1-paragraph array onto one line (`paragraphs: ['[音乐] >> 嗚！'],`) and the
// old multi-line-only regex threw "No paragraphs block found in record v120".

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { format } from 'prettier';

import { findFieldSpan, upsertRecordField } from '../ts-record-fields.ts';

const FIXTURE = `export const videoTranscripts: Record<string, VideoTranscript> = {
  v120: {
    videoId: 'v120',
    paragraphs: ['[音乐] >> 嗚！'],
    paragraphsEn: ['[music] >> Woo!'],
  },
  v121: {
    videoId: 'v121',
    paragraphs: [
      'a ] bracket inside a string',
      "it's \\"quoted\\" [x]",
    ],
    paragraphsEn: [
      'a',
      'b',
    ],
    paragraphsJa: ['old'],
  },
};
`;

const JA = `    paragraphsJa: [\n      ${JSON.stringify('[音楽] >> ウー！')},\n    ],`;

async function assertPrettierAccepts(source: string): Promise<void> {
  await format(source, { parser: 'typescript' });
}

test('finds a one-line array field', () => {
  const body = FIXTURE.slice(FIXTURE.indexOf('v120: {'), FIXTURE.indexOf('v121: {'));
  const span = findFieldSpan(body, 'paragraphsEn');
  assert.ok(span);
  assert.equal(body.slice(span.start, span.end), "\n    paragraphsEn: ['[music] >> Woo!'],");
});

test('ignores brackets and quotes inside strings', () => {
  const body = FIXTURE.slice(FIXTURE.indexOf('v121: {'));
  const span = findFieldSpan(body, 'paragraphs');
  assert.ok(span);
  assert.ok(body.slice(span.start, span.end).endsWith('[x]",\n    ],'));
});

test('inserts after a one-line paragraphsEn anchor (the v120 bug)', async () => {
  const out = upsertRecordField(FIXTURE, 'v120', 'paragraphsJa', JA, ['paragraphsEn', 'paragraphs']);
  assert.ok(out.includes(`paragraphsEn: ['[music] >> Woo!'],\n${JA}\n  },\n  v121`));
  await assertPrettierAccepts(out);
});

test('falls back to a one-line paragraphs anchor', async () => {
  const noEn = FIXTURE.replace("    paragraphsEn: ['[music] >> Woo!'],\n", '');
  const out = upsertRecordField(noEn, 'v120', 'paragraphsJa', JA, ['paragraphsEn', 'paragraphs']);
  assert.ok(out.includes(`paragraphs: ['[音乐] >> 嗚！'],\n${JA}\n  },`));
  await assertPrettierAccepts(out);
});

test('replaces an existing one-line field instead of adding a second one', async () => {
  const out = upsertRecordField(FIXTURE, 'v121', 'paragraphsJa', JA, ['paragraphsEn']);
  assert.ok(!out.includes("paragraphsJa: ['old']"));
  assert.equal(out.split('paragraphsJa:').length, 2);
  await assertPrettierAccepts(out);
});

test('keeps $1 in values literal (rule #9)', () => {
  const value = `    paragraphsJa: [\n      ${JSON.stringify('$1,500 と $&')},\n    ],`;
  const out = upsertRecordField(FIXTURE, 'v120', 'paragraphsJa', value, ['paragraphsEn']);
  assert.ok(out.includes('"$1,500 と $&"'));
});

test('throws with the anchor names when no anchor exists', () => {
  assert.throws(
    () => upsertRecordField(FIXTURE, 'v120', 'digestJa', '    digestJa: {},', ['digestEn', 'digest']),
    /No anchor \(digestEn, digest\) found in record v120/
  );
});

test('throws when the record does not exist', () => {
  assert.throws(() => upsertRecordField(FIXTURE, 'v999', 'paragraphsJa', JA, ['paragraphs']), /v999/);
});
