# Repository layout

## Single skill

Use a same-name directory when mirroring Archify:

```text
repository/
  skill-name/
    SKILL.md
```

This keeps product metadata and the installable skill separate. `npx skills` can discover the skill through repository search; a direct skill directory URL removes ambiguity.

## Skill catalog

Use the standard container for multiple skills:

```text
repository/
  skills/
    first-skill/SKILL.md
    second-skill/SKILL.md
```

This is the clearest layout for `npx skills add repository --skill name` and `--all`.

## Release boundary

Only files required at runtime belong under a published skill directory:

```text
SKILL.md
references/
scripts/
assets/
```

Keep tests, fixtures, docs site sources, lockfiles, screenshots, and build output outside that boundary. Never link to a path outside the skill directory.
