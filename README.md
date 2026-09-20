# Skillify

Skillify is an Agent Skill package for creating, reviewing, and packaging reusable `SKILL.md` skills for `npx skills`.

## Install

```bash
npx skills add <owner>/skillify --skill skillify -g
```

## Local validation

```bash
npx skills add ./skillify --list
npx skills add ./skillify --skill skillify --agent codex --copy --yes
```

## Layout

```text
skillify/
  skillify/
    SKILL.md
    references/
      repository-layout.md
      skill-contract.md
  README.md
  LICENSE
  package.json
```

Tests, fixtures, build output, and dependencies are intentionally excluded from this skill package.
