import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { findRecordBlock, readArrayField, writeArrayField, applyAcceptedToRecord } from '../lib/codemod';

// We test against a minimal fixture string that mirrors the shape of
// src/data/debates.ts: an array of object literals with id + various
// related* fields.

const FIXTURE = `export const debates = [
  {
    id: 'oral-answer-4117',
    title: 'Sample',
    relatedPolicyIds: [],
    relatedLeverNumbers: [1, 2],
  },
  {
    id: 'oral-answer-4115',
    title: 'Another',
    relatedPolicyIds: ['existing-policy'],
  },
  {
    id: 'no-related-yet',
    title: 'Plain',
  },
];
`;

describe('findRecordBlock', () => {
  it('finds the brace pair around an id', () => {
    const block = findRecordBlock(FIXTURE, 'oral-answer-4117');
    assert.ok(block);
    const slice = FIXTURE.slice(block!.open, block!.close + 1);
    assert.match(slice, /id:\s*'oral-answer-4117'/);
    assert.match(slice, /relatedLeverNumbers:/);
    assert.ok(slice.startsWith('{'));
    assert.ok(slice.endsWith('}'));
  });

  it('returns null for an unknown id', () => {
    assert.equal(findRecordBlock(FIXTURE, 'does-not-exist'), null);
  });

  it('handles records without the target field', () => {
    const block = findRecordBlock(FIXTURE, 'no-related-yet');
    assert.ok(block);
  });
});

describe('readArrayField', () => {
  it('returns empty for an empty literal', () => {
    const block = findRecordBlock(FIXTURE, 'oral-answer-4117')!;
    assert.deepEqual(readArrayField(FIXTURE, block.open, block.close, 'relatedPolicyIds'), []);
  });

  it('returns existing values for a populated literal', () => {
    const block = findRecordBlock(FIXTURE, 'oral-answer-4115')!;
    assert.deepEqual(readArrayField(FIXTURE, block.open, block.close, 'relatedPolicyIds'), ['existing-policy']);
  });

  it('returns null when the field is missing', () => {
    const block = findRecordBlock(FIXTURE, 'no-related-yet')!;
    assert.equal(readArrayField(FIXTURE, block.open, block.close, 'relatedPolicyIds'), null);
  });
});

describe('writeArrayField', () => {
  it('replaces an existing empty literal in place', () => {
    const block = findRecordBlock(FIXTURE, 'oral-answer-4117')!;
    const out = writeArrayField(FIXTURE, block.open, block.close, 'relatedPolicyIds', ['nais-2-0', 'iso-42119']);
    assert.match(out, /relatedPolicyIds: \['nais-2-0', 'iso-42119'\]/);
    // Other fields untouched.
    assert.match(out, /relatedLeverNumbers:\s*\[1,\s*2\]/);
  });

  it('overwrites an existing populated literal', () => {
    const block = findRecordBlock(FIXTURE, 'oral-answer-4115')!;
    const out = writeArrayField(FIXTURE, block.open, block.close, 'relatedPolicyIds', ['new-id']);
    assert.match(out, /id: 'oral-answer-4115',[\s\S]*relatedPolicyIds: \['new-id'\]/);
    assert.ok(!out.includes("'existing-policy'"));
  });

  it('inserts the field when missing', () => {
    const block = findRecordBlock(FIXTURE, 'no-related-yet')!;
    const out = writeArrayField(FIXTURE, block.open, block.close, 'relatedPolicyIds', ['x']);
    assert.match(out, /id: 'no-related-yet'[\s\S]*relatedPolicyIds: \['x'\]/);
  });
});

describe('applyAcceptedToRecord', () => {
  it('merges new ids with existing ones (de-duped)', () => {
    const src = { path: 'fake.ts', text: FIXTURE };
    const result = applyAcceptedToRecord(src, 'debates', 'relatedPolicyIds', 'oral-answer-4115', [
      'existing-policy',
      'new-id',
    ]);
    assert.equal(result.found, true);
    assert.deepEqual(result.before, ['existing-policy']);
    assert.deepEqual(result.after, ['existing-policy', 'new-id']);
    assert.match(src.text, /relatedPolicyIds: \['existing-policy', 'new-id'\]/);
  });

  it('returns found=false when the record id does not exist', () => {
    const src = { path: 'fake.ts', text: FIXTURE };
    const result = applyAcceptedToRecord(src, 'debates', 'relatedPolicyIds', 'ghost-id', ['x']);
    assert.equal(result.found, false);
    // text untouched
    assert.equal(src.text, FIXTURE);
  });

  it('does nothing when accepted is empty', () => {
    const src = { path: 'fake.ts', text: FIXTURE };
    const result = applyAcceptedToRecord(src, 'debates', 'relatedPolicyIds', 'oral-answer-4117', []);
    assert.equal(result.found, false);
    assert.equal(src.text, FIXTURE);
  });
});
