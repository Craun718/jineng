# Conventional Commits Reference

Summary of the Conventional Commits 1.0.0 specification.

## Commit message structure

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

The header (type / scope / description) is required. The body and footer are
optional. A blank line must separate the header from the body, and the body
from the footer.

## Types

- `feat`: a new feature (correlates with MINOR in SemVer)
- `fix`: a bug fix (correlates with PATCH in SemVer)
- `docs`: documentation-only changes
- `style`: changes that do not affect code meaning (whitespace, formatting,
  missing semicolons, etc.)
- `refactor`: a code change that neither fixes a bug nor adds a feature
- `perf`: a code change that improves performance
- `test`: adding missing tests or correcting existing ones
- `build`: changes affecting the build system or external dependencies
- `ci`: changes to CI configuration files and scripts
- `chore`: other changes that do not modify src or test files
- `revert`: reverts a previous commit

## Breaking changes

Mark a breaking change with `!` after the type/scope, before the colon:

```
feat(api)!: remove the deprecated /v1 endpoint
```

Or document it in the footer with `BREAKING CHANGE:`:

```
feat: redesign settings page

BREAKING CHANGE: the settings API response no longer includes the legacy field.
```

## Scope

The scope is optional and names the affected subsystem, module, or component:

```
fix(auth): validate token expiry on refresh
```

Check the repo's existing history to see whether scopes are used and follow the
same convention. When in doubt and the history uses no scopes, omit it.

## Footer

Footers carry metadata. Each footer is a single line of the form `Token: value`
or `Token #value`. Common patterns:

- `BREAKING CHANGE: <description>` - documents a breaking change
- `Closes #123`, `Fixes #42` - links issues / PRs
- `Reviewed-by: <name>` - review attribution
- `Co-Authored-By: <name> <email>` - co-authorship

## Examples

Feature with scope and body:

```
feat(parser): handle quoted strings in arguments

Previously, arguments containing spaces were split incorrectly. The tokenizer
now respects single and double quotes.

Closes #128
```

Simple fix:

```
fix: prevent division by zero in ratio calc
```

Chore:

```
chore: bump dependencies to latest patch
```

Revert:

```
revert: feat(parser): handle quoted strings

This reverts commit 1234567890abcdef.
```
