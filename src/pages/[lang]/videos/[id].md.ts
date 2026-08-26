// /<lang>/videos/<id>.md — Markdown twin of the localized video detail
// page. Mirrors src/pages/[lang]/videos/[id].astro's getStaticPaths.

import type { APIRoute, GetStaticPaths } from 'astro';
import { videos } from '~/data/videos';
import { NON_DEFAULT_ROUTE_LOCALES, type Lang } from '~/i18n';
import { videoToMarkdown } from '~/utils/markdown-export';

export const prerender = true;

export const getStaticPaths = (() =>
  NON_DEFAULT_ROUTE_LOCALES.flatMap((lang) =>
    videos.map((video) => ({ params: { lang, id: video.id }, props: { video } }))
  )) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props, params }) =>
  new Response(videoToMarkdown(props.video, params.lang as Lang), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
  });
