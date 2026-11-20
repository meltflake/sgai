# 2026-11-20 PR 积压审核

审核开始时有 12 个未合并 PR。11 个 PR 的有效改动集中到同一分支，修正后验证。#402 不纳入政策库。

| PR | 处理 | 核实与修正 |
| --- | --- | --- |
| #388 | 保留 | CNA 智能体安全视频；解决与 main 的插入冲突。 |
| #392 | 修正后保留 | AIAP 导师视频；删除未获来源支持的招生营销判断。 |
| #400 | 修正后保留 | 保留三个视频；区分海外污染与新加坡环境管理；修正 Foundation 的基金会误译。 |
| #401 | 修正后保留 | 保留 11 月 6 日星数快照；恢复未重新采集的 Hugging Face 数据日期。 |
| #402 | 拒收 | 原文是 2017 年演讲，不是新政策文件；摘要还误写演讲者职务。加入拒收记录。 |
| #403 | 修正后保留 | 核实 Visa 的六个技术中心；改为计划时态；完成待审状态；不把 1,500 人写成新增岗位。 |
| #404 | 修正后保留 | 保留 11 月 6 日招聘快照；分类计数均为 2,223；修正雇主名称触发的语言检查误报。 |
| #405 | 合并记录 | 保留三条拒收记录。 |
| #407 | 修正后保留 | 保留 CNA 市场报道；删除科技板块推断；修正字幕货币误译。 |
| #412 | 修正后保留 | 保留 AIAP 申请经历；使用 Guan Ling 原名；删除人才体系推断。 |
| #413 | 合并记录 | 与 #405 的两条重复记录去重；保留数字金融演讲拒收记录。 |
| #414 | 修正后保留 | 原文只说研究额外报告或信息共享；删除强制报告表述及 Near 公司错误关联。 |

## 证据与范围

七个 YouTube 链接均通过 oEmbed 核实标题和发布者。摘要对照 PR 中的英语字幕。字幕含自动识别错误，本次未逐句复核全部音频。

招聘快照保留原采集日期。角色和行业计数各自合计 2,223，披露薪资数量 2,203，对应比例 0.991。原始招聘明细未随 PR 保存，无法独立重算历史薪资分位数。

星数保留原快照日期，不称为 11 月 20 日实时数据。GitHub 星数更新不代表 Hugging Face 下载量更新。

#404 的 CI 构建成功。失败来自日语和韩语页面把雇主法定名称当作英语句子。新增标记只包裹雇主名称，其他文字继续接受检查。标记限制为四个非英语语言，不扩大现有全语言豁免。

手机截图发现长雇主名称撑宽网格。给雇主列表设置最小宽度为零，使已有截断样式生效。

## 验证

`npm run check` 通过，556 个测试通过。

`npm run build` 与 `npm run check:dist` 通过。实体页面语言检查没有违规。

另核对视频 ID、URL 唯一性，以及七条视频的四语字幕。日语人才页面检查了亮色、暗色和手机显示。

## 来源

- [AI 事故报告答复](https://www.mddi.gov.sg/newsroom/mddi-s-response-to-pq-on-reporting-of-serious-and-near-miss-incidents-involving-autonomous-ai-systems/)
- [2017 年莱佛士对话演讲](https://www.mddi.gov.sg/newsroom/2nd-raffles-dialogue-on-human-well-being-and-security-2017/)
- [Visa 技术中心报道](https://www.businesstimes.com.sg/companies-markets/visa-sets-six-global-tech-hubs-singapore-1500-staff-new-paya-lebar-centre)
- [MAS 数字金融演讲](https://www.mas.gov.sg/news/speeches/2026/building-trusted-foundations-for-digital-finance)
- [MAS 保险演讲](https://www.mas.gov.sg/news/speeches/2026/opening-address-by-mr-marcus-lim-amd-mas-at-the-gaip-insurance-case-competition-2026-dinner)
- [MOH 游戏障碍答复](https://www.moh.gov.sg/newsroom/community-support-services-to-address-gaming-disorder-among-young-adults/)
