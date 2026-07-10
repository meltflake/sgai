// scripts/lib/__tests__/llm.test.ts
//
// Unit tests for lib/llm.ts. We mock the `claude` binary by writing a
// tiny shell script and pointing SGAI_CLAUDE_BIN at it. This avoids
// spending real Claude credits in CI / local test runs.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync, readFileSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  callLlm,
  callLlmJson,
  ensureClaudeAvailable,
  ensureClaudeAuthed,
  extractJsonPayload,
  repairJsonInnerQuotes,
} from '../llm.ts';

function withFakeClaude<T>(scriptBody: string, fn: (binPath: string) => Promise<T>): Promise<T> {
  const dir = mkdtempSync(join(tmpdir(), 'sgai-llm-test-'));
  const binPath = join(dir, 'claude');
  writeFileSync(binPath, scriptBody);
  chmodSync(binPath, 0o755);
  return fn(binPath).finally(() => rmSync(dir, { recursive: true, force: true }));
}

test('callLlm: parses result event from event-stream JSON', async () => {
  await withFakeClaude(
    `#!/bin/bash
cat > /dev/null
echo '[{"type":"system","subtype":"init"},{"type":"assistant"},{"type":"result","subtype":"success","is_error":false,"result":"hello world"}]'`,
    async (binPath) => {
      process.env.SGAI_CLAUDE_BIN = binPath;
      try {
        const out = await callLlm('ignored');
        assert.equal(out, 'hello world');
      } finally {
        delete process.env.SGAI_CLAUDE_BIN;
      }
    }
  );
});

test('callLlm: strips ```json ... ``` markdown fence from result', async () => {
  await withFakeClaude(
    `#!/bin/bash
cat > /dev/null
echo '[{"type":"result","subtype":"success","is_error":false,"result":"\\u0060\\u0060\\u0060json\\n{\\"x\\":1}\\n\\u0060\\u0060\\u0060"}]'`,
    async (binPath) => {
      process.env.SGAI_CLAUDE_BIN = binPath;
      try {
        const out = await callLlm('ignored');
        assert.equal(out, '{"x":1}');
      } finally {
        delete process.env.SGAI_CLAUDE_BIN;
      }
    }
  );
});

test('callLlmJson: parses JSON output', async () => {
  await withFakeClaude(
    `#!/bin/bash
cat > /dev/null
echo '[{"type":"result","subtype":"success","is_error":false,"result":"{\\"answer\\":42}"}]'`,
    async (binPath) => {
      process.env.SGAI_CLAUDE_BIN = binPath;
      try {
        const out = await callLlmJson<{ answer: number }>('ignored');
        assert.equal(out.answer, 42);
      } finally {
        delete process.env.SGAI_CLAUDE_BIN;
      }
    }
  );
});

test('extractJsonPayload: strips conversational preamble around an array', () => {
  assert.equal(extractJsonPayload('Now I\'ll translate:\n["a","b"]'), '["a","b"]');
  assert.equal(extractJsonPayload('완료되었습니다:\n["가","나"]'), '["가","나"]');
});

test('extractJsonPayload: strips preamble and postamble around an object', () => {
  assert.equal(extractJsonPayload('Here is the JSON:\n{"x":1} Hope this helps!'), '{"x":1}');
});

test('extractJsonPayload: returns null when no bracket present', () => {
  assert.equal(extractJsonPayload('sorry, I cannot do that'), null);
});

test('callLlmJson: recovers from conversational preamble before JSON', async () => {
  await withFakeClaude(
    `#!/bin/bash
cat > /dev/null
echo '[{"type":"result","subtype":"success","is_error":false,"result":"Now I will translate the paragraphs:\\n[\\"가\\",\\"나\\"]"}]'`,
    async (binPath) => {
      process.env.SGAI_CLAUDE_BIN = binPath;
      try {
        const out = await callLlmJson<string[]>('ignored');
        assert.deepEqual(out, ['가', '나']);
      } finally {
        delete process.env.SGAI_CLAUDE_BIN;
      }
    }
  );
});

test('callLlm: throws on non-zero exit', async () => {
  await withFakeClaude(
    `#!/bin/bash
cat > /dev/null
echo "boom" >&2
exit 7`,
    async (binPath) => {
      process.env.SGAI_CLAUDE_BIN = binPath;
      try {
        await assert.rejects(() => callLlm('ignored'), /exited 7/);
      } finally {
        delete process.env.SGAI_CLAUDE_BIN;
      }
    }
  );
});

test('callLlm: throws on missing result event', async () => {
  await withFakeClaude(
    `#!/bin/bash
cat > /dev/null
echo '[{"type":"system","subtype":"init"}]'`,
    async (binPath) => {
      process.env.SGAI_CLAUDE_BIN = binPath;
      try {
        await assert.rejects(() => callLlm('ignored'), /no \{type:"result"\} event/);
      } finally {
        delete process.env.SGAI_CLAUDE_BIN;
      }
    }
  );
});

test('callLlm: passes user prompt via stdin', async () => {
  await withFakeClaude(
    `#!/bin/bash
INPUT=$(cat)
echo "[{\\"type\\":\\"result\\",\\"subtype\\":\\"success\\",\\"is_error\\":false,\\"result\\":\\"got: $INPUT\\"}]"`,
    async (binPath) => {
      process.env.SGAI_CLAUDE_BIN = binPath;
      try {
        const out = await callLlm('marker-12345');
        assert.equal(out, 'got: marker-12345');
      } finally {
        delete process.env.SGAI_CLAUDE_BIN;
      }
    }
  );
});

test('ensureClaudeAvailable: passes when binary returns 0', async () => {
  await withFakeClaude(
    `#!/bin/bash
echo "claude 1.0.0"
exit 0`,
    async (binPath) => {
      process.env.SGAI_CLAUDE_BIN = binPath;
      try {
        ensureClaudeAvailable();
      } finally {
        delete process.env.SGAI_CLAUDE_BIN;
      }
    }
  );
});

test('ensureClaudeAvailable: throws when binary missing', () => {
  const prev = process.env.SGAI_CLAUDE_BIN;
  process.env.SGAI_CLAUDE_BIN = '/nonexistent/claude-should-not-run';
  try {
    assert.throws(() => ensureClaudeAvailable(), /Claude CLI not available/);
  } finally {
    if (prev) process.env.SGAI_CLAUDE_BIN = prev;
    else delete process.env.SGAI_CLAUDE_BIN;
  }
});

// A fake `claude` that branches on `--version` (used by the cheap availability
// probe) vs `-p ...` (the inference smoke-test). The smoke-test branch echoes
// whatever JSON `body` says, so each test can simulate a healthy reply or a 401.
function fakeClaudeWithSmoke(smokeJson: string, extra = ''): string {
  return `#!/bin/bash
if [ "$1" = "--version" ]; then echo "claude 1.0.0"; exit 0; fi
cat > /dev/null
${extra}
echo '${smokeJson}'`;
}

test('ensureClaudeAuthed: passes when claude can run inference', async () => {
  await withFakeClaude(
    fakeClaudeWithSmoke('{"type":"result","subtype":"success","is_error":false,"result":"ok"}'),
    async (binPath) => {
      process.env.SGAI_CLAUDE_BIN = binPath;
      try {
        ensureClaudeAuthed();
      } finally {
        delete process.env.SGAI_CLAUDE_BIN;
      }
    }
  );
});

test('ensureClaudeAuthed: throws actionable auth error on 401', async () => {
  await withFakeClaude(
    fakeClaudeWithSmoke(
      '{"type":"result","subtype":"error_during_execution","is_error":true,"api_error_status":401,"result":"Failed to authenticate. API Error: 401 Invalid authentication credentials"}'
    ),
    async (binPath) => {
      process.env.SGAI_CLAUDE_BIN = binPath;
      try {
        assert.throws(
          () => ensureClaudeAuthed(),
          (err: Error) =>
            /not authenticated/i.test(err.message) &&
            /401/.test(err.message) &&
            /claude setup-token/.test(err.message) &&
            /claude auth login/.test(err.message)
        );
      } finally {
        delete process.env.SGAI_CLAUDE_BIN;
      }
    }
  );
});

test('ensureClaudeAuthed: throws clear error on is_error without explicit 401', async () => {
  await withFakeClaude(
    fakeClaudeWithSmoke('{"type":"result","is_error":true,"result":"some upstream error"}'),
    async (binPath) => {
      process.env.SGAI_CLAUDE_BIN = binPath;
      try {
        assert.throws(
          () => ensureClaudeAuthed(),
          (err: Error) =>
            /smoke-test failed/i.test(err.message) &&
            /some upstream error/.test(err.message) &&
            /claude setup-token/.test(err.message)
        );
      } finally {
        delete process.env.SGAI_CLAUDE_BIN;
      }
    }
  );
});

test('ensureClaudeAuthed: throws when binary missing', () => {
  const prev = process.env.SGAI_CLAUDE_BIN;
  process.env.SGAI_CLAUDE_BIN = '/nonexistent/claude-should-not-run';
  try {
    assert.throws(() => ensureClaudeAuthed(), /Claude CLI not available/);
  } finally {
    if (prev) process.env.SGAI_CLAUDE_BIN = prev;
    else delete process.env.SGAI_CLAUDE_BIN;
  }
});

test('ensureClaudeAuthed: runs the smoke-test once per process (cached)', async () => {
  const counterDir = mkdtempSync(join(tmpdir(), 'sgai-llm-count-'));
  const counter = join(counterDir, 'count');
  try {
    await withFakeClaude(
      fakeClaudeWithSmoke('{"type":"result","is_error":false,"result":"ok"}', `echo x >> ${counter}`),
      async (binPath) => {
        process.env.SGAI_CLAUDE_BIN = binPath;
        try {
          ensureClaudeAuthed();
          ensureClaudeAuthed();
          const hits = readFileSync(counter, 'utf8').trim().split('\n').filter(Boolean);
          assert.equal(hits.length, 1);
        } finally {
          delete process.env.SGAI_CLAUDE_BIN;
        }
      }
    );
  } finally {
    rmSync(counterDir, { recursive: true, force: true });
  }
});

// repairJsonInnerQuotes: the dominant translation-failure mode is the model
// emitting ASCII straight quotes INSIDE a JSON string value (e.g. a coined
// term like "AI Bilingual"), which breaks JSON.parse. These fixtures are
// distilled from the real nomura-speech failures captured 2026-06-21.

test('repairJsonInnerQuotes: escapes an inner quoted term that precedes a word', () => {
  const broken = '{"paragraphs":["The programme targets 100,000 "AI Bilingual" professionals."]}';
  const obj = JSON.parse(repairJsonInnerQuotes(broken)) as { paragraphs: string[] };
  assert.deepEqual(obj.paragraphs, ['The programme targets 100,000 "AI Bilingual" professionals.']);
});

test('repairJsonInnerQuotes: escapes an inner quoted phrase followed by a comma', () => {
  const broken = '{"tldr":["We call it "AI Bilingual", a new scheme.","Second bullet."]}';
  const obj = JSON.parse(repairJsonInnerQuotes(broken)) as { tldr: string[] };
  assert.equal(obj.tldr.length, 2);
  assert.equal(obj.tldr[0], 'We call it "AI Bilingual", a new scheme.');
  assert.equal(obj.tldr[1], 'Second bullet.');
});

test('repairJsonInnerQuotes: handles CJK inner quotes (zh translation output)', () => {
  const broken = '{"tldr":["培养100,000名"AI双语"专业人士。","第二条要点。"]}';
  const obj = JSON.parse(repairJsonInnerQuotes(broken)) as { tldr: string[] };
  assert.equal(obj.tldr.length, 2);
  assert.equal(obj.tldr[0], '培养100,000名"AI双语"专业人士。');
});

test('repairJsonInnerQuotes: leaves valid JSON intact (no over-escaping)', () => {
  const valid = '{"paragraphs":["normal text","more, with a comma"]}';
  const obj = JSON.parse(repairJsonInnerQuotes(valid)) as { paragraphs: string[] };
  assert.deepEqual(obj.paragraphs, ['normal text', 'more, with a comma']);
});

test('repairJsonInnerQuotes: preserves already-escaped inner quotes', () => {
  const valid = '{"paragraphs":["he said \\"hi\\" loudly"]}';
  const obj = JSON.parse(repairJsonInnerQuotes(valid)) as { paragraphs: string[] };
  assert.deepEqual(obj.paragraphs, ['he said "hi" loudly']);
});

test('callLlmJson: recovers from unescaped inner quotes in model output', async () => {
  await withFakeClaude(
    `#!/bin/bash
cat > /dev/null
echo '[{"type":"result","subtype":"success","is_error":false,"result":"{\\"v\\":[\\"a \\"b\\" c\\"]}"}]'`,
    async (binPath) => {
      process.env.SGAI_CLAUDE_BIN = binPath;
      try {
        const out = await callLlmJson<{ v: string[] }>('ignored');
        assert.deepEqual(out.v, ['a "b" c']);
      } finally {
        delete process.env.SGAI_CLAUDE_BIN;
      }
    }
  );
});
