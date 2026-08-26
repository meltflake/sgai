// /policies/<id>.md — Markdown twin of the EN policy detail page.
// Mirrors src/pages/policies/[id].astro's getStaticPaths exactly.

import type { APIRoute, GetStaticPaths } from 'astro';
import { categories } from '~/data/policies';
import { policyToMarkdown } from '~/utils/markdown-export';

export const prerender = true;

const lang = 'en' as const;

export const getStaticPaths = (() =>
  categories
    .flatMap((c) => c.policies)
    .filter((p) => p.id)
    .map((policy) => ({ params: { id: policy.id! }, props: { policy } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(policyToMarkdown(props.policy, lang), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
  });
