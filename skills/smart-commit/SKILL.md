---
name: smart-commit
description: Commit staged changes with Conventional Commits, handling nested git submodules deepest-first and re-staging updated submodule pointers. Use when committing staged work or creating conventional commit messages.
---

# Smart Commit

Commit staged changes with Conventional Commits messages, handling nested git
submodules in the correct order: submodules first (deepest first), then the
parent repo. Match the language of the repo's existing commit history.

## Workflow

### 1. Detect staged changes

Run in the repo root:

```sh
git diff --cached --stat
```

If nothing is staged, **stop and report**. Do not auto-stage files the user has
not chosen; this skill commits what is already staged, nothing more. The user
owns the staging decision.

### 2. Discover submodules recursively

```sh
git submodule status --recursive
```

This lists every submodule top-down, including nested ones. For each path
returned, check for staged changes inside it:

```sh
git -C <submodule-path> diff --cached --stat
```

Collect the set of submodule paths that **have staged changes**. If none do,
skip to step 5 (commit the main repo only).

### 3. Determine commit-message language from history

For each repo or submodule that has staged changes, inspect recent commits:

```sh
git log --oneline -20
```

Identify the dominant language of existing messages (e.g. English, Chinese,
Japanese). Write every new commit message **in that same language** so the
history stays consistent. Also note conventions visible in the history: whether
scopes are used, typical subject length, presence of bodies/footers.

### 4. Commit submodules - deepest first

Order submodules by nesting depth: **deepest first, then work upward** toward
the main repo. For each submodule with staged changes, in that order:

1. Inspect the staged diff: `git -C <path> diff --cached`
2. Write a Conventional Commits message in the history's language
3. Commit: `git -C <path> commit -m "<subject>"` (use `-F` for a multi-line body)
4. **Re-stage the updated submodule pointer in its parent:**
   `git -C <parent-path> add <submodule-relative-path>`

Step 4 is essential: committing a submodule changes the commit its gitlink
points at. The parent must stage that new pointer or the parent's commit will
not record the submodule update. For a nested chain (main -> A -> B): commit B,
`add` B inside A, commit A, `add` A inside main.

### 5. Commit the main repo

After all submodules are committed and their pointers re-staged:

1. Re-check staged state: `git diff --cached --stat` (now includes updated
   submodule pointers)
2. Write a Conventional Commits message for the main repo's staged changes
3. Commit: `git commit -m "<subject>"`

If the main repo had **no staged changes of its own** but submodule pointers were
re-staged in step 4, still commit those pointer updates so the parent records
the new submodule commits. Report clearly what was committed at each level.

## Message quality

- Write the subject in imperative mood matching the history language
  (English: "add login validation"; Chinese: "添加登录校验").
- Keep the subject at most 72 characters.
- Lowercase the first word of the subject; no trailing period.
- Add a body only when the "why" is not obvious from the diff.
- Use a scope to name the affected module/component only if the repo
  conventionally uses scopes (decide from history).

## Conventional Commits format

```
<type>[scope]: <description>

[optional body]

[optional footer(s)]
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`,
`build`, `ci`, `chore`, `revert`. For the full spec, the breaking-change (`!`)
notation, and footer conventions, see
`references/conventional-commits.md`.

## Key rules

- Never auto-stage user files. Only commit what is already staged.
- Always commit submodules before the parent repo.
- Always re-stage the submodule pointer in the parent after each submodule commit.
- Match the existing commit-message language.
- This skill commits; it does **not** push. Confirm with the user before pushing.
