
## 执行记录（2026-08-26）

计划批准后一天内落成 8 个 PR（一条栈，按下面顺序合）。每个 PR 都过了 `npm run check`、`build && check:dist` 和 CI 的四个 eval；PR-4 / 5a / 5b / 2b / 6 由独立子代理实现、另一个子代理按简报做规格 + 质量评审、修完再复审；整条栈在 `integration/aihot-stack` 上合并验证过（冲突只在 `package.json` / `CHANGELOG` / `CLAUDE.md` / `_headers`，都是双方各加一段）。

| 顺序 | PR | 内容 | 关键数字 |
| --- | --- | --- | --- |
| 1 | [#234](https://github.com/meltflake/sgai/pull/234) | 字段级数据许可（`DATA-LICENSE.md` + `license.ts`）+ 修 main 上 `check:prettier` 红灯 | About 五语许可段 |
| 2 | [#235](https://github.com/meltflake/sgai/pull/235) | 「最近更新」每条一行、7 天增量 Masthead、按周分组、上次访问后标记、RSS 每条直链；补 `ai-capital.ts` 的 harvester | 9 条资本事件首次上首页；Playwright 抓到并修了一个内联脚本时序 bug |
| 3 | [#236](https://github.com/meltflake/sgai/pull/236) | `whyItMatters` 四语字段 + 回填 | 323 条（49 政策 / 87 视频 / 187 辩论），0 跳过；进 `check:i18n-completeness` |
| 4 | [#237](https://github.com/meltflake/sgai/pull/237) | Markdown 孪生 + 「报告错误」issue 表单 | 1615 个 `.md`，dist +89 MB；新门 `check:markdown-export` |
| 5 | [#238](https://github.com/meltflake/sgai/pull/238) | skill 从 sgai.md 发布、`/agent/` 五语页、llms.txt 接口段、url-map zh/en 倒挂修复 | `check:skill-urls` 从列表页扩到 508 个 URL |
| 6 | [#241](https://github.com/meltflake/sgai/pull/241) | JSON 信封（`schemaVersion` / `license` / `links.sgai`）、`records.json` / `videos.json` / `index.json`、OpenAPI | **破坏性**：消费方改读 `.items`；新门 `check:data-export` |
| 7 | [#239](https://github.com/meltflake/sgai/pull/239) | videos / policies emit 入库时自动产出 `whyItMatters` | 离线单测 7 个 |
| 8 | [#240](https://github.com/meltflake/sgai/pull/240) | 月报 `--emit-post` 落成博文、主题页「最近动态」、订阅进 footer；修 en/ja/ko 主题页长文永远为 0 的老 bug | 8 月月报 38 条 |

**代做的决定**（不同意可回滚）：数据许可 CC BY 4.0 只覆盖自产字段；不放公开邮箱，纠错走 GitHub issue；MCP 不做，等有访问证据；story 事件页不做，先用主题页时间视图；长文在月报里单独成节；`NewsletterSignup` 加了 `idSuffix`（超出简报范围，为激活 Buttondown 时不出重复 id）。

**上线后要看一眼**：`curl -I https://sgai.md/debates/<id>.md`（`_headers` 的 `/*.md` 规则是否被 Cloudflare 接受）；`curl -I https://sgai.md/data/records.json`（缓存头是否被仪表盘规则盖掉）；Buttondown 建号后填 `BUTTONDOWN_FORM_ID` 并过一遍 footer 列宽。

**没做的**：PR-7 新闻采集（等你拍板）。
