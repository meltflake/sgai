"""
从 132 条议会 AI 辩论中挖掘规律：
1. 政策演变脉络（按年份的议题变化）
2. 议员立场阵营（谁倾向于质询/挑战，谁倾向于辩护）
3. 高频争议焦点（哪些问题被反复提出）
4. 政策信号汇总（政府透露的方向）
5. 整体洞察报告
"""

import json
import time
from openai import OpenAI
from collections import defaultdict, Counter

client = OpenAI()

def load_data():
    with open('/home/ubuntu/scripts/enriched_debates.json', 'r') as f:
        data = json.load(f)
    return data['debates']

def analyze_patterns(debates):
    """用 LLM 做整体规律分析"""
    
    # 准备摘要数据（不包含全文，节省 token）
    summaries = []
    for d in debates:
        summaries.append({
            'id': d['id'],
            'title': d.get('zh_title', d['title'])[:40],
            'date': d['date'],
            'type': d['type'],
            'speakers': d.get('speakers', [])[:5],
            'topics': d.get('topics', []),
            'zh_summary': d.get('zh_summary', '')[:200],
            'controversy_level': d.get('controversy_level', 1),
            'government_stance': d.get('government_stance', ''),
            'opposition_stance': d.get('opposition_stance', ''),
            'policy_signal': d.get('policy_signal', ''),
        })
    
    summaries_json = json.dumps(summaries, ensure_ascii=False, indent=1)
    
    prompt = f"""你是新加坡 AI 政策研究专家。以下是新加坡议会 2015-2026 年间 132 条 AI 相关辩论的结构化摘要数据。

{summaries_json[:12000]}

请深度分析这些数据，以 JSON 格式返回以下洞察：

{{
  "policy_evolution": [
    {{
      "period": "时期名称（如 2015-2018 萌芽期）",
      "years": "2015-2018",
      "theme": "这一时期的核心主题（30字）",
      "description": "这一时期 AI 政策讨论的特征（80字）",
      "key_debates": ["代表性辩论标题1", "代表性辩论标题2"]
    }}
  ],
  "recurring_controversies": [
    {{
      "issue": "争议议题名称（中文，15字以内）",
      "description": "这个争议的核心内容（50字）",
      "frequency": 出现次数（整数）,
      "government_position": "政府立场（25字）",
      "opposition_position": "反对/质询方立场（25字）",
      "resolution_status": "resolved/ongoing/escalating"
    }}
  ],
  "mp_profiles": [
    {{
      "name": "议员英文名",
      "zh_name": "议员中文名或音译（如有）",
      "role": "执政党/反对党/独立",
      "focus_areas": ["关注领域1", "关注领域2"],
      "stance": "对AI政策的总体立场（30字）",
      "debate_count": 辩论次数（整数）,
      "notable_position": "最值得关注的观点（40字）"
    }}
  ],
  "key_insights": [
    {{
      "title": "洞察标题（15字以内）",
      "description": "详细说明（80字）",
      "evidence": "支撑证据（来自哪些辩论，30字）",
      "significance": "high/medium/low"
    }}
  ],
  "policy_signals": [
    {{
      "signal": "政策信号（20字）",
      "year": "首次出现年份",
      "status": "已落实/进行中/仍在讨论",
      "context": "背景说明（40字）"
    }}
  ],
  "tension_map": [
    {{
      "dimension": "张力维度（如 创新速度 vs 监管安全）",
      "side_a": "一方立场（20字）",
      "side_b": "另一方立场（20字）",
      "current_balance": "当前平衡点（30字）"
    }}
  ]
}}

分析要求：
- policy_evolution 分 4-5 个时期
- recurring_controversies 列出 5-8 个最重要的反复争议
- mp_profiles 列出最活跃的 8-10 位议员
- key_insights 列出 5-7 条最重要的洞察
- policy_signals 列出 6-8 个重要政策信号
- tension_map 列出 4-5 个核心张力

只返回 JSON，不要其他文字。"""

    print("Calling LLM for pattern analysis...")
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=4000,
        response_format={"type": "json_object"}
    )
    
    result = json.loads(response.choices[0].message.content)
    return result


def compute_statistics(debates):
    """计算统计数据"""
    
    # 每年辩论数
    by_year = Counter(d['date'][:4] for d in debates if d.get('date'))
    
    # 每类型辩论数
    by_type = Counter(d['type'] for d in debates)
    
    # 议题分布
    topic_counts = Counter()
    for d in debates:
        for t in d.get('topics', []):
            topic_counts[t] += 1
    
    # 议员活跃度
    speaker_counts = Counter()
    for d in debates:
        for s in d.get('speakers', []):
            # 过滤掉 Mr Speaker 等程序性发言者
            if s not in ['Mr Speaker', 'Deputy Speaker', 'Speaker']:
                speaker_counts[s] += 1
    
    # 争议度分布
    controversy_dist = Counter(d.get('controversy_level', 1) for d in debates)
    
    # 高争议辩论（level >= 4）
    high_controversy = [
        {
            'id': d['id'],
            'title': d.get('zh_title', d['title'])[:40],
            'en_title': d['title'][:60],
            'date': d['date'],
            'level': d.get('controversy_level', 1),
            'zh_summary': d.get('zh_summary', '')[:150],
            'topics': d.get('topics', []),
        }
        for d in debates
        if d.get('controversy_level', 1) >= 4
    ]
    high_controversy.sort(key=lambda x: (-x['level'], x['date']), reverse=False)
    high_controversy.sort(key=lambda x: -x['level'])
    
    return {
        'by_year': dict(sorted(by_year.items())),
        'by_type': dict(by_type),
        'topic_counts': dict(topic_counts.most_common()),
        'top_speakers': dict(speaker_counts.most_common(15)),
        'controversy_dist': dict(controversy_dist),
        'high_controversy': high_controversy[:20],
    }


def main():
    print("Loading enriched debates...")
    debates = load_data()
    print(f"Loaded {len(debates)} debates")
    
    # 计算统计数据
    print("Computing statistics...")
    stats = compute_statistics(debates)
    
    print(f"High controversy debates (level>=4): {len(stats['high_controversy'])}")
    print(f"Top speakers: {list(stats['top_speakers'].items())[:5]}")
    
    # LLM 规律分析
    patterns = analyze_patterns(debates)
    
    # 合并结果
    analysis = {
        'stats': stats,
        'patterns': patterns,
        'generated_at': time.strftime('%Y-%m-%d')
    }
    
    with open('/home/ubuntu/scripts/debate_analysis.json', 'w', encoding='utf-8') as f:
        json.dump(analysis, f, ensure_ascii=False, indent=2)
    
    print("\n=== Analysis Complete ===")
    print(f"Policy evolution periods: {len(patterns.get('policy_evolution', []))}")
    print(f"Recurring controversies: {len(patterns.get('recurring_controversies', []))}")
    print(f"MP profiles: {len(patterns.get('mp_profiles', []))}")
    print(f"Key insights: {len(patterns.get('key_insights', []))}")
    print(f"Policy signals: {len(patterns.get('policy_signals', []))}")
    print(f"Tension dimensions: {len(patterns.get('tension_map', []))}")
    
    # 打印洞察预览
    print("\n=== Key Insights Preview ===")
    for insight in patterns.get('key_insights', [])[:3]:
        print(f"\n[{insight.get('significance', '?').upper()}] {insight.get('title', '')}")
        print(f"  {insight.get('description', '')[:100]}")
    
    print("\n=== Recurring Controversies ===")
    for c in patterns.get('recurring_controversies', [])[:5]:
        print(f"\n• {c.get('issue', '')} (出现{c.get('frequency', '?')}次, {c.get('resolution_status', '?')})")
        print(f"  政府: {c.get('government_position', '')}")
        print(f"  质询: {c.get('opposition_position', '')}")


if __name__ == '__main__':
    main()
