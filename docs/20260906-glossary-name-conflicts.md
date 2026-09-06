# 2026-09-06 glossary 人名冲突排查：两条互相矛盾的指令

## 起因

[#282](https://github.com/meltflake/sgai/pull/282) 把 glossary 的 `people` 从 25 条扩到 115 条。扩充后做交叉验证——拿新抓的 parliament.gov.sg 数据比对原有 25 条人工整理的条目——发现两处不一致，进而暴露一个我引入的缺陷。

## 缺陷

同一个英文名同时对应两条 glossary 条目时，`buildGlossaryHint()` 会输出两行互相矛盾的指令：

```
- Zaqy Mohamad → 扎吉
- Zaqy Mohamad → 扎吉哈
```

模型收到两个「必须严格照此翻译」的相反要求。注意 `ja` / `ko` 数组在 zh 方向也被当作匹配别名，所以只删 `en` 不够。

## 处置

| 人物 | 官方页 | 站内既有用法 | 处置 |
| --- | --- | --- | --- |
| Rahayu Mahzam | `拉哈尤 玛赞`（ASCII 空格） | `拉哈尤·玛赞` ×1 | 用间隔号形式。音译名在本站一律用间隔号（阿扎尔·奥斯曼），页面上的空格是排版产物 |
| Zaqy Mohamad | `扎吉哈` | `扎吉` ×51 | **暂用 `扎吉`**，删掉未被任何内容使用的 `扎吉哈` 条目 |

Zaqy Mohamad 这条是实质分歧（多一个音节），不是排版问题。官方页写 `扎吉哈`，但站内 51 处都用 `扎吉`。改这 51 处属于内容决策，且需要跟 [Low Yen Ling 那次](20260906-low-yen-ling-name-regression.md) 一样逐条取证，不适合顺手带过。**留待人工定夺。**

## 现状

- glossary `people` 113 条，别名冲突 0。
- 逐条比对 parliament.gov.sg：105 条一致，2 条为上述已知分歧，6 条不是现任议员（前任部长等，本来就查不到）。
- `test:lib` 437 项、`npm run check` 全过。
