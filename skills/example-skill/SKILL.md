---
name: example-skill
description: Scaffold a new portable agent skill that follows the shared Agent Skills specification. Use when creating a skill folder in this repository, writing SKILL.md frontmatter, or checking the standard skills/ layout.
---

# Example Skill

This skill is a minimal template for the repository layout. Copy it whenever you need to create a new skill.

## Skill Layout

Each skill lives in `skills/<skill-name>/` and must contain a `SKILL.md` with YAML frontmatter:

```markdown
---
name: skill-name
description: What the skill does and when to use it.
---
```

Use lowercase letters, digits, and hyphens for `name`. Keep `description` specific about when the agent should invoke the skill.

## Add Resources Only When Needed

Add these optional directories only when the skill actually needs them:

- `scripts/` for executable code
- `references/` for documentation loaded only when needed
- `assets/` for templates, images, fonts, and other output resources
- `agents/openai.yaml` for Codex-specific UI metadata

Do not add `README.md` or installation guides inside a skill directory. Keep the skill self-contained and small.

## Validate

Run `npm run validate` after creating or changing a skill. The validator checks required frontmatter and name consistency.
