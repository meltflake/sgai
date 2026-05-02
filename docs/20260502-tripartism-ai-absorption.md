# 三方机制 × AI：用长文承载，不开姊妹页

**日期**：2026-05-02
**作者**：Luca + Nix
**状态**：方案锁定，待写

## 触发

某 agent 看完 `ai-policy-research-state-capacity` 后给的判断：

> levers 里的"人才抓手（抓手 3）"是从国家视角看的供给侧；NTUC 三方机制是工人/工会/雇主的协调侧。这两条线不重叠。

判断成立，且裂缝比 agent 说的更深——抓手 3 把 MOM/WSG 当作"政府发钱让人重训练"的功能位，没有把 NTUC、SNEF 作为协商方放进来。

## 走过的弯路

### 第一轮：5 层数据集（异质拼盘）

按 institutions / rules / instruments / people / cases 切 5 层，建了 `src/data/tripartism.ts`。

**问题**：5 层是异质拼盘，不是同质并列。institutions 和 rules 是两类东西，people 和 cases 不应该和它们并列成层——更像是横切面。

### 第二轮：6 关口对 6 抓手（对称性诱惑）

为了和 levers 形成姊妹页，强行造 6 关口（入职关 / 在岗关 / 退出关 / 转换关 / 分配关 / 代表关）对偶 6 抓手。

**问题**（Luca 一针见血）：「这硬生生把一个地位很低的事情拉高了」。

被对称性带偏了。事实是：

- **levers 抓手 3（人才）已经吸收了 NTUC × AI 的实质内容**——CTCs、NTUC LearningHub、e2i、Job Redesign+、CCP、EWTP、SkillsFuture、PWM/PWCS、WSG×SSG 合并，全在那里。
- **不在 levers 里的"独立增量"很小**：
  - 公平就业一线（TGFEP / Workplace Fairness Act / 2024 AI 招聘质询）：3–4 条
  - 平台工人一线（Platform Workers Act / 算法管理 / 平台工人协会）：2–3 条
  - 共生关系点破：1 段 framing
  - 顶层机构定义（NTUC / SNEF / TAL / TAFEP / TADM）：1 个简表

加起来 10–15 条干货 + 1 段 framing。这是**长文 + 注释表**的体量，不是 6 关口图谱的体量。

强行做姊妹页 = 谎报权重，读者一眼能看出来。

## 锁定方案：写一篇分析长文

### 为什么是长文

1. **真实权重诚实**：tripartism 在 SG AI 故事里不是平行轴线，是脚注/注释层。它重要在"补足 levers 没说清楚的 framing"，不在"提供同等量级的政策动作"。
2. **framing 张力适合长文**：核心价值是判断（共生关系点破、入职公平 vs 算法管理 vs 分配的三战线、watchpoints），不是按字段切碎的数据库式呈现。
3. **避免重复造轮**：levers 抓手 3 已经把"工具"层覆盖完了，再开数据集是重复。
4. **体例一致**：和已有 `singapore-ai-strategy-the-real-moat`、`singapore-ai-native-companies-vs-nations`、`singapore-ai-vs-smart-nation-two-transformations` 三篇核心观点长文同一格式。
5. **交叉引用免费**：Markdown frontmatter 里的 `relatedPolicyIds / relatedLeverNumbers / relatedDebateIds / relatedPersonIds` 已支持，不增加 schema 维护成本。

### 否决的备选

- **方案 2**（在 levers 抓手 3 下方加注释模块）：失去单独引用入口，搜索引擎和内部链接都到不了这一段。
- **方案 3**（独立页面缩到 3 段非对称结构）：仍然假装平级，比方案 1 重 2 倍。

## 文章规格

- **slug**：`singapore-tripartism-and-ai`
- **位置**：
  - 中文：`src/data/post/singapore-tripartism-and-ai.md`
  - 英文：`src/data/post/en/singapore-tripartism-and-ai.md`
- **字数**：~1800–2200 字（中文），EN 平行
- **category**：`深度分析` / `Analysis`
- **tags**：`战略 / 观点 / 新加坡 / 劳工 / 三方机制`

### 结构（草案）

1. **共生点破**（开篇 ~300 字）
   - NTUC 秘书长长期由 PAP 部长兼任的事实
   - 三方机制 = PAP 把工人组织内部化的协商架构
   - 共生的代价 vs 共生的红利

2. **抓手 3 看不到的三条战线**（主体 ~1200 字）
   - **入职公平**：TGFEP → Workplace Fairness Act → 2024 AI 招聘质询案例（Patrick Tay × Tan See Leng）。"零投诉"是结果指标还是盲区？
   - **算法管理**：Platform Workers Act 给骑手集体代表权——全球罕见地把"AI 调度算法 vs 人"纳入三方框架。但是否能就算法透明度集体协商，仍是开放问题。
   - **AI 红利再分配**：Progressive Wage Model + PWCS——把"AI 提升单位生产率"锁定到"工人工资必须同步上涨"，是三方机制独有的红利再分配机制。

3. **2026–2028 的三个 watchpoint**（~400 字）
   - 高龄就业三方工作组的产出能否真正吸收 AI 中年危机
   - 平台工人协会能否就算法议题集体协商（不仅是 CPF / 工伤这些非算法议题）
   - Workplace Fairness Act 执法时是否真捕到算法歧视案例

4. **结论**（~200 字）
   - levers 是推进，三方是吸收。
   - 理解 SG AI 模式必须读这两层叠加。
   - 共生既是这套机制的天花板，也是它的发动机。

### 交叉引用

- `relatedLeverNumbers: [3]`（人才）
- `relatedDebateIds: ['oral-answer-3729']`（2024 AI 招聘工具偏见质询）
- `relatedPersonIds: ['patrick-tay-teck-guan', 'tan-see-leng']`
- `relatedPostSlugs: ['singapore-ai-native-companies-vs-nations']`（其中已有 "NTUC × AI 工人保护" 一行可以做钩子）

## 待核实事项（写文章前清理）

写文章前用 SPRS API + 公开资料快速核：

- [ ] Workplace Fairness Act 通过年份和生效日期
- [ ] Platform Workers Act 通过年份与生效日期，平台工人协会成立数量
- [ ] CTC 当前覆盖企业数量
- [ ] SNEF 现任主席是否仍是 Robert Yap
- [ ] 高龄就业三方工作组 2026 年的具体进展
- [ ] NTUC 秘书长 Ng Chee Meng 任期是否仍延续

## 不做的事

- **不建** `src/data/tripartism.ts`（已删）
- **不加** navigation entry 或 i18n key（`navTripartism`）
- **不开** `src/pages/tripartism/` 目录
- **不改** levers.ts 结构

## 后续可能

如果文章发出后读者反馈强烈、或后续真发现独立证据足以支撑结构化页面，可重启方案 3（缩小版独立页面）。但不在当前 sprint 范围内。

---

**决定记录**：
- 第一轮（5 层异质拼盘）失败原因：拼盘结构而非并列结构。
- 第二轮（6 对 6 镜像）失败原因：对称性诱惑导致谎报权重。
- 第三轮（长文）成立原因：诚实的权重 + 适合 framing 的载体 + 体例一致 + 零 schema 成本。
