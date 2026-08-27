// /debates/<id>.md — Markdown twin of the EN debate detail page.
// Mirrors src/pages/debates/[id].astro's getStaticPaths exactly.

import type { APIRoute, GetStaticPaths } from 'astro';
import { debates } from '~/data/debates';
import { debateToMarkdown } from '~/utils/markdown-export';

export const prerender = true;

const lang = 'en' as const;

export const getStaticPaths = (() =>
  debates.map((debate) => ({ params: { id: debate.id }, props: { debate } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  // Headers are advisory in a static build (output: 'static') — Cloudflare
  // Pages serves the file and applies public/_headers. They are kept so
  // `astro dev` / `astro preview` answer correctly too.
  new Response(debateToMarkdown(props.debate, lang), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
  });
