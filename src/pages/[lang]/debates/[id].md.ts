// /<lang>/debates/<id>.md — Markdown twin of the localized debate detail
// page. Mirrors src/pages/[lang]/debates/[id].astro's getStaticPaths.

import type { APIRoute, GetStaticPaths } from 'astro';
import { debates } from '~/data/debates';
import { NON_DEFAULT_ROUTE_LOCALES, type Lang } from '~/i18n';
import { debateToMarkdown } from '~/utils/markdown-export';

export const prerender = true;

export const getStaticPaths = (() =>
  NON_DEFAULT_ROUTE_LOCALES.flatMap((lang) =>
    debates.map((debate) => ({ params: { lang, id: debate.id }, props: { debate } }))
  )) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props, params }) =>
  new Response(debateToMarkdown(props.debate, params.lang as Lang), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
  });
