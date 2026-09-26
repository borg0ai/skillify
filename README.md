# Skillify

Skillify is an Agent Skill package for creating, reviewing, and validating reusable `SKILL.md` skills for `npx skills`, using Archify-style layout.

## Install

Global install with symlink (do not pass `--copy`):

```bash
npx skills add borg0ai/skillify -g -y
```

## Local validation

```bash
pnpm test
pnpm validate
pnpm check
npx skills add ./skillify --list
```

## Layout

```text
skillify/
  skillify/
    SKILL.md
    skill-release.json
    LICENSE
    scripts/
      validate-skill.mjs
    references/
      repository-layout.md
      skill-contract.md
      release-boundary.md
  README.md
  LICENSE
  test/
  .spec/
```

`skill-release.json` is required. `package.json` is optional and decided by the skill repository. Tests, fixtures, build output, and dependencies stay outside the skill package.
