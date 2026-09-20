# Release boundary

The installable skill directory is the product boundary for `npx skills`.

## Must include

- `SKILL.md`
- `skill-release.json`
- Any `references/`, `scripts/`, or `assets/` linked from the skill
- `LICENSE` when the skill is redistributed on its own

## Optional

- `package.json` when the skill has a Node CLI, runtime dependencies, or shared npm version identity
- Extra runtime files the instructions actually invoke (schemas, binaries, templates)

## Must exclude

- `test/`, `tests/`, fixtures
- `node_modules/`, `package-lock.json`
- Repository docs sites, research notes, and RFCs
- Secrets, `.env`, credentials
- Generated build output not required at runtime
- Machine-specific absolute paths embedded in text files

Validate the boundary with:

```bash
node scripts/validate-skill.mjs /path/to/skill-name
```

Keep repository-side tests and packaging helpers outside the skill directory so installers never receive them.
