// /data/videos.json — the video corpus as data.
//
// Every video the /videos/ pages render, in all four authored languages
// (zh-tw is derived at render time from zh and is therefore not a stored
// field — see CLAUDE.md rule #5). Transcript bodies are NOT here: they are
// large, and the verbatim ones are not ours to relicense. Use the Markdown
// twin (/videos/<id>.md) or the YouTube source for those.

import { videos } from '~/data/videos';
import { envelope, recordLinks } from '~/utils/data-export';

export const prerender = true;

export const GET = () => {
  const rows = videos.map((v) => ({
    id: v.id,
    date: v.date,
    title: v.title,
    titleEn: v.titleEn ?? null,
    titleJa: v.titleJa ?? null,
    titleKo: v.titleKo ?? null,
    speaker: v.speaker,
    speakerTitle: v.speakerTitle,
    speakerTitleEn: v.speakerTitleEn ?? null,
    topic: v.topic,
    topicEn: v.topicEn ?? null,
    youtubeUrl: v.youtubeUrl,
    channel: v.channel,
    summary: v.summary,
    summaryEn: v.summaryEn ?? null,
    summaryJa: v.summaryJa ?? null,
    summaryKo: v.summaryKo ?? null,
    whyItMatters: v.whyItMatters ?? null,
    whyItMattersEn: v.whyItMattersEn ?? null,
    whyItMattersJa: v.whyItMattersJa ?? null,
    whyItMattersKo: v.whyItMattersKo ?? null,
    addedAt: v.addedAt ?? null,
    links: recordLinks(`/videos/${v.id}/`, v.youtubeUrl),
  }));
  return new Response(JSON.stringify(envelope('videos', rows), null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
