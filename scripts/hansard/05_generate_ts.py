import json

# Load enriched debates and analysis
with open('/home/ubuntu/scripts/enriched_debates.json', 'r') as f:
    enriched_data = json.load(f)

with open('/home/ubuntu/scripts/debate_analysis.json', 'r') as f:
    analysis = json.load(f)

debates = enriched_data['debates']
patterns = analysis['patterns']
stats = analysis['stats']

def jstr(s):
    if s is None:
        return 'null'
    return json.dumps(str(s), ensure_ascii=False)

def escape_template(s):
    if not s:
        return ''
    s = str(s)
    s = s.replace('\\', '\\\\')
    s = s.replace('`', '\\`')
    s = s.replace('${', '\\${')
    return s

def clean(s, maxlen=None):
    import re
    if not s:
        return ''
    s = re.sub(r'\n{3,}', '\n\n', str(s))
    s = re.sub(r' {2,}', ' ', s)
    s = s.strip()
    if maxlen:
        s = s[:maxlen]
    return s

lines = []
lines.append('// Auto-generated: enriched debates with Chinese summaries and pattern analysis')
lines.append(f'// Total: {len(debates)} debates | Generated: {enriched_data.get("enriched_at", "2026-03-01")}')
lines.append('// Sources: https://sprs.parl.gov.sg | https://search.pair.gov.sg')
lines.append('')

lines.append('export interface Debate {')
lines.append('  id: string;')
lines.append('  title: string;')
lines.append('  zhTitle: string;')
lines.append('  date: string;')
lines.append('  parliament: string;')
lines.append('  type: string;')
lines.append('  speakers: string[];')
lines.append('  topics: string[];')
lines.append('  zhSummary: string;')
lines.append('  keyPoints: string[];')
lines.append('  governmentStance: string | null;')
lines.append('  oppositionStance: string | null;')
lines.append('  controversyLevel: number;')
lines.append('  policySignal: string | null;')
lines.append('  notableQuote: string | null;')
lines.append('  summary: string;')
lines.append('  sourceUrl: string;')
lines.append('}')
lines.append('')

lines.append('export const debates: Debate[] = [')
for d in debates:
    title = escape_template(clean(d.get('title', ''), 200))
    zh_title = escape_template(clean(d.get('zh_title', d.get('title', ''))[:50]))
    date = d.get('date', '') or ''
    parliament = str(d.get('parliament', '') or '')
    dtype = d.get('type', '') or ''
    speakers = d.get('speakers', [])
    topics = d.get('topics', [])
    zh_summary = escape_template(clean(d.get('zh_summary', ''), 300))
    key_points = d.get('key_points', []) or []
    gov_stance = d.get('government_stance')
    opp_stance = d.get('opposition_stance')
    controversy = d.get('controversy_level', 1) or 1
    policy_signal = d.get('policy_signal')
    notable_quote = d.get('notable_quote')
    summary = escape_template(clean(d.get('full_text', d.get('summary', ''))[:600]))
    source_url = d.get('source_url', '') or ''

    speakers_ts = ', '.join(json.dumps(s, ensure_ascii=False) for s in speakers)
    topics_ts = ', '.join(json.dumps(t, ensure_ascii=False) for t in topics)
    kp_ts = ', '.join(json.dumps(k, ensure_ascii=False) for k in key_points[:4])

    lines.append('  {')
    lines.append(f'    id: {jstr(d["id"])},')
    lines.append(f'    title: `{title}`,')
    lines.append(f'    zhTitle: `{zh_title}`,')
    lines.append(f'    date: {jstr(date)},')
    lines.append(f'    parliament: {jstr(parliament)},')
    lines.append(f'    type: {jstr(dtype)},')
    lines.append(f'    speakers: [{speakers_ts}],')
    lines.append(f'    topics: [{topics_ts}],')
    lines.append(f'    zhSummary: `{zh_summary}`,')
    lines.append(f'    keyPoints: [{kp_ts}],')
    lines.append(f'    governmentStance: {jstr(gov_stance)},')
    lines.append(f'    oppositionStance: {jstr(opp_stance)},')
    lines.append(f'    controversyLevel: {int(controversy)},')
    lines.append(f'    policySignal: {jstr(policy_signal)},')
    lines.append(f'    notableQuote: {jstr(notable_quote)},')
    lines.append(f'    summary: `{summary}`,')
    lines.append(f'    sourceUrl: {jstr(source_url)},')
    lines.append('  },')
lines.append('];')
lines.append('')

lines.append('export const DEBATE_STATS = {')
lines.append(f'  total: {len(debates)},')
by_year = stats['by_year']
years = sorted(by_year.keys())
lines.append(f'  yearRange: {{ from: {years[0]}, to: {years[-1]} }},')
by_year_ts = ', '.join(f'{json.dumps(k)}: {v}' for k, v in sorted(by_year.items()))
lines.append(f'  byYear: {{ {by_year_ts} }},')
by_type_ts = ', '.join(f'{json.dumps(k)}: {v}' for k, v in stats['by_type'].items())
lines.append(f'  byType: {{ {by_type_ts} }},')
topic_ts = ', '.join(f'{json.dumps(k)}: {v}' for k, v in list(stats['topic_counts'].items())[:15])
lines.append(f'  byTopic: {{ {topic_ts} }},')
speaker_ts = ', '.join(f'{json.dumps(k)}: {v}' for k, v in list(stats['top_speakers'].items())[:12])
lines.append(f'  topSpeakers: {{ {speaker_ts} }},')
lines.append('};')
lines.append('')

pe = patterns.get('policy_evolution', [])
lines.append('export const POLICY_EVOLUTION = [')
for p in pe:
    lines.append('  {')
    lines.append(f'    period: {jstr(p.get("period", ""))},')
    lines.append(f'    years: {jstr(p.get("years", ""))},')
    lines.append(f'    theme: {jstr(p.get("theme", ""))},')
    lines.append(f'    description: {jstr(p.get("description", ""))},')
    kd = p.get('key_debates', [])
    kd_ts = ', '.join(json.dumps(k, ensure_ascii=False) for k in kd[:3])
    lines.append(f'    keyDebates: [{kd_ts}],')
    lines.append('  },')
lines.append('];')
lines.append('')

rc = patterns.get('recurring_controversies', [])
lines.append('export const RECURRING_CONTROVERSIES = [')
for c in rc:
    lines.append('  {')
    lines.append(f'    issue: {jstr(c.get("issue", ""))},')
    lines.append(f'    description: {jstr(c.get("description", ""))},')
    lines.append(f'    frequency: {int(c.get("frequency", 1))},')
    lines.append(f'    governmentPosition: {jstr(c.get("government_position", ""))},')
    lines.append(f'    oppositionPosition: {jstr(c.get("opposition_position", ""))},')
    lines.append(f'    resolutionStatus: {jstr(c.get("resolution_status", "ongoing"))},')
    lines.append('  },')
lines.append('];')
lines.append('')

mp_profiles = patterns.get('mp_profiles', [])
lines.append('export const MP_PROFILES = [')
for mp in mp_profiles:
    fa = mp.get('focus_areas', [])
    fa_ts = ', '.join(json.dumps(f, ensure_ascii=False) for f in fa[:4])
    lines.append('  {')
    lines.append(f'    name: {jstr(mp.get("name", ""))},')
    lines.append(f'    zhName: {jstr(mp.get("zh_name", ""))},')
    lines.append(f'    role: {jstr(mp.get("role", ""))},')
    lines.append(f'    focusAreas: [{fa_ts}],')
    lines.append(f'    stance: {jstr(mp.get("stance", ""))},')
    lines.append(f'    debateCount: {int(mp.get("debate_count", 0))},')
    lines.append(f'    notablePosition: {jstr(mp.get("notable_position", ""))},')
    lines.append('  },')
lines.append('];')
lines.append('')

ki = patterns.get('key_insights', [])
lines.append('export const KEY_INSIGHTS = [')
for ins in ki:
    lines.append('  {')
    lines.append(f'    title: {jstr(ins.get("title", ""))},')
    lines.append(f'    description: {jstr(ins.get("description", ""))},')
    lines.append(f'    evidence: {jstr(ins.get("evidence", ""))},')
    lines.append(f'    significance: {jstr(ins.get("significance", "medium"))},')
    lines.append('  },')
lines.append('];')
lines.append('')

ps = patterns.get('policy_signals', [])
lines.append('export const POLICY_SIGNALS = [')
for sig in ps:
    lines.append('  {')
    lines.append(f'    signal: {jstr(sig.get("signal", ""))},')
    lines.append(f'    year: {jstr(str(sig.get("year", "")))},')
    lines.append(f'    status: {jstr(sig.get("status", ""))},')
    lines.append(f'    context: {jstr(sig.get("context", ""))},')
    lines.append('  },')
lines.append('];')
lines.append('')

tm = patterns.get('tension_map', [])
lines.append('export const TENSION_MAP = [')
for t in tm:
    lines.append('  {')
    lines.append(f'    dimension: {jstr(t.get("dimension", ""))},')
    lines.append(f'    sideA: {jstr(t.get("side_a", ""))},')
    lines.append(f'    sideB: {jstr(t.get("side_b", ""))},')
    lines.append(f'    currentBalance: {jstr(t.get("current_balance", ""))},')
    lines.append('  },')
lines.append('];')
lines.append('')

lines.append('export function getDebatesByTopic(topic: string): Debate[] {')
lines.append('  return debates.filter(d => d.topics.includes(topic));')
lines.append('}')
lines.append('')
lines.append('export function getDebatesByYear(year: string): Debate[] {')
lines.append('  return debates.filter(d => d.date.startsWith(year));')
lines.append('}')
lines.append('')
lines.append('export function getHighControversyDebates(minLevel = 4): Debate[] {')
lines.append('  return debates.filter(d => d.controversyLevel >= minLevel)')
lines.append('    .sort((a, b) => b.controversyLevel - a.controversyLevel);')
lines.append('}')
lines.append('')

content = '\n'.join(lines)
with open('/home/ubuntu/aisg/src/data/debates.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Written {len(content):,} bytes, {len(lines)} lines")
print("Done!")
