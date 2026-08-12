---
name: skill-mentor
description: Analyze a skill used in the current conversation and propose concrete improvements based on execution results, user corrections, and output gaps. Use when the user asks to review, refine, optimize, or fix a skill after using it.
---

# Skill Mentor

## Purpose

Review how a skill was used in the current message history, identify why its execution diverged from the user's intent, and propose minimal edits to that skill. Never modify a skill file until the user has reviewed and explicitly approved the proposal.

## Select the Target Skill

1. If the user explicitly names the skill to optimize, use that skill.
2. If no target is named and the current message history does not show another skill being used as the workflow under review, ask the user which skill to optimize and what content or outcome to evaluate. If that skill produces files or content, ask for the generated files, the user's manual edits, and the expected result.
3. If multiple skills were used, select the skill that carried the main workflow. If the main skill is unclear, ask the user which one to optimize.
4. Unless the user already chose the target skill, confirm your selection with the user before continuing.

## Collect Evidence

Use only the current message history and materials the user explicitly provides. Do not read other logs, session files, reference material, or project files without asking.

Gather:
- The skill's execution steps and visible results.
- User commands added after the skill started and where they were inserted.
- Generated outputs or files, plus the user's manual edits.
- The expected outcome and any feedback about gaps.

## Analyze

1. Simplify: identify flows that are more complex than needed and propose an equivalent, simpler flow.
2. Understand corrections: explain why each mid-execution user command was necessary and convert that into a skill revision.
3. Compare outcomes: compare the actual result with the expected result item by item, identify material differences, and trace each difference to a root cause.

## Propose Changes

Present a concise review with:
- The target skill and why it was selected.
- Each proposed edit and the evidence or root cause behind it.
- Any proposed change that affects references, structure, or examples.

Do not hardcode the internal content, structure, or examples of reference material into the updated skill. If an edit depends on such material, reference it generically or ask the user to provide the exact material.

## Approval Gate

Ask the user to review the proposal and approve it before writing any skill files. Apply changes only after explicit approval. If the user revises the proposal, update the analysis and confirm again before writing.

## After Approval

Apply only the approved changes. Follow repository-specific validation and manifest sync rules when they exist. Report the changed files and any remaining uncertainty or untested behavior.
