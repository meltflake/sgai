"""
对 132 条议会 AI 辩论进行 LLM 分析：
1. 生成中文摘要（150字以内）
2. 提炼核心观点（政府立场 vs 反对/质询立场）
3. 标注议题关键词
4. 识别争议性问题
"""

import json
import os
import time
from openai import OpenAI

client = OpenAI()

def enrich_debate(debate: dict) -> dict:
    """用 LLM 对单条辩论进行分析和提炼"""
    
    # 准备输入文本（截取前3000字符避免超token）
    full_text = debate.get('full_text', '') or debate.get('summary', '')
    text_sample = full_text[:3000] if full_text else ''
    
    title = debate.get('title', '')
    date = debate.get('date', '')
    dtype = debate.get('type', '')
    speakers = debate.get('speakers', [])
    topics = debate.get('topics', [])
    
    prompt = f"""你是新加坡 AI 政策研究专家。请分析以下新加坡议会辩论记录，用中文提供结构化分析。

辩论标题：{title}
日期：{date}
类型：{dtype}
发言议员：{', '.join(speakers[:8])}
议题分类：{', '.join(topics)}

辩论原文（节选）：
{text_sample}

请以 JSON 格式返回以下内容：
{{
  "zh_title": "中文标题（简洁准确，20字以内）",
  "zh_summary": "中文摘要（100-150字，说明：质询了什么问题、政府如何回应、核心争议点是什么）",
  "key_points": [
    "核心观点1（15字以内）",
    "核心观点2（15字以内）",
    "核心观点3（15字以内）"
  ],
  "government_stance": "政府/执政党立场（30字以内，如无政府发言则填null）",
  "opposition_stance": "反对党/质询方立场（30字以内，如无则填null）",
  "controversy_level": 1-5的整数（1=无争议的信息发布，5=激烈辩论），
  "policy_signal": "政策信号（20字以内，这次辩论透露了什么政策方向，如无则填null）",
  "notable_quote": "最值得引用的一句话（英文原文，50字以内，如无则填null）"
}}

只返回 JSON，不要其他文字。"""

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=600,
            response_format={"type": "json_object"}
        )
        result = json.loads(response.choices[0].message.content)
        return result
    except Exception as e:
        print(f"  Error: {e}")
        return {
            "zh_title": title[:20],
            "zh_summary": "（摘要生成失败）",
            "key_points": [],
            "government_stance": None,
            "opposition_stance": None,
            "controversy_level": 1,
            "policy_signal": None,
            "notable_quote": None
        }


def main():
    # 加载原始数据
    with open('/home/ubuntu/scripts/all_ai_debates.json', 'r') as f:
        data = json.load(f)
    
    debates = data['debates']
    print(f"Total debates to process: {len(debates)}")
    
    # 检查是否有已处理的缓存
    cache_file = '/home/ubuntu/scripts/enriched_cache.json'
    if os.path.exists(cache_file):
        with open(cache_file, 'r') as f:
            cache = json.load(f)
        print(f"Loaded {len(cache)} cached enrichments")
    else:
        cache = {}
    
    enriched_debates = []
    
    for i, debate in enumerate(debates):
        debate_id = debate['id']
        
        if debate_id in cache:
            # 使用缓存
            enriched = {**debate, **cache[debate_id]}
            enriched_debates.append(enriched)
            if i % 20 == 0:
                print(f"[{i+1}/{len(debates)}] Using cache for {debate_id}")
            continue
        
        print(f"[{i+1}/{len(debates)}] Processing: {debate.get('title', '')[:60]}...")
        
        enrichment = enrich_debate(debate)
        cache[debate_id] = enrichment
        
        enriched = {**debate, **enrichment}
        enriched_debates.append(enriched)
        
        # 每10条保存一次缓存
        if (i + 1) % 10 == 0:
            with open(cache_file, 'w') as f:
                json.dump(cache, f, ensure_ascii=False, indent=2)
            print(f"  Saved cache ({len(cache)} entries)")
        
        # 避免 rate limit
        time.sleep(0.3)
    
    # 最终保存缓存
    with open(cache_file, 'w') as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)
    
    # 保存完整的富化数据
    output = {
        **data,
        'debates': enriched_debates,
        'enriched': True,
        'enriched_at': time.strftime('%Y-%m-%d')
    }
    
    with open('/home/ubuntu/scripts/enriched_debates.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"\nDone! Saved {len(enriched_debates)} enriched debates.")
    
    # 打印样本
    sample = enriched_debates[1]
    print(f"\nSample enrichment for: {sample['title'][:60]}")
    print(f"  zh_title: {sample.get('zh_title', 'N/A')}")
    print(f"  zh_summary: {sample.get('zh_summary', 'N/A')[:100]}...")
    print(f"  controversy_level: {sample.get('controversy_level', 'N/A')}")
    print(f"  government_stance: {sample.get('government_stance', 'N/A')}")
    print(f"  opposition_stance: {sample.get('opposition_stance', 'N/A')}")


if __name__ == '__main__':
    main()
