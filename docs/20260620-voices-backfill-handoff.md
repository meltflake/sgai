# Voices 回填交接 (2026-06-20)

> 给在另一台电脑接手的 Claude:读完这份文件,直接执行下面「继续」一节的 driver。**最重要的一条:串行,绝不并行**(原因见底部)。

## 现状

**已完成并上线(#66 已 merged 到 main):**

- voices pipeline 根因 bug 修复:AI 相关性判断从 URL slug 下沉到正文(`scripts/refresh/voices/judge.ts` + `scripts/lib/judge-ai-relevance.ts`)
- `fetch.ts` 去两类页面噪音:`Newsroom` 面包屑 + `This article has been migrated` CMS 提示
- 同类修复扩到 run-template(talent/tracker/benchmarking/levers/legal-ai) / startups / ecosystem / policies / videos
- 噪音检查 eval:`scripts/lib/transcript-noise.ts` + `scripts/evals/transcript-quality/check.ts`,挂 CI diff 门 + weekly cron

**已推送到 `origin/data-refresh/voices-backfill` 分支(未建 PR):**

- 已回填 **7 篇** AI 演讲的五语 transcript(commit `8203c37`)
- 噪音检查 eval + `triage.json`(79 篇候选的 AI 价值判定)+ `parallel-warm.ts`(commit `f6e84bc`)

## 待完成

1. 串行回填剩余 **~72 篇**(triage 判定 high+medium 的 + meta-llama + asia-econ,共约 79;已回填的会自动跳过)
2. `npm run check` + `eval:transcript-quality` 验证
3. 建 data-refresh PR

## 继续(在新电脑复制粘贴)

```bash
cd <你的 sgai repo 路径>
git fetch origin
git checkout data-refresh/voices-backfill
git reset --hard origin/data-refresh/voices-backfill
npm ci
which claude && claude --version   # 翻译/AI 判断依赖本地 claude CLI,必须有

# ---- 串行回填 driver ----
node -e "
const d=require('./scripts/refresh/voices/data/triage.json');
const sel=d.filter(x=>x.relevant&&(x.confidence==='high'||x.confidence==='medium')).map(x=>x.slug);
sel.push('opening-address-by-minister-josephine-teo-at-meta-s-llama-incubator-demo-day');
sel.push('keynote-address-by-minister-josephine-teo-at-the-asia-economic-summit-in-jakarta--indonesia');
const B=8,bb=[]; for(let i=0;i<sel.length;i+=B) bb.push(sel.slice(i,i+B).join(','));
require('fs').writeFileSync('/tmp/emit-batches.txt', bb.join('\n'));
console.log(sel.length+' 篇 → '+bb.length+' 批');
"
b=0
while IFS= read -r ids; do
  [ -z "$ids" ] && continue
  b=$((b+1))
  SGAI_LLM_TIMEOUT_MS=300000 npx tsx scripts/refresh/voices/run.ts --ids="$ids" --no-commit
  if ! git diff --quiet src/data/voices.ts; then
    git add src/data/voices.ts src/data/speech-transcripts.ts scripts/refresh/voices/data/ scripts/i18n/data/
    git commit -q -m "data(voices): backfill batch $b (5-lang, noise-free)"
    git push
  fi
done < /tmp/emit-batches.txt
echo "=== 回填完成,共 $b 批 ==="
```

## 完成后

```bash
npm run check
npx tsx scripts/evals/transcript-quality/check.ts --base=origin/main   # 必须 fail 0
gh pr create --base main --assignee @me \
  --title "data(voices): backfill ~79 previously-missed AI speeches (5-lang)" \
  --body "修复 voices scan slug-only AI 过滤 bug 后,经正文 triage 判定为实质 AI 的部长演讲,补五语 transcript。同分支含 transcript-quality 噪音检查 eval。"
```

## 🔴 三条铁律(血泪教训)

1. **串行,绝不并行多个 run.ts。** Anthropic API 并发上限很低:5 组(15 并发)秒崩、2 组(6 并发)也全 300s timeout 空转。单个 run.ts 内部已有约 3 个并发翻译,那是 API 扛得住的安全水位。一次只跑一个 run.ts。
2. **缓存是空的。** `scripts/i18n/data/*-cache` 被 gitignore,不随分支同步。每篇都要现翻译,全程约 3 小时,正常,耐心跑。
3. **每批 push。** 防中断丢失;进度在 `origin/data-refresh/voices-backfill` 可见。随时 `git diff fix/refresh-pipeline-ai-gates..origin/data-refresh/voices-backfill | grep -c '^\+    titleEn:'` 看已回填篇数(起点 7)。

## 监控提示

- **不要用 Monitor 工具**——这环境里它每次都被 1 小时超时杀掉,从没成功。要么 driver 前台跑、要么用 `Bash run_in_background` + `until grep COMPLETE` 的单次完成通知,中间进度靠主动 `tail` 日志。
