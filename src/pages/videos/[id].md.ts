// /videos/<id>.md — Markdown twin of the EN video detail page.
// Mirrors src/pages/videos/[id].astro's getStaticPaths exactly.

import type { APIRoute, GetStaticPaths } from 'astro';
import { videos } from '~/data/videos';
import { videoToMarkdown } from '~/utils/markdown-export';

export const prerender = true;

const lang = 'en' as const;

export const getStaticPaths = (() =>
  videos.map((video) => ({ params: { id: video.id }, props: { video } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(videoToMarkdown(props.video, lang), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
  });
