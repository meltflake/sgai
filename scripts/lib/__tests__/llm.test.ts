// scripts/lib/__tests__/llm.test.ts
//
// Unit tests for lib/llm.ts. We mock the `claude` binary by writing a
// tiny shell script and pointing SGAI_CLAUDE_BIN at it. This avoids
// spending real Claude credits in CI / local test runs.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { callLlm, callLlmJson, ensureClaudeAvailable } from '../llm.ts';

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
