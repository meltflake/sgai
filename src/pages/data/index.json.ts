// /data/index.json — the dataset catalogue.
//
// One entry per machine-readable export, with its live row count and a
// one-line English description. Start here: an agent that fetches this
// first knows every endpoint, how big it is, and what is in it, without
// downloading megabytes to find out. The formal contract for the same six
// paths is /openapi.json.

import { debates } from '~/data/debates';
import { categories as policyCategories } from '~/data/policies';
import { dimensions } from '~/data/tracker';
import { videos } from '~/data/videos';
import { harvestAll } from '~/utils/derived-updates';
import { datasetUrl, envelope } from '~/utils/data-export';

export const prerender = true;

interface DatasetEntry {
  dataset: string;
  url: string;
  count: number;
  description: string;
}

export const GET = () => {
  const policyCount = policyCategories.reduce((n, cat) => n + cat.policies.length, 0);

  const items: DatasetEntry[] = [
    {
      dataset: 'debates',
      url: datasetUrl('debates.json'),
      count: debates.length,
      description:
        'Every AI-related Singapore parliamentary debate record: id, sitting date, type, Chinese and English title and summary, topics, speakers, Hansard source URL.',
    },
    {
      dataset: 'policies',
      url: datasetUrl('policies.json'),
      count: policyCount,
      description:
        'Every tracked Singapore AI policy document: category, publication date, issuing body, Chinese and English title and summary, source URL.',
    },
    {
      dataset: 'tracker',
      url: datasetUrl('tracker.json'),
      count: dimensions.length,
      description:
        'The tracker dimensions: headline figure or qualitative badge, trend, ranking anchors and individual metric rows with their sources.',
    },
    {
      dataset: 'videos',
      url: datasetUrl('videos.json'),
      count: videos.length,
      description:
        'Every catalogued talk and interview: speaker, title, topic, YouTube URL, channel, and four-language summary and why-it-matters lines. Transcript bodies are not included.',
    },
    {
      dataset: 'records',
      url: datasetUrl('records.json'),
      count: harvestAll().length,
      description:
        'One row per dated record across every domain, newest first — the machine twin of the site updates feed. Poll this to see what is new.',
    },
    {
      dataset: 'debates-csv',
      url: datasetUrl('debates.csv'),
      count: debates.length,
      description:
        'The debate dataset as CSV for spreadsheets and notebooks. Bare CSV, no envelope: header row plus one row per debate.',
    },
  ];

  return new Response(JSON.stringify(envelope('index', items), null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
