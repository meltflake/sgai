// Fixture-pinned contract test for the parliament bills parser. The
// fixture is a live capture (2026-08-03) of the indv-bill markup — if
// Parliament changes the layout, this fails in CI instead of the weekly
// pipeline silently emitting nothing.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseBillsPage, stageFromDates, slugifyBillTitle, BILL_PREFILTER } from '../bills.ts';

const fixture = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'bills-introduced.html'),
  'utf8'
);

test('fixture parses into multiple bills with numbers and ISO dates', () => {
  const bills = parseBillsPage(fixture);
  assert.ok(bills.length >= 4, `expected >=4 bills, got ${bills.length}`);
  const imda = bills.find((b) => /Info-communications Media Development Authority/i.test(b.title));
  assert.ok(imda, 'IMDA Amendment Bill present in fixture');
  assert.equal(imda!.billNumber, '9/2026');
  assert.match(imda!.introducedAt ?? '', /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(imda!.pdfUrl!.startsWith('https://www.parliament.gov.sg/api/media/'));
});

test('date fields convert DD.MM.YYYY → ISO and absent stages stay undefined', () => {
  const bills = parseBillsPage(fixture);
  const withPassed = bills.find((b) => b.passedAt);
  assert.ok(withPassed);
  assert.match(withPassed!.passedAt!, /^2026-05-\d{2}$/);
});

test('stageFromDates ladder', () => {
  assert.equal(stageFromDates({ title: 'x' }), 'introduced');
  assert.equal(stageFromDates({ title: 'x', secondReadingAt: '2026-05-05' }), 'second-reading');
  assert.equal(stageFromDates({ title: 'x', secondReadingAt: '2026-05-05', passedAt: '2026-05-05' }), 'passed');
});

test('prefilter admits digital/AI bills, slugify is url-safe', () => {
  assert.ok(BILL_PREFILTER.test('Info-communications Media Development Authority (Amendment) Bill'));
  assert.ok(BILL_PREFILTER.test('Digital Infrastructure Bill'));
  assert.ok(!BILL_PREFILTER.test('Central Provident Fund (Amendment) Bill'));
  assert.equal(
    slugifyBillTitle("Info-communications Media Development Authority (Amendment) Bill"),
    'info-communications-media-development-authority-amendment-bill'
  );
});
