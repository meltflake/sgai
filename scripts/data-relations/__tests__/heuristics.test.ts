import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  candidatesForDebate,
  deriveConfidence,
  extractKeywords,
  keywordHits,
  ministryFromDebateId,
  ministryFromPersonIds,
  personOverlap,
  topicHits,
  type Signal,
} from '../lib/heuristics';
import type { Debate } from '../../../src/data/debates';
import type { Policy } from '../../../src/data/policies';
import type { Person } from '../../../src/data/people';

// ── Fixture helpers ─────────────────────────────────────────────────────

function fakeDebate(o: Partial<Debate>): Debate {
  return {
    id: 'oral-answer-9999',
    title: 'fake',
    titleEn: 'fake',
    date: '2026-04-01',
    parliament: '15',
    type: 'Oral Answers to Questions',
    speakers: [],
    personIds: [],
    topicIds: [],
    relatedPolicyIds: [],
    relatedLeverNumbers: [],
    relatedTimelineYears: [],
    relatedPostSlugs: [],
    topics: [],
    summary: '',
    summaryEn: '',
    keyPoints: [],
    keyPointsEn: [],
    governmentStance: null,
    oppositionStance: null,
    controversyLevel: 1,
    policySignal: null,
    notableQuote: null,
    transcriptEn: '',
    sourceUrl: '',
    ...o,
  } as Debate;
}

function fakePolicy(o: Partial<Policy> & { id: string; title: string }): Policy {
  return {
    titleEn: o.title,
    date: '2026-01-01',
    source: 'fake',
    summary: '',
    content: '',
    ...o,
  } as Policy;
}

function fakePerson(id: string, affiliations: Person['affiliations']): Person {
  return {
    id,
    name: id,
    nameEn: id,
    title: '',
    titleEn: '',
    summary: '',
    affiliations,
    role: 'minister',
    category: 'government',
    aliases: [],
    channels: [],
  } as unknown as Person;
}

// ── Tests ───────────────────────────────────────────────────────────────

describe('extractKeywords', () => {
  it('drops stop words and short tokens', () => {
    assert.deepEqual(extractKeywords('The Cybersecurity Act of 2024'), ['cybersecurity', '2024']);
  });

  it('returns empty for empty input', () => {
    assert.deepEqual(extractKeywords(''), []);
  });

  it('drops generic Singapore tokens', () => {
    assert.deepEqual(extractKeywords('Singapore AI Strategy'), ['strategy']);
  });
});

describe('personOverlap', () => {
  it('finds an overlap between debate.personIds and policy.authorPersonIds', () => {
    const d = fakeDebate({ personIds: ['josephine-teo', 'alvin-tan'] });
    const p = fakePolicy({ id: 'nais-2-0', title: 'NAIS 2.0', authorPersonIds: ['josephine-teo'] });
    const sig = personOverlap(d, p);
    assert.equal(sig?.type, 'person-overlap');
    assert.equal(sig?.weight, 'strong');
    assert.match(sig!.detail, /josephine-teo/);
  });

  it('returns null when there is no overlap', () => {
    const d = fakeDebate({ personIds: ['gerald-giam'] });
    const p = fakePolicy({ id: 'x', title: 'x', authorPersonIds: ['josephine-teo'] });
    assert.equal(personOverlap(d, p), null);
  });
});

describe('ministry helpers', () => {
  it('extracts ministry from cos-X-YYYY id', () => {
    assert.equal(ministryFromDebateId('cos-mddi-2026'), 'MDDI');
    assert.equal(ministryFromDebateId('cos-moh-2026'), 'MOH');
  });

  it('returns null for non-cos ids', () => {
    assert.equal(ministryFromDebateId('oral-answer-4117'), null);
  });

  it('infers ministry from personIds via affiliations', () => {
    const people = [fakePerson('josephine-teo', ['MDDI']), fakePerson('alvin-tan', ['MTI', 'MDDI'])];
    assert.equal(ministryFromPersonIds(['josephine-teo', 'alvin-tan'], people), 'MDDI');
  });

  it('returns null when no people resolve', () => {
    assert.equal(ministryFromPersonIds(['ghost'], []), null);
  });
});

describe('keywordHits', () => {
  it('hits when policy title tokens appear in debate title or summary', () => {
    const d = fakeDebate({
      titleEn: 'AI Verify Toolkit launched',
      summaryEn: 'IMDA released the AI Verify framework today.',
    });
    const p = fakePolicy({ id: 'ai-verify', title: 'AI Verify Foundation' });
    const hits = keywordHits(d, p);
    assert.ok(hits.length >= 1);
    assert.ok(hits.every((h) => h.weight === 'medium'));
    assert.ok(hits.some((h) => h.detail === 'verify'));
  });

  it('returns empty when no tokens overlap', () => {
    const d = fakeDebate({ titleEn: 'Fishery quota review', summaryEn: 'Discussion on fishery import limits.' });
    const p = fakePolicy({ id: 'cybersecurity', title: 'Cybersecurity Act' });
    assert.deepEqual(keywordHits(d, p), []);
  });

  it('caps at 3 hits per pair', () => {
    const d = fakeDebate({
      titleEn: 'cybersecurity infrastructure compliance education healthcare',
    });
    const p = fakePolicy({ id: 'omni', title: 'Cybersecurity Infrastructure Compliance Education Healthcare' });
    assert.equal(keywordHits(d, p).length, 3);
  });
});

describe('topicHits', () => {
  it('matches policy keyword inside debate.topics array', () => {
    const d = fakeDebate({ topics: ['AI Governance & Regulation'] });
    const p = fakePolicy({ id: 'gov', title: 'AI Governance Framework' });
    const hits = topicHits(d, p);
    assert.equal(hits[0]?.type, 'topic-hit');
    assert.equal(hits[0]?.weight, 'weak');
  });
});

describe('deriveConfidence', () => {
  it('returns high when ≥4 weight and a strong signal present', () => {
    const signals: Signal[] = [
      { type: 'person-overlap', detail: 'x', weight: 'strong' }, // 3
      { type: 'keyword', detail: 'y', weight: 'medium' }, // 2 → total 5
    ];
    assert.equal(deriveConfidence(signals), 'high');
  });

  it('returns medium without a strong signal but ≥2 weight', () => {
    const signals: Signal[] = [
      { type: 'keyword', detail: 'a', weight: 'medium' }, // 2
    ];
    assert.equal(deriveConfidence(signals), 'medium');
  });

  it('returns low when only weak signals', () => {
    const signals: Signal[] = [{ type: 'date-proximity', detail: '30d', weight: 'weak' }];
    assert.equal(deriveConfidence(signals), 'low');
  });
});

describe('candidatesForDebate', () => {
  it('ranks high-confidence first and excludes already-related policies', () => {
    const d = fakeDebate({
      personIds: ['josephine-teo'],
      titleEn: 'NAIS 2.0 implementation',
      relatedPolicyIds: ['existing-policy'],
    });
    const policies = [
      fakePolicy({ id: 'existing-policy', title: 'X' }),
      fakePolicy({
        id: 'nais-2-0',
        title: 'NAIS 2.0',
        ministry: 'MDDI',
        authorPersonIds: ['josephine-teo'],
      }),
      fakePolicy({ id: 'unrelated', title: 'Coffee Subsidy Reform' }),
    ];
    const people = [fakePerson('josephine-teo', ['MDDI'])];
    const cands = candidatesForDebate(d, policies, people);
    const ids = cands.map((c) => c.target.id);
    assert.ok(!ids.includes('existing-policy'), 'should skip already-related');
    assert.equal(cands[0]?.target.id, 'nais-2-0');
    assert.equal(cands[0]?.confidence, 'high');
  });
});
