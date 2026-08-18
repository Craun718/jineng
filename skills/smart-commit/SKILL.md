---
name: smart-commit
description: Commit ONLY the currently staged (git index) changes with a Conventional Commits message whose type, scope, and language match the repository's existing commit history. Use whenever the user wants to commit what is already staged without staging more files or touching the working tree. Never stages source files or edits files (sole exception: recording a submodule's new commit pointer after committing that submodule). When the repo has submodules, commits them depth-first before the parent.
---

# Smart Commit

Create a Conventional Commits commit from the **current git index only**. Leave
the index and working tree exactly as they are: no `git add` of source files, no
file edits, and no `git commit -a`. The one deliberate exception is submodule
pointers.

## Hard rules

These rules are non-negotiable:

- Stage nothing. Never run `git add`, `git add -A/-p/.`, `git rm --cached`,
  `git restore --staged`, `git commit -a`, or any command that mutates the
  index or working tree. The sole exception is `git add <submodule-path>` after
  committing a submodule whose pointer advanced during this run.
- Edit nothing. Do not modify, format, lint, run codegen, or save any file.
- Commit exactly the current staged content. If the index is empty and no
  submodule produced a pointer bump, stop and report: "Nothing is staged,
  nothing to commit." Do not stage fallback files.
- Do not pass `--no-verify`; respect hooks unless the user explicitly asks.
- If a pre-commit hook fails, report the failure verbatim. Do not retry with
  bypass flags.
- Keep the subject and body in the same language. Never add a
  `Co-authored-by` trailer or any other co-author or generated-by attribution.

## Workflow

1. Handle submodules first. If `.gitmodules` exists or `git submodule status`
   lists entries, commit them depth-first before this repo. Skip this step if
   there are no submodules.
2. Confirm staged content in the current repo:

   ```sh
   git diff --cached --stat
   ```

   If it is empty, stop unless submodule handling produced a staged pointer.
3. Read the staged diff and status:

   ```sh
   git diff --cached
   git status
   ```

   Ignore every unstaged and untracked entry; never touch them.
4. Learn this repo's commit style from its own recent history:

   ```sh
   git log -n 25 --format='%s'
   ```

   If the command returns fewer than 3 commit subjects, ask the user which
   language to use for the new commit and wait for the answer before writing
   the message. Otherwise, match the dominant language, Conventional Commits
   types, scope usage, casing, and punctuation. Do not invent scopes when
   history does not use them.
5. Write a Conventional Commits message in the matched language and style.
6. Commit with one `-m` per paragraph:

   ```sh
   git commit -m "<subject>" -m "<optional body>" -m "<optional footer>"
   ```

   Do not use flags that change what is committed: no `-a`, paths, or
   `--amend` unless the user asks.

## Submodules

Commit **depth-first, innermost first**. Treat every submodule as its own
repository with its own history, language, and conventions.

For each submodule:

1. List submodules with `git submodule status`; recurse into nested submodules.
2. Run this workflow in the submodule. If it has nothing staged, skip it.
3. After committing a submodule, its HEAD advances while the parent's index
   still points to the old commit. In the parent, and only for that pointer,
   run:

   ```sh
   git add <submodule-path>
   ```

4. Continue upward. For a chain `main -> A -> B`, commit B, stage B in A,
   commit A, then stage A in main.

A submodule pointer already staged by the user must be included as-is; do not
re-stage or amend it. Submodules may be in detached HEAD; committing there is
valid, but report the state and do not push or create branches unless asked.

If the parent has no staged content of its own and only has pointer updates
produced by this run, commit those updates using the parent's history style,
typically `chore` or `build`.

## Conventional Commits

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Use the type that best fits the staged change: `feat`, `fix`, `docs`, `style`,
`refactor`, `perf`, `test`, `build`, `ci`, `chore`, or `revert`. Use `!` before
the colon for breaking changes. The description should be imperative and have
no trailing period unless the repository history uses periods. Add a body only
when it explains non-obvious why; keep it in the same language as the subject.
Use footers only when relevant, such as `BREAKING CHANGE` or an issue reference.

See `references/conventional-commits.md` for the full format and examples.

## Edge cases

- Fewer than 3 commit subjects: ask the user which language to use; do not
  assume English or another default.
- Mixed history with at least 3 subjects: use the dominant language among the
  most recent 25 subjects.
- If rebase, merge, cherry-pick, or revert is in progress, stop and report it.
  Do not commit through an in-progress operation.
