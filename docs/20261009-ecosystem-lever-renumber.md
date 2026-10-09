# 生态页杠杆编号改用新编号

日期：2026-10-09

## 问题

杠杆框架改过一次编号。`src/data/levers.ts` 是唯一真相源，编号如下：

| 编号 | zh       | en                  |
| ---- | -------- | ------------------- |
| 1    | 基建     | Infrastructure      |
| 2    | 治理     | Governance          |
| 3    | 人才     | Talent              |
| 4    | 应用     | Applications        |
| 5    | 政府自用 | Government Self-Use |
| 6    | 外交     | Diplomacy           |

`src/data/ecosystem.ts` 有一部分实体仍用旧编号：1=基础研究，2=人才，3=产业应用，4=治理。
旧编号出现在两处：

- 正文的「七条传导杠杆」列表和 `singaporeRelevance*` 段落，四语都有。
- `relatedLeverNumbers` 数组。

结果：生态页显示错的杠杆编号，「相关杠杆」链接指向错的杠杆页。
同一文件里也有实体已用新编号，所以不能按数字整体平移。

## 改动

只改 `src/data/ecosystem.ts`。

1. 每处杠杆引用按括号里的名称定编号，不按原数字定。旧数字和新数字的实体都适用同一规则。
2. 括号里的名称统一成 `levers.ts` 的 `name` / `nameEn` / `nameJa` / `nameKo`。例：「产业应用」改为「应用」，`international affairs` 改为 `Diplomacy`。
3. 「基础研究」归入杠杆 4（应用）。理由：`levers.ts` 把「研究旗舰（A*STAR）」放在杠杆 4 下。
4. 同一实体的列表里，若「基础研究」和「产业应用」都变成杠杆 4，两条合并成一条。合并发生在 A*STAR、NUS、NTU、SGNLP 四个实体。
5. 列表按杠杆编号排序。
6. 每个实体的 `relatedLeverNumbers` 改为与 zh 列表的编号集合一致。共 32 个实体有改动。
7. `razer` 没有列表。它的旧数组 `[2, 3]` 对应人才 + 产业应用，改为 `[3, 4]`。
8. `kampong-ai`、`theseus-infrastructure`、`sembcorp` 没有列表，数组已是新编号，保持不变。

## 验证

- 四语的杠杆引用数在每个编号上相等。
- `grep` 查不到「基础研究 / 产业应用 / foundational research / industry」类旧标签。
- `npm run check`、`npm run build && npm run check:dist` 通过。
