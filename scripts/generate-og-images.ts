// scripts/generate-og-images.ts
// ────────────────────────────────────────────────────────────────────────
// Per-page OG images (P2-6). Extends the default-OG design (see
// generate-og-image.mjs) into page-specific variants: the homepage and
// the six tracker dimensions. Output lands in
// src/assets/images/og/<name>.png (versioned); pages point their
// openGraph.images at ~/assets/images/og/<name>.png so the asset pipeline
// resolves intrinsic dimensions.
//
// USAGE: npx tsx scripts/generate-og-images.ts
// Re-run after renaming any of the covered pages' titles.
//
// NOTE — the two pillar longforms (state-of-singapore-ai-2026 and
// aisg-explained) deliberately have NO per-post cover: their in-article
// hero images added confusion and no incremental information, so both
// posts fall back to the site-wide default OG (src/assets/images/
// og-default.png) for link previews.

import { mkdir } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { resolve } from 'node:path';

import sharp from 'sharp';

import { dimensions } from '../src/data/tracker';

const root = process.cwd();
const outDir = resolve(root, 'src/assets/images/og');
const logoPath = resolve(root, 'src/assets/favicons/logo.png');
const logo = await readFile(logoPath);
const logoDataUrl = `data:image/png;base64,${logo.toString('base64')}`;

interface OgTarget {
  name: string;
  title: string;
  subtitle: string;
}

const targets: OgTarget[] = [
  { name: 'home', title: "Singapore's AI strategy,", subtitle: 'tracked from the source.' },
  ...dimensions.map((d) => ({
    name: d.id,
    title: d.kind === 'quantified' ? (d.headlineEn ?? d.headline) : (d.badgeEn ?? d.badge),
    subtitle: d.titleEn ?? d.title,
  })),
];

function svgFor(t: OgTarget): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#F8F3EA"/>
  <circle cx="1040" cy="80" r="240" fill="#D80D32" fill-opacity="0.08"/>
  <circle cx="114" cy="520" r="220" fill="#0F172A" fill-opacity="0.05"/>
  <path d="M822 98C936 129 1020 208 1074 333C1129 462 1047 551 908 521C790 496 717 405 681 297C645 190 708 67 822 98Z" fill="#D80D32" fill-opacity="0.1"/>
  <rect x="72" y="72" width="1056" height="486" rx="36" fill="#FFFDF9" stroke="#E5DDD2" stroke-width="2"/>
  <image href="${logoDataUrl}" x="104" y="104" width="92" height="92"/>
  <text x="224" y="138" fill="#D80D32" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" letter-spacing="7">SGAI.MD</text>
  <text x="224" y="183" fill="#0F172A" font-family="Georgia, 'Times New Roman', serif" font-size="38" font-weight="700">Singapore AI Observatory</text>
  <line x1="104" y1="238" x2="1096" y2="238" stroke="#E5DDD2" stroke-width="2"/>
  <text x="104" y="324" fill="#0F172A" font-family="Georgia, 'Times New Roman', serif" font-size="62" font-weight="700">
    <tspan x="104" dy="0">${t.title}</tspan>
  </text>
  <text x="104" y="404" fill="#475569" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="500">
    <tspan x="104" dy="0">${t.subtitle}</tspan>
  </text>
  <text x="104" y="504" fill="#94A3B8" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="500">
    <tspan x="104" dy="0">sgai.md — policies · debates · levers · ecosystem signals</tspan>
  </text>
</svg>`;
}

await mkdir(outDir, { recursive: true });
for (const t of targets) {
  const out = path.join(outDir, `${t.name}.png`);
  await sharp(Buffer.from(svgFor(t))).png().toFile(out);
  process.stdout.write(`  ✓ ${path.relative(root, out)}\n`);
}
process.stdout.write(`Generated ${targets.length} OG images.\n`);
