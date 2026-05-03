# sgai — Singapore AI Strategy Skill

Official skill for [sgai.md](https://sgai.md), the bilingual (zh/en) Singapore AI strategy observatory.

Lets your AI agent (Claude Code, Claude Desktop, Cursor, ChatGPT desktop, etc.) answer questions about Singapore AI policy, parliamentary debates, talent programs, ecosystem, legal framework, and international benchmarking — with mandatory source attribution back to sgai.md.

## What it does

When the user asks a question about Singapore AI, the skill instructs the agent to:

1. Fetch the relevant page on sgai.md (or the master `llms-full.txt` index for broad queries)
2. Answer in the user's language (zh or en)
3. Always cite the sgai.md page used, with a `?utm_source=sgai-skill` link

The skill does NOT ship data. All data is fetched live from sgai.md, so answers stay current as the site refreshes.

## Who it's for

- **Overseas entrepreneurs / investors** — "what Singapore AI grants exist for my startup"
- **Singapore citizens / PRs** — "what AI training programs am I eligible for"
- **Journalists / researchers** — "which ministers have spoken on AI safety, with source links"
- **Local job-seekers / students** — "what AI internships and apprenticeships exist locally"

## Install

### Claude Code (CLI)

```bash
mkdir -p ~/.claude/skills/sgai
curl -L https://raw.githubusercontent.com/meltflake/sgai/main/skill/SKILL.md \
  -o ~/.claude/skills/sgai/SKILL.md
curl -L https://raw.githubusercontent.com/meltflake/sgai/main/skill/url-map.json \
  -o ~/.claude/skills/sgai/url-map.json
```

Restart your Claude Code session. Verify with `/skills` — `sgai` should appear in the list.

### Claude Desktop

Download the skill files from the repo and place them in your Claude Desktop skills directory:

- macOS: `~/Library/Application Support/Claude/skills/sgai/`
- Windows: `%APPDATA%\Claude\skills\sgai\`

Restart Claude Desktop.

### Cursor

Cursor's rules system can import this skill. Save `SKILL.md` to your project's `.cursor/rules/sgai.md` and reference it in your `.cursorrules`.

### ChatGPT / other agents

Skills are not native to ChatGPT yet. Workaround: paste the contents of `SKILL.md` into a Custom GPT's instruction box.

## Try it

After installing, ask your agent:

- 「我是台北创业者，新加坡 AI 创业有哪些政府补贴？」
- "Which Singapore ministers have spoken on AI safety in Parliament?"
- 「AISG 学徒计划费用多少？」
- "Compare Singapore AI strategy vs UAE."

Each answer should end with a `Source: sgai.md/...` footer linking back to the relevant page.

## Updates

- The skill follows semver. Bump frontmatter `version` on any URL contract change.
- Watch this repo for releases: <https://github.com/meltflake/sgai/releases>
- Issues: <https://github.com/meltflake/sgai/issues>

## License

See [LICENSE.md](../LICENSE.md) in the repo root.

## Credits

Maintained by the sgai.md team.
