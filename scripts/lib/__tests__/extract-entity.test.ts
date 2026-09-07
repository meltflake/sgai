// scripts/lib/__tests__/extract-entity.test.ts
//
// extractEntity hits the claude CLI. Tests cover output normalisation and
// the cache path (pre-seeded JSON) so no LLM call is made.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

import { buildSystemPrompt, extractEntity, normalizeModelOutput } from '../extract-entity.ts';

const TYPES = ['agency', 'institute', 'partner', 'product', 'program'] as const;

test('normalizeModelOutput: proper name wins over headline, type must be in the closed set', () => {
  const e = normalizeModelOutput(
    {
      isEntity: true,
      nameEn: 'Sembcorp Industries',
      nameZh: '胜科工业',
      entityType: 'partner',
      foundedYear: null,
      confidence: 'high',
      reason: 'Op-ed by Sembcorp COO about powering AI.',
    },
    'The AI Push Is Becoming an Energy Race: Sembcorp',
    TYPES
  );
  assert.equal(e.nameEn, 'Sembcorp Industries');
  assert.equal(e.nameZh, '胜科工业');
  assert.equal(e.entityType, 'partner');
  assert.equal(e.foundedYear, null);
});

test('normalizeModelOutput: unknown type → null; non-year foundedYear → null; missing zh → nameEn', () => {
  const e = normalizeModelOutput(
    { isEntity: true, nameEn: 'GovTech', entityType: 'company', foundedYear: '2020-06', confidence: 'medium' },
    'headline',
    TYPES
  );
  assert.equal(e.entityType, null);
  assert.equal(e.foundedYear, null);
  assert.equal(e.nameZh, 'GovTech');
  assert.equal(normalizeModelOutput({ foundedYear: 2016 }, 'h', TYPES).foundedYear, '2016');
});

test('normalizeModelOutput: empty / garbage output falls back to headline, low confidence, not an entity', () => {
  const e = normalizeModelOutput({}, 'Some Headline', TYPES);
  assert.equal(e.isEntity, false);
  assert.equal(e.nameEn, 'Some Headline');
  assert.equal(e.confidence, 'low');
});

test('buildSystemPrompt: names the closed type set and forbids headline-as-name', () => {
  const p = buildSystemPrompt(TYPES);
  assert.match(p, /"agency", "institute", "partner", "product", "program"/);
  assert.match(p, /NEVER the headline/);
  assert.match(p, /Publication dates are NOT founding dates/);
  const glossed = buildSystemPrompt(TYPES, { partner: 'a company or industry player' });
  assert.match(glossed, /"partner" \(a company or industry player\)/);
});

test('extractEntity: rejects empty entityTypes', async () => {
  await assert.rejects(
    extractEntity({ title: 'x', contentText: 'y' }, { entityTypes: [] }),
    /entityTypes list is required/
  );
});

test('extractEntity: returns cached verdict without calling the LLM', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'sgai-extract-entity-'));
  try {
    const input = { title: 'Headline', contentText: 'Body text about Acme AI Lab.', sourceUrl: 'https://x.sg/a' };
    const hash = createHash('sha256')
      .update(`${input.sourceUrl}::${input.title}::${input.contentText.slice(0, 5000)}`)
      .digest('hex');
    const seeded = {
      isEntity: true,
      nameEn: 'Acme AI Lab',
      nameZh: 'Acme AI Lab',
      entityType: 'institute',
      foundedYear: '2021',
      confidence: 'high',
      reason: 'seeded',
    };
    writeFileSync(join(dir, `${hash}.json`), JSON.stringify(seeded));
    const e = await extractEntity(input, { entityTypes: TYPES, cacheDir: dir });
    assert.deepEqual(e, seeded);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
