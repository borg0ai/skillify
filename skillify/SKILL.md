---
name: skillify
description: Create, review, and validate reusable Agent Skills for npx skills using Archify-style layout, required skill-release.json identity, optional package.json, and a local validate-skill gate. Use when packaging or publishing a skill repository, fixing SKILL.md frontmatter, checking release-safe contents, or aligning a skill with npx skills discovery.
license: MIT
metadata:
  version: "0.1"
---

# Skillify

Create small, discoverable Agent Skills that install cleanly through `npx skills`.

## Core rule

The skill is the product. Keep its directory self-contained, its trigger precise, and its instructions executable. Do not ship tests, fixtures, source repositories, dependency directories, generated output, credentials, or unrelated project files.

## Repository layout

Use this Archify-style layout when a repository publishes one skill:

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
  docs/
  test/
```

`SKILL.md` and `skill-release.json` are required inside the skill directory. `package.json` is optional and decided by the skill repository (add it when the skill has a Node CLI, runtime dependencies, or needs npm version identity). Read [repository-layout.md](references/repository-layout.md) and [release-boundary.md](references/release-boundary.md) when choosing what ships.

For multiple skills, use `skills/<skill-name>/SKILL.md`. Keep each skill's references, scripts, assets, and `skill-release.json` inside its own directory.

## Build a skill project

When the user asks to create a skill project, build one complete directory before adding optional files:

1. Choose one reusable capability and a lowercase hyphenated directory name.
2. Create `<skill-name>/SKILL.md` with frontmatter whose `name` equals the directory name and whose `description` states capability plus a concrete `Use when ...` trigger.
3. Create `<skill-name>/skill-release.json` with exact release keys. Use a stable version such as `0.1.0` with `channel: "stable"`, or a prerelease such as `0.1.0-dev.0` with `channel: "development"`.
4. Add `<skill-name>/LICENSE`; add `references/`, `scripts/`, or `assets/` only when the skill instructions use them.
5. Keep tests, fixtures, package-manager files, and repository documentation outside `<skill-name>/` unless runtime instructions require them.
6. Run `node skillify/scripts/validate-skill.mjs <skill-name>` from the repository root, then run `npx skills add . --list` to verify discovery.
7. Read every linked reference and execute every documented command that is safe to verify. Report failures verbatim; do not claim agent behavior from packaging checks alone.

For a skill project with a Node runtime, put `package.json` inside `<skill-name>/` only when the installed skill needs it. Match its `version` to `skill-release.json`; otherwise keep package metadata at repository root for repository tests and tooling.

## Authoring workflow

1. State one reusable capability. Reject project-specific history and one-off fixes.
2. Name it with lowercase letters, numbers, and hyphens. Keep name and directory aligned.
3. Write frontmatter with useful `name` and `description` fields. Describe capability and triggers (include `Use when...`); do not dump the full workflow into `description`.
4. Add `skill-release.json` with release identity (`schemaVersion`, `skillId`, `channel`, `version`, `source`, `updateManifestUrl`).
5. Put activation signals first. Explain when to use and when not to use.
6. Write short ordered actions. Each action must be executable without hidden assumptions.
7. Keep small patterns inline. Move heavy reference material to `references/`; move reusable executable logic to `scripts/`.
8. Preserve user intent, existing project conventions, and safe failure behavior. Never invent files, commands, APIs, or verification results.
9. Remove every test, fixture, build artifact, dependency directory, secret, and unrelated document from the release directory.

## Validation gate

Before release, validate the skill directory:

```bash
node scripts/validate-skill.mjs /path/to/skill-name
```

Then inspect the package as an installer would:

```bash
npx skills add . --list
npx skills add . --skill skill-name --agent codex --copy --yes
```

Then verify:

- exactly one intended `SKILL.md` exists for a single-skill package;
- frontmatter parses and contains valid `name` and `description`;
- skill name matches directory name and `skill-release.json` `skillId`;
- every linked reference, script, and asset exists inside the skill directory;
- no `test/`, `tests/`, fixtures, `node_modules/`, build output, or secrets ship;
- README install command points at the real repository and skill name;
- package contains no machine-specific absolute path.

Read [skill-contract.md](references/skill-contract.md) for the compact contract. Report command output truthfully; a successful file copy is not proof that an agent follows the instructions.

## Common failures

- Vague description: agent never activates. Add concrete user intent, symptom, and tool terms.
- Workflow in description: agent skips body. Keep description trigger-oriented, not a full runbook.
- Missing `skill-release.json`: release identity is undefined. Add the required contract file.
- Giant `SKILL.md`: context cost grows and instructions blur. Split heavy material into references.
- Hidden dependency: installed skill breaks outside source repo. Make references and scripts relative to skill directory.
- Duplicate names: selector becomes ambiguous. Keep one canonical name and path.
- Tests in package: installer receives unrelated weight and files. Test outside release tree; validate package contents directly.
