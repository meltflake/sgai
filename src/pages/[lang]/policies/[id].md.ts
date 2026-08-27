// /<lang>/policies/<id>.md — Markdown twin of the localized policy detail
// page. Mirrors src/pages/[lang]/policies/[id].astro's getStaticPaths.

import type { APIRoute, GetStaticPaths } from 'astro';
import { categories } from '~/data/policies';
import { NON_DEFAULT_ROUTE_LOCALES, type Lang } from '~/i18n';
import { policyToMarkdown } from '~/utils/markdown-export';

export const prerender = true;

export const getStaticPaths = (() => {
  const all = categories.flatMap((c) => c.policies).filter((p) => p.id);
  return NON_DEFAULT_ROUTE_LOCALES.flatMap((lang) =>
    all.map((policy) => ({ params: { lang, id: policy.id! }, props: { policy } }))
  );
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props, params }) =>
  new Response(policyToMarkdown(props.policy, params.lang as Lang), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
  });
