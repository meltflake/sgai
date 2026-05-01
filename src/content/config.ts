import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),

      canonical: z.string().url().optional(),

      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),

      description: z.string().optional(),

      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),

      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

const postCollection = defineCollection({
  loader: glob({ pattern: ['**/*.md', '**/*.mdx'], base: 'src/data/post' }),
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),

    // i18n (v0.3.0). Posts default to 'zh'; '.en.md' siblings carry lang: 'en'.
    // EN posts render at /en/<slug>/ (permalink generation handles prefix).
    lang: z.enum(['zh', 'en']).optional(),

    // Phase 1 cross-references — bi-directional knowledge graph between
    // blog posts and data pages. Hand-curated in frontmatter; consumed
    // by RelatedRail (Phase 2) and verify-graph.ts (Phase 1.14).
    relatedPolicyIds: z.array(z.string()).optional(),
    relatedDebateIds: z.array(z.string()).optional(),
    relatedLeverNumbers: z.array(z.number()).optional(),
    relatedTimelineYears: z.array(z.number()).optional(),
    relatedPersonIds: z.array(z.string()).optional(),

    // Phase 2 long-form features.
    citations: z
      .array(
        z.object({
          id: z.string(),
          text: z.string(),
          url: z.string().url().optional(),
        })
      )
      .optional(),
    tocDepth: z.number().min(1).max(4).optional(),

    metadata: metadataDefinition(),
  }),
});

export const collections = {
  post: postCollection,
};
