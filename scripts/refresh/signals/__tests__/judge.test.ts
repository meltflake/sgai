// scripts/refresh/signals/__tests__/judge.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { parseJudgment } from '../judge.ts';

const TOPICS = new Set(['governance-regulation', 'safety-ethics', 'finance', 'healthcare']);
const ok = {
  singapore: true,
  ai: true,
  score: 4,
  reason: 'First binding rule',
  titleZh: '新加坡发布智能体治理框架',
  topicIds: ['governance-regulation', 'safety-ethics'],
  eventKey: 'IMDA Agentic Framework v2!',
};

test('parseJudgment: valid JSON, eventKey normalised', () => {
  const j = parseJudgment(JSON.stringify(ok), TOPICS);
  assert.ok(j);
  assert.equal(j.score, 4);
  assert.equal(j.eventKey, 'imda-agentic-framework-v2');
  assert.deepEqual(j.topicIds, ['governance-regulation', 'safety-ethics']);
});

test('parseJudgment: fenced JSON with prose around it', () => {
  const j = parseJudgment('Here you go:\n```json\n' + JSON.stringify(ok) + '\n```', TOPICS);
  assert.equal(j?.titleZh, '新加坡发布智能体治理框架');
});

test('parseJudgment: malformed JSON → null', () => {
  assert.equal(parseJudgment('{"singapore": true, "ai": ', TOPICS), null);
  assert.equal(parseJudgment('no json here', TOPICS), null);
});

test('parseJudgment: unknown topics filtered, duplicates removed, more than 3 trimmed', () => {
  const j = parseJudgment(
    JSON.stringify({ ...ok, topicIds: ['finance', 'nope', 'finance', 'healthcare', 'safety-ethics', 'governance-regulation'] }),
    TOPICS
  );
  assert.deepEqual(j?.topicIds, ['finance', 'healthcare', 'safety-ethics']);
});

test('parseJudgment: zero valid topics → null', () => {
  assert.equal(parseJudgment(JSON.stringify({ ...ok, topicIds: ['nope'] }), TOPICS), null);
});

test('parseJudgment: score clamped to 1..5 and rounded', () => {
  assert.equal(parseJudgment(JSON.stringify({ ...ok, score: 9 }), TOPICS)?.score, 5);
  assert.equal(parseJudgment(JSON.stringify({ ...ok, score: -2 }), TOPICS)?.score, 1);
  assert.equal(parseJudgment(JSON.stringify({ ...ok, score: '3.6' }), TOPICS)?.score, 4);
});

test('parseJudgment: wrong types or a non-Chinese title → null', () => {
  assert.equal(parseJudgment(JSON.stringify({ ...ok, singapore: 'yes' }), TOPICS), null);
  assert.equal(parseJudgment(JSON.stringify({ ...ok, titleZh: 'English only title' }), TOPICS), null);
  assert.equal(parseJudgment(JSON.stringify({ ...ok, score: 'high' }), TOPICS), null);
});
