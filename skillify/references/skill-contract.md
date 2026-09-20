# Skill contract

`SKILL.md` must contain YAML frontmatter with:

```yaml
---
name: lowercase-hyphenated-name
description: Capability summary. Use when a concrete trigger occurs
---
```

`skill-release.json` is required in the skill directory:

```json
{
  "schemaVersion": 1,
  "skillId": "lowercase-hyphenated-name",
  "channel": "development",
  "version": "0.1.0-dev.0",
  "source": {
    "repository": "https://github.com/owner/repo"
  },
  "updateManifestUrl": "https://owner.github.io/repo/skill-updates/lowercase-hyphenated-name/stable.json"
}
```

Required checks:

- `name` is unique, stable, and matches the skill directory and `skillId`.
- `description` explains capability and activation conditions, not the full workflow.
- `skill-release.json` uses exact keys, SemVer `version`, and `channel` consistent with prerelease.
- If `package.json` exists and declares `version`, it matches `skill-release.json`.
- Body instructions are self-contained and ordered.
- Relative links resolve from the skill directory.
- Commands use tools available in the target environment or state prerequisites.
- Failure paths preserve data and report exact errors.
- No test files, fixtures, generated output, secrets, or absolute local paths ship.

Run `node scripts/validate-skill.mjs <skill-dir>` before release. `npx skills` installation proves discovery and packaging only. It does not prove instruction quality, agent compliance, or runtime correctness of referenced commands.
