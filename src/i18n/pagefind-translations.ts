// Pagefind UI strings per locale, shared by the header search modal
// (SearchModal.astro) and the full /search/ page (SearchPage.astro).
// Picked server-side so each page only ships its own language.
// Result-language filtering itself is automatic: Pagefind splits its index
// by <html lang> and PagefindUI loads the index matching the current page.
// zh-tw is hand-written (Taiwan wording differs from a mechanical OpenCC
// pass for UI verbs like 搜尋/清除/載入).

import type { Lang } from '~/i18n';

export const PAGEFIND_TRANSLATIONS: Record<Lang, Record<string, string>> = {
  zh: {
    placeholder: '搜索政策、辩论、抓手、人物、博文……',
    clear_search: '清空',
    load_more: '加载更多',
    search_label: '站内搜索',
    filters_label: '过滤',
    zero_results: '"[SEARCH_TERM]" 未找到结果',
    many_results: '为 "[SEARCH_TERM]" 找到 [COUNT] 条结果',
    one_result: '为 "[SEARCH_TERM]" 找到 [COUNT] 条结果',
    alt_search: '"[SEARCH_TERM]" 未找到结果。改用 "[DIFFERENT_TERM]" 显示结果',
    search_suggestion: '"[SEARCH_TERM]" 未找到结果。试试这些建议：',
    searching: '正在搜索 "[SEARCH_TERM]"……',
  },
  'zh-tw': {
    placeholder: '搜尋政策、辯論、抓手、人物、部落格文章……',
    clear_search: '清除',
    load_more: '載入更多',
    search_label: '站內搜尋',
    filters_label: '篩選',
    zero_results: '「[SEARCH_TERM]」未找到結果',
    many_results: '為「[SEARCH_TERM]」找到 [COUNT] 條結果',
    one_result: '為「[SEARCH_TERM]」找到 [COUNT] 條結果',
    alt_search: '「[SEARCH_TERM]」未找到結果。改用「[DIFFERENT_TERM]」顯示結果',
    search_suggestion: '「[SEARCH_TERM]」未找到結果。試試這些建議：',
    searching: '正在搜尋「[SEARCH_TERM]」……',
  },
  en: {
    placeholder: 'Search policies, debates, levers, people, articles…',
    clear_search: 'Clear',
    load_more: 'Load more',
    search_label: 'Site search',
    filters_label: 'Filters',
    zero_results: 'No results for "[SEARCH_TERM]"',
    many_results: '[COUNT] results for "[SEARCH_TERM]"',
    one_result: '[COUNT] result for "[SEARCH_TERM]"',
    alt_search: 'No results for "[SEARCH_TERM]". Showing results for "[DIFFERENT_TERM]" instead',
    search_suggestion: 'No results for "[SEARCH_TERM]". Try one of the following:',
    searching: 'Searching for "[SEARCH_TERM]"…',
  },
  ja: {
    placeholder: '政策、議論、レバー、人物、記事を検索…',
    clear_search: 'クリア',
    load_more: 'さらに読み込む',
    search_label: 'サイト内検索',
    filters_label: '絞り込み',
    zero_results: '「[SEARCH_TERM]」に一致する結果はありません',
    many_results: '「[SEARCH_TERM]」の検索結果：[COUNT] 件',
    one_result: '「[SEARCH_TERM]」の検索結果：[COUNT] 件',
    alt_search: '「[SEARCH_TERM]」に一致する結果はありません。「[DIFFERENT_TERM]」の結果を表示しています',
    search_suggestion: '「[SEARCH_TERM]」に一致する結果はありません。次の候補をお試しください：',
    searching: '「[SEARCH_TERM]」を検索中…',
  },
  ko: {
    placeholder: '정책, 토론, 레버, 인물, 글을 검색하세요…',
    clear_search: '지우기',
    load_more: '더 보기',
    search_label: '사이트 내 검색',
    filters_label: '필터',
    zero_results: '"[SEARCH_TERM]"에 대한 결과가 없습니다',
    many_results: '"[SEARCH_TERM]"에 대한 결과 [COUNT]건',
    one_result: '"[SEARCH_TERM]"에 대한 결과 [COUNT]건',
    alt_search: '"[SEARCH_TERM]"에 대한 결과가 없습니다. 대신 "[DIFFERENT_TERM]"의 결과를 표시합니다',
    search_suggestion: '"[SEARCH_TERM]"에 대한 결과가 없습니다. 다음을 시도해 보세요:',
    searching: '"[SEARCH_TERM]" 검색 중…',
  },
};
