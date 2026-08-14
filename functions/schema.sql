-- Ask-AI usage log. Apply with:
--   wrangler d1 execute sgai-qa --remote --file=functions/schema.sql
CREATE TABLE IF NOT EXISTS qa_turns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,
  session_id TEXT NOT NULL DEFAULT '',
  turn INTEGER NOT NULL DEFAULT 0,
  lang TEXT NOT NULL DEFAULT '',
  question TEXT NOT NULL DEFAULT '',
  answer TEXT NOT NULL DEFAULT '',
  model TEXT NOT NULL DEFAULT '',
  tokens_in INTEGER NOT NULL DEFAULT 0,
  tokens_out INTEGER NOT NULL DEFAULT 0,
  cache_hit_tokens INTEGER NOT NULL DEFAULT 0,
  cache TEXT NOT NULL DEFAULT 'none',
  ip_hash TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'ok'
);
CREATE INDEX IF NOT EXISTS idx_qa_turns_ts ON qa_turns (ts);
CREATE INDEX IF NOT EXISTS idx_qa_turns_session ON qa_turns (session_id);
