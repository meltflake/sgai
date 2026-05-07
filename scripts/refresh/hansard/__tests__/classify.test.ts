// Sanity tests for the TS classifier port. Mirrors scripts/hansard/test_classify.py.
//
// Run: npm run test:lib  (the lib runner picks up __tests__/*.test.ts).

import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { classify, isAiRelated } from '../classify.ts';

describe('hansard refresh classify', () => {
  it('STRONG: CII title with AI vendor angle', () => {
    const { bucket } = classify(
      "Mandatory Government Security Vetting for Personnel with Access to Singapore's Critical Information Infrastructure",
      "The Workers' Party asked about CII personnel and AI vendor risk."
    );
    assert.equal(bucket, 'STRONG');
  });

  it('STRONG: Singpass facial recognition fallback', () => {
    const { bucket } = classify(
      'Alternative Singpass Identity Options Apart from Facial Verification',
      'users with medical conditions cannot use facial recognition technology.'
    );
    assert.equal(bucket, 'STRONG');
  });

  it('STRONG: COS body with AI mention even when title is generic', () => {
    const { bucket } = classify(
      'Committee of Supply – Head K (Ministry of Education)',
      'uncertainty and challenges brought about by artificial intelligence (AI) and the existential threat'
    );
    assert.equal(bucket, 'STRONG');
  });

  it('STRONG: autonomous vehicle accident', () => {
    const { bucket } = classify(
      'Investigation Findings of Accident Involving Autonomous Vehicle on 17 January 2026',
      "the autonomous vehicle's response when it detected a small object on the road"
    );
    assert.equal(bucket, 'STRONG');
  });

  it('NO: case-sensitive AI does not match remain/available/obtain', () => {
    const { bucket } = classify(
      'Maintaining Drainage Capacity in Bukit Panjang',
      'the contractor will obtain available certifications and remain compliant.'
    );
    assert.equal(bucket, 'NO');
  });

  it('INFRA (not actionable): Section 301 semiconductor with no AI angle', () => {
    const result = classify(
      "Assessment of Tariff-impact on Singapore's Trade Sectors following US' Section 301 Investigations",
      'global semiconductor capacity and excess production for trade purposes only.'
    );
    assert.equal(result.bucket, 'INFRA');
    assert.equal(isAiRelated(result.bucket), false);
  });

  it('Gaming-disorder debate stays out of STRONG', () => {
    const { bucket } = classify(
      'Community Support Services to Address Gaming Disorder Among Young Adults',
      'concerns about how algorithms engineer addiction in mobile games.'
    );
    assert.notEqual(bucket, 'STRONG');
  });

  it('INFRA+: data centre + GPU + sovereign co-occurrence', () => {
    const { bucket } = classify(
      'Energy Demand of New Data Centres in Singapore',
      'GPU clusters at the new data centre will support sovereign compute capacity.'
    );
    // STRONG (sovereign compute) or INFRA+ both acceptable — the assertion
    // is "this debate is actionable."
    assert.equal(['STRONG', 'INFRA+'].includes(bucket), true);
    assert.equal(isAiRelated(bucket), true);
  });
});
