// scripts/refresh/hansard/classify.ts
// ────────────────────────────────────────────────────────────────────────
// TypeScript port of scripts/hansard/classify.py — graded keyword
// classifier for SPRS Hansard topic relevance.
//
// Tiers: STRONG / INFRA+ / INFRA / WEAK+ / NO. See classify.py for the
// full rationale and lessons-baked-in. This port exists so the TS-based
// refresh pipeline (scripts/refresh/hansard/run.ts) shares the same
// classification logic as the Python weekly scanner without spawning a
// Python subprocess.
//
// Both files MUST stay in sync. When adding a new keyword, update both,
// and add a test case in scripts/hansard/test_classify.py.

export type Bucket = 'STRONG' | 'INFRA+' | 'INFRA' | 'WEAK+' | 'NO';

interface PatternEntry {
  re: RegExp;
  label: string;
}

const PATTERNS_STRONG: PatternEntry[] = [
  { re: /\bAI\b/, label: 'AI' },
  { re: /\bA\.I\./, label: 'A.I.' },
  { re: /artificial intelligence/i, label: 'artificial intelligence' },
  { re: /generative\s*(?:ai|a\.i\.)\b/i, label: 'generative AI' },
  { re: /\bgen[-\s]?ai\b/i, label: 'gen-AI' },
  { re: /\bLLM[s]?\b/, label: 'LLM' },
  { re: /large\s+language\s+model/i, label: 'large language model' },
  { re: /foundation\s+model/i, label: 'foundation model' },
  { re: /machine\s+learning/i, label: 'machine learning' },
  { re: /neural\s+network/i, label: 'neural network' },
  { re: /deep\s*fake/i, label: 'deepfake' },
  { re: /\bChatGPT\b|\bClaude\b|\bGemini\b|\bLlama\b/, label: 'named LLM' },
  { re: /sea[-\s]?lion/i, label: 'Sea-Lion' },
  {
    re: /algorithmic\s+(decision|transparency|bias|accountability|governance|harm)/i,
    label: 'algorithmic governance',
  },
  {
    re: /(autonomous|self[-\s]driving)\s+(vehicle|car|bus|shuttle|system|driving)/i,
    label: 'autonomous vehicle',
  },
  { re: /facial?\s+recognition/i, label: 'facial recognition' },
  { re: /synthetic\s+(media|content|image|video)/i, label: 'synthetic media' },
  { re: /computer\s+vision/i, label: 'computer vision' },
  { re: /speech\s+recognition/i, label: 'speech recognition' },
  { re: /natural\s+language\s+processing|\bNLP\b/, label: 'NLP' },
  { re: /national\s+ai\s+strategy|\bNAIS\b/i, label: 'NAIS' },
  {
    re: /ai[-\s]+(verify|safety|governance|ethics|trust|literacy|talent)/i,
    label: 'AI program',
  },
  { re: /ai\s+singapore|\bAISG\b/i, label: 'AI Singapore' },
  { re: /transformer\s+model/i, label: 'transformer model' },
  { re: /(recommendation|ranking)\s+(algorithm|system|engine)/i, label: 'recommendation system' },
  { re: /predictive\s+(analytics|modeling|model)/i, label: 'predictive analytics' },
  { re: /automated\s+(decision|profiling)/i, label: 'automated decision' },
  { re: /\bRPA\b/, label: 'RPA' },
  { re: /chatbot|chat[-\s]bot/i, label: 'chatbot' },
  { re: /critical\s+information\s+infrastructure/i, label: 'CII (critical information infra)' },
  { re: /data\s+sovereignty/i, label: 'data sovereignty' },
  { re: /data\s+residency/i, label: 'data residency' },
  { re: /\bCLOUD\s+Act\b/, label: 'CLOUD Act' },
  { re: /\bagentic\b/i, label: 'agentic' },
];

const PATTERNS_INFRA: PatternEntry[] = [
  { re: /data\s+centre|data\s+center/i, label: 'data centre' },
  { re: /\bGPU[s]?\b/, label: 'GPU' },
  { re: /\bNVIDIA\b/i, label: 'NVIDIA' },
  { re: /\bHBM\b/, label: 'HBM' },
  { re: /sovereign\s+(compute|ai|model)/i, label: 'sovereign compute' },
  { re: /high[-\s]performance\s+computing|\bHPC\b/i, label: 'HPC' },
  { re: /quantum\s+(computing|technology|computer)/i, label: 'quantum' },
  { re: /cloud\s+(computing|infrastructure|sovereignty|services)/i, label: 'cloud infra' },
  { re: /semi[-\s]?conductor/i, label: 'semiconductor' },
  { re: /\bchip\s+(manufacturing|fabrication|design|foundry)/i, label: 'chip industry' },
  { re: /compute\s+(capacity|infrastructure|resources?)/i, label: 'compute infra' },
];

const PATTERNS_WEAK: PatternEntry[] = [
  { re: /smart\s+nation/i, label: 'Smart Nation' },
  { re: /digital\s+(identity|trust|economy|literacy)/i, label: 'digital policy' },
  { re: /\bIMDA\b/, label: 'IMDA' },
  { re: /\bPDPA\b|personal\s+data\s+protection/i, label: 'PDPA' },
  { re: /cybersecurity|cyber\s+security/i, label: 'cybersecurity' },
  { re: /misinformation|disinformation/i, label: 'misinfo/disinfo' },
  { re: /online\s+(harms?|safety|falsehoods?)/i, label: 'online harms' },
  { re: /biometric/i, label: 'biometric' },
  { re: /\balgorithm[s]?\b(?!ic)/i, label: 'algorithm (generic)' },
  {
    re: /autonomous(?!\s+(vehicle|car|bus|shuttle|system|driving))/i,
    label: 'autonomous (generic)',
  },
  { re: /digital\s+twin/i, label: 'digital twin' },
  { re: /robotic|robot/i, label: 'robot' },
  { re: /\bGovTech\b/i, label: 'GovTech' },
];

function hits(text: string, patterns: PatternEntry[]): string[] {
  const out = new Set<string>();
  for (const { re, label } of patterns) {
    if (re.test(text)) out.add(label);
  }
  return Array.from(out).sort();
}

export interface ClassifyResult {
  bucket: Bucket;
  strong: string[];
  infra: string[];
  weak: string[];
}

/**
 * Classify a Hansard topic title + body content into one of 5 buckets.
 *
 * @param title    SPRS reportTitle
 * @param content  cleaned (HTML-stripped) body text. Pass full or truncated.
 * @param contentWindow how many chars of body to consider. Default 8000.
 */
export function classify(title: string, content = '', contentWindow = 8000): ClassifyResult {
  const blob = title + ' ' + (content || '').slice(0, contentWindow);
  const strong = hits(blob, PATTERNS_STRONG);
  const infra = hits(blob, PATTERNS_INFRA);
  const weak = hits(blob, PATTERNS_WEAK);

  let bucket: Bucket;
  if (strong.length > 0) bucket = 'STRONG';
  else if (infra.length > 0 && (weak.length > 0 || infra.length >= 2)) bucket = 'INFRA+';
  else if (infra.length > 0) bucket = 'INFRA';
  else if (weak.length >= 2) bucket = 'WEAK+';
  else bucket = 'NO';

  return { bucket, strong, infra, weak };
}

export function isAiRelated(bucket: Bucket): boolean {
  return bucket === 'STRONG' || bucket === 'INFRA+' || bucket === 'WEAK+';
}
