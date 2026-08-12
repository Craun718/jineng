# Repository Guidance

This repository stores portable Agent Skills. Each skill must be a self-contained directory under `skills/` with a valid `SKILL.md`.

## Rules

- `SKILL.md` requires YAML frontmatter with `name` and `description`.
- `name` must be lowercase ASCII with digits and hyphens only.
- The skill directory basename must match the frontmatter `name`.
- Keep `SKILL.md` concise. Put detailed material in `references/` only when needed.
- Do not add README, changelogs, or installation docs inside a skill directory.
- Add `agents/openai.yaml` only when Codex UI metadata is needed.
- Run `npm run validate` before committing.
- Run `npm run sync` when adding, renaming, or removing skills.

## Discovery Compatibility

The `skills/` layout is recognized by the shared Agent Skills ecosystem and by the `npx skills` CLI from `vercel-labs/skills`. The same layout is used by `vercel-labs/agent-skills`.

Supported layout forms:

```text
skills/<skill-name>/SKILL.md
skills/<category>/<skill-name>/SKILL.md
```

The CLI also discovers `.claude-plugin/marketplace.json` and `.claude-plugin/plugin.json`, so keep generated manifests in sync.
