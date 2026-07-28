// Prompt-assembly tests for the shared AI-relevance judge — no LLM calls.
// Guards the requireScope contract added for issue #166: `scope` alone asks
// "is this about AI?", which let global AI stories (China model launches,
// US chip deals) through whole-domain sources like the BT tech feed.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { buildSystemPrompt } from '../judge-ai-relevance.ts';

test('without requireScope: single-condition decision rule (backward compatible)', () => {
  const prompt = buildSystemPrompt('a news article', 'AI things');
  assert.match(prompt, /SUBSTANTIVELY concern AI things/);
  assert.match(prompt, /relevant=true\s+→ the subject is central/);
  assert.doesNotMatch(prompt, /Condition A/);
  assert.doesNotMatch(prompt, /BOTH/);
});

test('with requireScope: both conditions are NECESSARY', () => {
  const prompt = buildSystemPrompt('a news article', 'AI companies and funding', 'a substantive Singapore nexus');
  assert.match(prompt, /BOTH conditions must hold/);
  assert.match(prompt, /Condition A: the piece substantively concerns AI companies and funding/);
  assert.match(prompt, /Condition B: the piece has a substantive Singapore nexus/);
  assert.match(prompt, /relevant=true\s+→ A AND B both hold/);
  assert.match(prompt, /satisfies A but not B is off-topic/);
});

test('output schema line is identical in both modes (parse contract unchanged)', () => {
  const schemaLine = '{ "relevant": boolean, "confidence": "high"|"medium"|"low", "reason": string }';
  assert.ok(buildSystemPrompt('a doc', 'AI').includes(schemaLine));
  assert.ok(buildSystemPrompt('a doc', 'AI', 'a Singapore nexus').includes(schemaLine));
});
