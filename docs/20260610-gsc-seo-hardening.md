# 2026-06-10 GSC 数据驱动的 SEO 加固

数据源:Google Search Console 导出(2026-05-02 ~ 2026-06-07,sgai.md 上线后首个完整周期)。

## 数据基线

- 总量:460 clicks / 129,403 impressions,整体 CTR 0.36%,平均排名 11.5
- **5 月 5 日 en-root 路由翻转([12d4618](https://github.com/meltflake/sgai/commit/12d4618))是分水岭**:翻转前根路径是中文页面,吃掉了英文 SERP 的展示但 CTR≈0(美国 49k 展示 / 0.06% CTR 即此现象);翻转后日 CTR 从 ~0.25% 升至 ~0.6-0.9%,position 从 12 升至 ~10
- 搜索需求语言分布:英文 query 占 97.9%(14,024/14,345 imp),中文仅 262 imp——**英文页面质量决定全站 SEO 上限**
- 展示量 5 月底起回落(7,010/天 → ~1,500/天):Google 对换语言后的根路径重新评估中,属预期波动

## 本轮修复(全部落地)

### 1. Hansard 发言人提取残留物去重(最大数据卫生问题)

`debates.ts` 的 speakers/personIds 里有 4 类抓取残留:前括号(`[Mr Ong Teng Koon`)、尾括号(`Janil Puthucheary]`)、敬称前缀 id(`mr-x`)、后缀变体(`x-2` / `x-pioneer`)。后果:同一议员的辩论计数被分裂、`mp-stubs.json` 长出 20 个变体档案、产生垃圾 /voices/ 页面。

- codemod 处理:9 个同记录重复 pid 删除、48 处 pid 归并到正主、7 个污染 speaker 字符串删除、11 个就地修复
- `mp-stubs.json` 213 → 193 条,被删 id 的 /voices/ URL 加了 301(root + `/:lang/` 两种形态,见 `public/_redirects`)
- 教训:speakers 与 personIds **不是平行数组**(长度普遍不等),codemod 必须各自独立清洗

### 2. 重复页面 canonical 合并(排名信号分裂)

| 重复对 | GSC 证据 | 处理 |
| --- | --- | --- |
| `/benchmarking/cyberport-ai-supercomputing-centre/`(case)vs `/benchmarking/hong-kong-initiative-1-cyberport-3000-pflops-supercomputing-centre/`(drilldown) | 1,668 imp @pos 17.2 vs 4,016 imp @pos 8.2,同一实体互相蚕食 | case 页 canonical → drilldown(`BenchmarkCase.canonicalPath` 新字段,各 locale 镜像自动生效) |
| `/legal-ai/<slug>/` vs `/policies/<slug>/` 同 slug 三对(courts guide / MAS bank guidelines / Copyright s.244) | courts guide:373 imp @5.62 vs 365 imp @6.01 双双在第一页互抢 | legal-ai 侧 canonical → policies(更富:全文+分析),按 slug 碰撞自动判定 |

### 3. Ong Teng Koon 档案补全(单一最大 query)

"ong teng koon" 是全站第一大 query(522 imp @pos 10.8,CTR 0.38%),但他只有 `[需补充]` stub(noindex)。已补全四语 summary(PAP,马西岭-油池集选区 2015–2020,GPC 国防外交/通讯新闻——来源 parliament.gov.sg / wiki.sg 检索验证;议题部分派生自库内 6 条辩论记录),档案转为可索引。

### 4. Tracker 维度页 SEO 标题

`/tracker/adoption/` 是第二大流量机会(4,778 imp @pos 6.8,CTR 0.02%)。原标题 "Industry Adoption · Singapore AI Observatory Dashboard" 与搜索词不对齐。新增 `DimensionBase.seoTitle*` 可选覆盖字段,adoption 页现为 "AI Adoption in Singapore — enterprise uptake data tracker"(四语)。其他 dim 后续按 GSC 数据逐个补。

## 验证

`npm run check` ✓(123 tests)· `npm run build` ✓(5,338 页)· `npm run check:dist` ✓(i18n 残留 + JSON-LD + zh-tw 误转)· canonical 输出已在 dist 逐页核对(注意:压缩器会交换属性顺序,grep 时用 `href=... rel="canonical"` 形态)。

## 未做 / 后续(按 ROI 排序)

1. **AISG 实体页内容缺口**:"ai singapore aisg budget employees headcount"(168 imp @8.2)、"kampong ai"(125)、"ioai 2027"(113)、"ai trailblazers singapore"(132)、"tagui"(145)——AISG 相关 query 簇 ~680 imp,`/ecosystem/ai-singapore/` 缺预算/人数/项目清单等 hard facts,需带信源回填
2. **议员档案页(programmatic)**:人名 query 是显著流量类型(ong teng koon / vivian balakrishnan / aaron thean / jermaine loy / kiren kumar / ivor tsang / laurence liew...)。现有 193 个 stub 大多 noindex。从 debates.ts 派生"该议员的 AI 议会记录"区块可以低成本把 stub 升级为可索引内容页
3. **同人异名 stub 归并**(需逐个核实):`henry-kwek` vs `kwek-hian-chuan-henry`、`jessica-tan` vs `jessica-tan-soon-neo`、`cheng-li-hui` vs `cheng-li-hui-tampines`
4. **头部词长线**:"ai startups singapore"(317 imp @33)、"singapore ai companies"(128 @48)、"model ai governance framework"(141 @78)——需要内容深度+外链,非快赢
5. **GSC API 自动巡检**(CLAUDE.md 已列盲区):本轮全部洞察均可从 API 自动产出,建议入 evals weekly
