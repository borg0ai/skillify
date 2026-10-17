<div align="center">
  <img src="assets/skillify-icon.png" width="148" height="148" alt="Colorful Skillify icon showing stacked skill cards" />
  <h1>Skillify</h1>
  <p><strong>Build Agent Skills that follow the standard.</strong></p>
  <p>
    <a href="https://github.com/borg0ai/skillify/tags"><img alt="Latest tag" src="https://img.shields.io/github/v/tag/borg0ai/skillify?label=version&color=7c5cff"></a>
    <a href="https://github.com/borg0ai/skillify/blob/main/LICENSE"><img alt="MIT license" src="https://img.shields.io/github/license/borg0ai/skillify?color=2ea97d"></a>
    <img alt="One skill" src="https://img.shields.io/badge/skills-1-18a7b5">
    <a href="https://github.com/borg0ai/skillify"><img alt="GitHub stars" src="https://img.shields.io/github/stars/borg0ai/skillify?style=social"></a>
  </p>
  <p>
    <img alt="Create" src="https://img.shields.io/badge/CREATE-7c5cff?style=for-the-badge">
    <img alt="Review" src="https://img.shields.io/badge/REVIEW-18a7b5?style=for-the-badge">
    <img alt="Validate" src="https://img.shields.io/badge/VALIDATE-2ea97d?style=for-the-badge">
    <img alt="Share" src="https://img.shields.io/badge/SHARE-ffad42?style=for-the-badge">
  </p>
</div>

Skillify helps you build skills that conform to the [Agent Skills specification](https://agentskills.io/specification). It guides the `SKILL.md` format and required metadata first, then checks Skillify's separate release-package conventions and verifies discovery with [`npx skills`](https://github.com/vercel-labs/skills).

```mermaid
flowchart LR
    A[Describe a capability] --> B[Create SKILL.md]
    B --> C[Add release metadata]
    C --> D[Validate package]
    D --> E[Discover with npx skills]
    classDef idea fill:#efeaff,stroke:#7c5cff,color:#2e235c
    classDef build fill:#e4fbf5,stroke:#18a7b5,color:#123b40
    classDef ship fill:#fff3d8,stroke:#ffad42,color:#50350e
    class A,B idea
    class C,D build
    class E ship
```

## What Skillify helps with

| | Capability | Outcome |
| --- | --- | --- |
| 🟣 | **Build to standard** | Create a skill directory with valid `SKILL.md`, required `name` and `description`, focused instructions, and optional resources. |
| 🔵 | **Review** | Find spec mismatches, vague activation, hidden dependencies, broken references, and package clutter. |
| 🟢 | **Check packaging** | Validate Skillify's extra release metadata, version/channel consistency, links, and package boundary. |
| 🟠 | **Discover** | Confirm local skills appear in the `npx skills` installer. |

### Standard vs. Skillify conventions

The [Agent Skills specification](https://agentskills.io/specification) defines the skill format: a skill directory must contain `SKILL.md`, whose YAML frontmatter requires `name` and `description`. Optional directories such as `scripts/`, `references/`, and `assets/` hold resources used by the skill.

Skillify adds repository packaging rules: `skill-release.json`, release-channel/version consistency, and a clean installable directory. These are Skillify conventions, not Agent Skills standard fields. The local validator checks Skillify's supported subset; use `skills-ref validate <skill-directory>` for specification validation when `skills-ref` is installed.

## Install

Install Skillify for Codex:

```bash
npx skills add borg0ai/skillify --skill skillify --agent codex --copy --yes
```

Or list the skills in this repository:

```bash
npx skills add borg0ai/skillify --list
```

## Use

Ask your agent to create or review a skill, for example:

```text
$skillify Create a reusable skill for reviewing PostgreSQL migrations.
```

Skillify guides the agent to follow the Agent Skills specification first, then add Skillify release metadata, keep runtime files inside the skill folder, and check the package.

## Build a skill project

Single-skill repository layout:

```text
my-skill-project/
├── my-skill/
│   ├── SKILL.md
│   ├── skill-release.json
│   ├── LICENSE
│   ├── references/       # Optional, only when instructions link to them
│   └── scripts/          # Optional, only for needed executable helpers
├── README.md
└── test/                 # Outside installable skill directory
```

For multiple skills, place each package under `skills/<skill-name>/`. Keep tests, fixtures, dependency directories, build output, and repository-only docs outside every installable skill directory.

## Validate locally

Requirements: Node.js and pnpm.

```bash
pnpm install
pnpm check
npx skills add . --list
```

`pnpm check` runs the test suite and Skillify's package validator. For specification validation, run `skills-ref validate skillify` when `skills-ref` is installed. `npx skills add . --list` confirms installer discovery; it does not prove every agent will follow a skill's instructions correctly.

## Skill in this repository

[`skillify`](skillify/SKILL.md) helps create, review, and validate reusable Agent Skills.

## License

MIT. See [`LICENSE`](LICENSE).
