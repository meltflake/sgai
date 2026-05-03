import { allPeople } from '../src/data/people.ts';
import { videos } from '../src/data/videos.ts';
import { getPersonCounts } from '../src/utils/graph.ts';

const stubs = allPeople.map((p) => {
  const c = getPersonCounts(p.id);
  const vidCount = videos.filter((v) => v.speaker === p.name || (p.aliases || []).includes(v.speaker)).length;
  const summaryLen = (p.summary || '').length;
  const isStub = !p.summary || p.summary.startsWith('[需补充]');
  return {
    id: p.id, name: p.name, zhName: p.zhName, title: p.title,
    category: p.category, affiliations: p.affiliations,
    debateCount: c.debateCount, policyAuthorCount: c.policyAuthorCount,
    videoCount: vidCount, summaryLen, isStub, channels: p.channels.length,
    score: c.debateCount + c.policyAuthorCount + vidCount,
  };
}).filter((p) => p.score === 0).sort((a, b) => a.summaryLen - b.summaryLen);

console.log(`Total people: ${allPeople.length}`);
console.log(`三无 (no debates/policies/videos): ${stubs.length}`);
console.log('\nTop 25 most stubby:');
console.table(stubs.slice(0, 25).map(s => ({
  id: s.id, name: s.name, cat: s.category, aff: s.affiliations.join(','),
  sumLen: s.summaryLen, ch: s.channels, stub: s.isStub
})));
