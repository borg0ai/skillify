# Repository layout

## Single skill

Use a same-name directory when mirroring Archify:

```text
repository/
  skill-name/
    SKILL.md
    skill-release.json
    LICENSE
    package.json
    references/
    scripts/
    assets/
  README.md
  LICENSE
```

`SKILL.md` and `skill-release.json` live inside the skill directory. `package.json` is optional: include it only when the skill needs Node runtime metadata, a `bin` entry, or version identity shared with npm tooling.

This keeps product metadata and the installable skill separate from repository docs and tests. `npx skills` discovers the skill through repository search; a direct skill directory URL removes ambiguity.

## Skill catalog

Use the standard container for multiple skills:

```text
repository/
  skills/
    first-skill/SKILL.md
    second-skill/SKILL.md
```

Each skill directory still carries its own `skill-release.json`. This is the clearest layout for `npx skills add repository --skill name` and `--all`.

## Release boundary

Only files required at runtime belong under a published skill directory. See [release-boundary.md](release-boundary.md). Never link to a path outside the skill directory.
