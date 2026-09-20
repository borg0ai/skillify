# RFC 0001: Skillify skill validation and Archify-aligned layout

**Status:** Implemented

## Summary

Align Skillify with Archify's `npx skills` packaging layout and ship a Node validator that checks a skill directory for installable `SKILL.md`, required `skill-release.json`, optional `package.json`, relative reference integrity, and release-boundary pollution.

## Problem

Skillify currently documents a layout that places `package.json` and `skill-release.json` at the repository root. Archify — the reference product for this organization — keeps both inside the skill directory (`archify/`), requires `skill-release.json` for release identity, treats `package.json` as a product/runtime concern, and stages a clean skill tree for install. Without a local validator, agents and authors cannot gate a skill the same way Archify gates packaging.

## Goals

- Document the Archify-style single-skill layout: `skill-name/{SKILL.md,skill-release.json,...}` with repo-side docs/tests outside the skill.
- Require `skill-release.json` in every published skill directory; keep `package.json` optional and decided by the skill repo.
- Ship `scripts/validate-skill.mjs` inside the skillify skill so agents can validate any skill directory.
- Validate Skillify itself with that script (dogfood).
- Keep tests and fixtures outside the installable skill tree.

## Non-goals

- Copying Archify's update notifier, staging zip pipeline, or GitHub Pages manifest publication machinery.
- Requiring `package.json` for instruction-only skills.
- Proving that an agent will follow skill instructions (installation success ≠ instruction quality).
- Multi-skill catalog tooling beyond documenting `skills/<name>/` as an alternate layout.

## Design

### Canonical layout

```text
repository/
  skill-name/
    SKILL.md              # required
    skill-release.json    # required
    LICENSE               # recommended when the skill ships alone
    package.json          # optional: Node CLI, deps, or version identity
    references/
    scripts/
    assets/
  README.md
  LICENSE
  docs/ test/ scripts/    # repository-side; not part of the skill package
```

### `skill-release.json` contract

Exact keys: `schemaVersion`, `skillId`, `channel`, `version`, `source`, `updateManifestUrl`.

- `schemaVersion` must be `1`.
- `skillId` must equal the skill directory name and `SKILL.md` frontmatter `name`.
- `version` must be SemVer; `channel` must be `stable` or `development` and match prerelease presence (`*-dev.*` / any prerelease → `development`, else `stable`).
- `source` must be exactly `{ "repository": "https://..." }`.
- `updateManifestUrl` must be an `https://` absolute URL.
- If `package.json` exists and declares `version`, it must match `skill-release.json` `version`.

### Validator

Entry: `skillify/scripts/validate-skill.mjs`.

```bash
node scripts/validate-skill.mjs [path-to-skill-dir]
```

Pure helpers under `skillify/scripts/lib/` cover skill-release parsing, SKILL.md frontmatter, relative markdown links, and release-boundary denylist (`test/`, `tests/`, `node_modules/`, `.env`, fixtures). Exit `0` on success; exit `1` with one error per line on failure.

### Skillify self-package

- Add `skillify/skill-release.json` for `borg0ai/skillify`.
- Copy `LICENSE` into `skillify/`.
- Remove repository-root `package.json` (no Node runtime product at root).
- Update `SKILL.md`, `references/*`, and `README.md` to match this RFC.
- Add repository-side `test/validate-skill.test.mjs` using `node --test`.

## Delivery

1. Create this RFC via `specify deliver` and fill sections.
2. Implement validator modules, CLI, docs, self `skill-release.json`, and tests.
3. Run validator against `skillify/` and the test suite.
4. Advance RFC to Implemented and archive when acceptance passes.

## Acceptance

- `node skillify/scripts/validate-skill.mjs skillify` exits 0.
- `node --test test/validate-skill.test.mjs` exits 0 and covers pass, missing release file, channel/version mismatch, and name/directory mismatch.
- Published skill docs state `skill-release.json` required and `package.json` optional.
- Layout docs place identity files inside `skill-name/`, not at repo root.
- `npx skills add ./skillify --list` still discovers skill `skillify`.
