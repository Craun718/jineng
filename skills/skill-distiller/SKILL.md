---
name: skill-distiller
description: Distill the current agent conversation into a reusable portable Agent Skill. Use when the user asks to create a skill from the current session, turn a workflow in this conversation into a skill, or summarize and package the main flow as SKILL.md. Works for any agent that reads portable skills.
---

# Skill Distiller

## Goal

Extract the main workflow from the current agent conversation, confirm it with the user, and create a self-contained portable skill. Never create or install a skill without explicit user approval.

## Source Material

Use only messages from the current conversation thread. Do not read other session logs, history files, or agent-specific session directories.

If the conversation is too long or contains multiple unrelated workflows, ask the user which segment to distill before continuing.

## Confirmation Gates

Get explicit confirmation before each of these actions:

1. Identifying the flow to distill.
2. Finalizing the skill name.
3. Creating the skill files.
4. Installing the skill anywhere.

If `grill-me` is available in the active agent's skill directory, for example as `$grill-me`, use it to run a focused clarification session on ambiguous details. Otherwise ask only the minimum questions needed.

## Workflow

1. Read the current conversation context and identify the primary workflow.
2. Write a concise numbered summary of the flow: inputs, steps, outputs, and reusable decisions.
3. Send the summary to the user and ask for confirmation. If the user corrects it, update the summary and confirm again.
4. Confirm the final skill name with the user. Propose a lowercase hyphenated name such as `my-workflow`.
5. Confirm the creation location before creating files. Default to `skills/<name>/` in the active skill repository when one exists, otherwise ask.
6. Create a self-contained skill directory:
   - `SKILL.md` with YAML frontmatter `name` and `description`
   - Optional product-specific metadata such as `agents/openai.yaml` for Codex
   - Optional `scripts/`, `references/`, or `assets/` only when the skill needs them
7. Do not add README, changelogs, or installation docs inside the skill.
8. Validate the skill and sync manifests as required by the repository.

## Skill Contents

Write the skill so a fresh agent can execute the workflow without the original conversation.

- Use imperative instructions.
- Include concrete triggers and examples only when they help selection.
- Keep the `SKILL.md` body agent-agnostic; product-specific configuration belongs in `agents/` or equivalent metadata.
- Move long reference material into `references/`.
- Exclude private data, one-off paths, and session-specific details unless they are variables in the skill.
- Keep `SKILL.md` under 500 lines and as concise as possible.

## Repository Rules

Follow the active repository's `AGENTS.md`. For this repository:

- Skills live under `skills/<skill-name>/`.
- `SKILL.md` frontmatter must have `name` and `description`.
- `name` must be lowercase ASCII letters, digits, and hyphens, and must match the directory name.
- Run `npm run validate` after changing a skill.
- Run `npm run sync` when adding, renaming, or removing skills.
- `agents/openai.yaml` is optional Codex-specific UI metadata and is not required for other agents; its default prompt should mention `$<skill-name>`.

## Installation

Do not install unless the user explicitly asks and confirms the target.

Before installing, confirm:

- Agent target, for example `codex`, `claude-code`, or `universal`.
- Scope, for example global or project-local.
- Copy or symlink.
- Whether to run `npm run install:skills -- --skills <skill-name> --agents <agents>` or use the platform's native skill installation flow.

If the user says repository only, stop after validation and sync without writing to any local skill directory.
