# ja/ko 官职头衔统一方案（已执行）

> **执行记录（2026-08-11）**：本方案已在独立 PR 批量执行完毕。实际方法与第 41 节略有升级——不逐条镜像 #188 diff，而是以修好的 zh 轨为每段 rank 真值做 token 序数对齐（覆盖面更大，连 #188 之前就存在的翻译自带 rank 错也一并修）。共修 debate/speech/video 三个 transcript 文件约 2,700 段 + voices/debates/videos/people 标量字段 160 处；顺带修复 zh 轨残留（协调部长/州政务部长/国会高级秘书、繁体段落、梅业成→马炎庆 等幻觉人名）与 Heng Chee How（王志豪）错代为王瑞杰/王乙康的 5 个记录。ko 特有发现：standalone 부장관（部长误译为副部长级）566 段、주차장（停车场）含 차장 的 tokenizer 陷阱、助词（이/가·은/는）随人名收音联动。

2026-08-11 起草。zh 轨头衔已由 PR #188 统一（MOS=政务部长、SMS=高级政务部长、PS=政务次长、SPS=高级政务次长、SM=国务资政）。ja/ko 轨仍混乱，且**继承了旧 zh 轨的 rank 错误**（例如 EN 是 MOS 的段落，ja 写成上級国務大臣）。本文件定标准映射与执行方法，批量修在独立 PR 执行。

## 现状清点（debate-transcripts.ts，2026-08-11 人名修复后）

| ja 现存写法 | 次数 | ko 现存写法 | 次数 |
| --- | --- | --- | --- |
| 国務部長 | 188 | 국무부장관 | 240 |
| 国務大臣 | 157 | 국무장관 | 102 |
| 上級国務大臣 | 93 | 국무 부장관 | 24 |
| 資深国務部長 | 13 | 선임 국무부장관 | 22 |
| 政務次官 | 13 | 고급 의회 비서 | 17 |
| シニア議員 | 9 | 상급 국무부장관 | 14 |
| 国務政務官 | 4 | 고급국무차관 | 14 |
| 上級大臣 | 4 | 의회 비서 | 10 |
| | | 정무차관 | 8 |

## 提议的标准映射（以 EN 原文 rank 为准）

| EN | zh（已定） | ja（提议） | ko（提议） |
| --- | --- | --- | --- |
| Minister | 部长 | 大臣 | 장관 |
| Second Minister | 第二部长 | 第二大臣 | 제2장관 |
| Coordinating Minister | 统筹部长 | 調整大臣 | 조정장관 |
| Senior Minister (SM) | 国务资政 | 上級相 | 선임장관 |
| Minister of State (MOS) | 政务部长 | 国務大臣 | 국무장관 |
| Senior Minister of State (SMS) | 高级政务部长 | 上級国務大臣 | 선임국무장관 |
| Parliamentary Secretary (PS) | 政务次长 | 政務次官 | 정무차관 |
| Senior Parliamentary Secretary (SPS) | 高级政务次长 | 上級政務次官 | 선임정무차관 |
| Permanent Secretary | 常任秘书 | 事務次官 | 사무차관 |

选型理由：

- ja MOS=国務大臣：与日本内阁的「国務大臣」语义有冲突，但为现存最大写法之一（157），且 国務部長（188）是生造词。合并两者为 国務大臣，加总后覆盖率最高、diff 最小。
- ja SM=上級相：日媒对新加坡 SM 的惯用简称（リー・シェンロン上級相）。存量 上級大臣（4）并入。
- ko MOS=국무장관：与美国国务卿撞词，但站内 ko 语料已以 국무장관/국무부장관 为主（342 处），站内一致性优先。국무부장관 全部并入 국무장관。
- ko SPS=선임정무차관：淘汰直译怪词 고급 의회 비서 / 의회 비서（"parliamentary secretary" 的字面直译）。
- シニア議員（ja）/ 고급 의회 비서（ko）这类词不携带可靠 rank 信息，必须逐段对 EN 定 rank 后改写，不能全局替换。

## 执行方法（关键：不能只做词面替换）

1. **Rank 镜像**：解析 PR #188 对 zh 轨的 diff，得到每个 (record, para) 的 rank 修正（如 政务次长→政务部长 = PS→MOS）。在同索引的 ja/ko 段落应用同款 rank 修正（zh↔ja↔ko 段数配平保证索引对齐）。这一步修「rank 错」。
2. **词面归一**：rank 修完后，把非标准词全局归一到上表（国務部長→国務大臣、資深国務部長→上級国務大臣、국무부장관→국무장관、고급국무차관→선임정무차관 等）。歧义词（シニア議員、의회 비서、정무 차장）不进全局表，逐段对 EN。
3. **门禁**：跑 `npm run check`（transcript 四语门）+ 抽样 20 段人工对 EN 复核 rank。
4. 同样处理 speech-transcripts.ts / video-transcripts.ts / voices.ts / debates.ts 的 ja/ko 标量字段（titleJa/titleKo/positionJa 等）。

## 关联

- 人名塌缩修复：见 2026-08-11 commit `fix(i18n): correct collapsed and hallucinated official names`（本分支）。
- ja/ko 轨还遗留「读音级」人名乱写（同一正确人物的音译不一致，如 ヤン・ジンヨン/ガン・キムヨン 都指颜金勇；탄진성/찬춘싱 都指陈振声）——与头衔统一同批处理为宜，方法相同：以 glossary.json 的 ja 名 + EN 拉丁名为标准归一。
