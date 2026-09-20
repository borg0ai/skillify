# Skill contract

`SKILL.md` must contain YAML frontmatter with:

```yaml
---
name: lowercase-hyphenated-name
description: Use when a concrete trigger occurs
---
```

Required checks:

- `name` is unique, stable, and matches the skill directory.
- `description` explains activation conditions, not the full workflow.
- Body instructions are self-contained and ordered.
- Relative links resolve from the skill directory.
- Commands use tools available in the target environment or state prerequisites.
- Failure paths preserve data and report exact errors.
- No test files, fixtures, generated output, secrets, or absolute local paths ship.

`npx skills` installation proves discovery and packaging only. It does not prove instruction quality, agent compliance, or runtime correctness of referenced commands.
