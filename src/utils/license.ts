// Single source of truth for the site's content/data license wording.
// Consumed by: AboutPage (prose), llms.txt / llms-full.txt (metadata line),
// `.md` exports (frontmatter), `/data/*.json` envelopes (`license` field).
//
// Field-level split, on purpose: sgai-authored fields (summary / translations /
// analysis / whyItMatters) are CC BY 4.0; verbatim source text (Hansard,
// speeches, video transcripts, policy source texts) stays © its rights holders
// and is reproduced for reference only. A blanket "content is CC BY 4.0"
// would be licensing text that is not ours to license. Full terms live in
// DATA-LICENSE.md at the repo root.

import type { Lang } from '~/i18n';
import { toTraditional } from '~/i18n/opencc';

export const CC_BY_4_URL = 'https://creativecommons.org/licenses/by/4.0/';
export const DATA_LICENSE_URL = 'https://github.com/meltflake/sgai/blob/main/DATA-LICENSE.md';

const LINES: Record<Exclude<Lang, 'zh-tw'>, string> = {
  zh: `许可：sgai 自产内容（摘要、译文、分析）CC BY 4.0，署名并链接 sgai.md 即可；逐字原文（国会记录、演讲、字幕、政策原文）© 原权利人，仅供引用。条款：${DATA_LICENSE_URL}`,
  en: `License: sgai-authored content (summaries, translations, analysis) is CC BY 4.0 — attribute and link to sgai.md. Verbatim source text (Hansard, speeches, transcripts, policy documents) remains © its original rights holders and is reproduced for reference only. Terms: ${DATA_LICENSE_URL}`,
  ja: `ライセンス：sgai が作成した内容（要約・翻訳・分析）は CC BY 4.0（出典明記と sgai.md へのリンクが条件）。逐語的な原文（議会記録・演説・字幕・政策原文）は原権利者に帰属し、参照目的でのみ掲載。条項：${DATA_LICENSE_URL}`,
  ko: `라이선스: sgai가 작성한 내용(요약·번역·분석)은 CC BY 4.0(출처 표기 및 sgai.md 링크 조건). 원문 전문(의회 기록·연설·자막·정책 원문)은 원권리자에게 귀속되며 참고용으로만 게재. 조건: ${DATA_LICENSE_URL}`,
};

/** One-line license notice for the given locale (zh-tw derived via OpenCC). */
export function licenseLine(lang: Lang): string {
  if (lang === 'zh-tw') return toTraditional(LINES.zh);
  return LINES[lang];
}

/** Structured license block for JSON envelopes. Keys are stable; do not rename. */
export function licenseObject() {
  return {
    authored: {
      name: 'CC BY 4.0',
      url: CC_BY_4_URL,
      scope: ['summary', 'whyItMatters', 'translations', 'analysis', 'metadata'],
      attribution: 'Singapore AI Observatory / sgai.md — link to the specific page',
    },
    verbatim: {
      name: 'All rights reserved by original rights holders',
      scope: ['hansard', 'speeches', 'videoTranscripts', 'policySourceTexts', 'quotations'],
      note: 'Reproduced for reference only; reuse via the original sourceUrl.',
    },
    terms: DATA_LICENSE_URL,
  };
}
