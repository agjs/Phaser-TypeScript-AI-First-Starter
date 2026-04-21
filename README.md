<p align="center">
  <img src="./public/assets/images/phaserjs-logo.png" alt="Phaser" width="480">
</p>

<p align="center">
  <a href="https://github.com/agjs/Phaser-TypeScript-AI-First-Starter/actions/workflows/ci.yml"><img src="https://github.com/agjs/Phaser-TypeScript-AI-First-Starter/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/agjs/Phaser-TypeScript-AI-First-Starter/actions/workflows/codeql.yml"><img src="https://github.com/agjs/Phaser-TypeScript-AI-First-Starter/actions/workflows/codeql.yml/badge.svg" alt="CodeQL"></a>
  <a href="https://scorecard.dev/viewer/?uri=github.com/agjs/Phaser-TypeScript-AI-First-Starter"><img src="https://api.securityscorecards.dev/projects/github.com/agjs/Phaser-TypeScript-AI-First-Starter/badge" alt="OpenSSF Scorecard"></a>
  <img src="https://img.shields.io/badge/Phaser-4.0-blue?logo=phaser" alt="Phaser 4">
  <img src="https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript" alt="TypeScript 6">
  <img src="https://img.shields.io/badge/Node-%3E%3D22.22-339933?logo=node.js" alt="Node">
  <img src="https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm" alt="pnpm">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT">
</p>

# Phaser + TypeScript AI-First Starter

A reusable, strictly-typed, architecturally-enforced starter for Phaser games — built so AI agents can contribute at high velocity without eroding structure, and so **a programmer who has never shipped a game can become a one-person game studio in a single weekend.**

Backend engineer, tech lead, web developer who always wanted to make games but never had the time? Start with [`docs/learn/`](./docs/learn/README.md) — a 2.5-hour primer that bridges the gap between "I can write code" and "I know how to use AI to generate art, design a core loop, and ship a playable game on itch.io."

> **Use this as a GitHub template.** Click **"Use this template"** on the repo page, fork it into a new repo for each game, then read [`BUILD_THE_GAME.md`](./BUILD_THE_GAME.md) to walk from empty fork to shipped feature.

### After forking: one-time repo setup

1. **Enable GitHub Pages** — `Settings → Pages → Build and deployment → Source: "GitHub Actions"`. Without this the `deploy-pages` workflow 404s on the first run.
2. **Allow Actions to open PRs** (so release-please can cut release PRs) — `Settings → Actions → General → Workflow permissions → [x] Allow GitHub Actions to create and approve pull requests`.
3. **Flip "Template repository"** — `Settings → General → Template repository` so your own "Use this template" button works.

Everything else (CI, Scorecard, CodeQL, Dependabot) works out of the box.

## What you get out of the box

- **Working vertical slice** — one player, three pickups, live HUD, save/load to localStorage. Proves the architecture end-to-end and serves as the pattern to mimic.
- **Architectural boundaries enforced by two independent tools** — `eslint-plugin-boundaries` in the editor/PR, `dependency-cruiser` as belt-and-braces in CI. Try importing `phaser` from `src/domain/**` and watch both reject it.
- **Seven code generators** (`pnpm new:module|scene|feature|port|content|adr`) so AI agents scaffold boilerplate in ~200 tokens instead of 500–800.
- **Spec-driven feature workflow** via GitHub Spec Kit (`/speckit:specify → :clarify → :plan → :tasks → :analyze → :implement`) with a project constitution pointing at your architectural rules.
- **Canonical AI-facing docs** (`CLAUDE.md`, `AGENTS.md`, `docs/ai/*`) so every fresh session starts with the same context without token-heavy onboarding.
- **CI that enforces it all** — typecheck, lint (flat config), dep-cruise, tests, CodeQL, OpenSSF Scorecard, `pnpm audit`, plus a grep-based invariants job that triple-checks the rails.
- **Release & dep automation** — release-please for semantic versioning from conventional commits; Dependabot for grouped weekly updates.

## Start here

| If you are...                               | Read next                                                       |
| ------------------------------------------- | --------------------------------------------------------------- |
| **A programmer who never shipped a game**   | [`docs/learn/`](./docs/learn/README.md) — 2.5-hour primer on game dev, AI asset generation, game design, and solo workflow |
| **A human forking this to build a game**    | [`BUILD_THE_GAME.md`](./BUILD_THE_GAME.md) — the full walkthrough |
| **An AI agent in a fresh session**          | [`CLAUDE.md`](./CLAUDE.md) / [`AGENTS.md`](./AGENTS.md) + [`docs/ai/catalog.md`](./docs/ai/catalog.md) |
| **Just evaluating the architecture**        | [`docs/ai/architecture.md`](./docs/ai/architecture.md) + this README |
| **Looking for the rules**                   | [`docs/ai/contribution-contract.md`](./docs/ai/contribution-contract.md) + [`.specify/memory/constitution.md`](./.specify/memory/constitution.md) |

## Quickstart

```sh
pnpm install
pnpm dev            # http://localhost:5173
```

Arrow keys or WASD to move. Walk onto a yellow circle to score. Press **S** to save, **R** to reset.

## Architecture in 30 seconds

```
                 +--------+
                 |  app   |   composition root
                 +--------+
                     |
      +-----------+--+--+-----------+
      |           |     |           |
  +--------+  +--------+  +---------+
  | domain |  |content |  | shared  |   pure + data + common types
  +--------+  +--------+  +---------+
                     |
                 +--------+
                 |runtime |   Phaser, browser APIs
                 +--------+
```

| Layer      | Responsibility                                                      |
| ---------- | ------------------------------------------------------------------- |
| `domain`   | Pure state + behaviors. No engine. No wall-clock. No storage.       |
| `features` | Orchestrate domain + ports. Emit events.                            |
| `runtime`  | Phaser scenes, entities, input, audio, adapters for shared ports.   |
| `content`  | Zod-validated definitions, levels, balance.                         |
| `shared`   | Leaf utilities — types, event bus, test fakes.                      |
| `app`      | Composition root. Wires everything for the web entrypoint.          |

Full story: [`docs/ai/architecture.md`](./docs/ai/architecture.md).

## Stack

Phaser 4 · TypeScript 6 (strict + `verbatimModuleSyntax` + `noUncheckedIndexedAccess`) · Vite 8 · Vitest 4 · ESLint 10 (flat) · dependency-cruiser · Playwright · Zod · husky + lint-staged · pnpm 10 · Node 22 LTS.

## Scripts

| Script               | What it does                                                        |
| -------------------- | ------------------------------------------------------------------- |
| `pnpm dev`           | Start Vite dev server                                               |
| `pnpm build`         | Typecheck, then production build                                    |
| `pnpm test`          | Vitest unit + integration                                           |
| `pnpm test:smoke`    | Playwright smoke against a built bundle                             |
| `pnpm check`         | **The gate**: typecheck + lint + format + dep-cruise + test         |
| `pnpm check:arch`    | Just architectural checks (lint boundaries + dep-cruiser)           |
| `pnpm catalog`       | Regenerate [`docs/ai/catalog.md`](./docs/ai/catalog.md) from `src/` |

### Generators

| Script                          | Generates                                               |
| ------------------------------- | ------------------------------------------------------- |
| `pnpm new:module <Name>`        | Domain module under `src/domain/<name>/`                |
| `pnpm new:scene <Name>`         | Phaser scene                                            |
| `pnpm new:feature <Name>`       | Feature orchestrator + test                             |
| `pnpm new:port <Name>`          | Port interface stub + matching fake                     |
| `pnpm new:content <Name>`       | Zod schema + sample JSON + validated loader             |
| `pnpm new:adr "<Title>"`        | Numbered ADR in `docs/adr/`                             |

### Slash commands (Claude Code)

| Project commands        | Spec Kit commands (`/speckit:*`) |
| ----------------------- | ------------------------------- |
| `/check`                | `/speckit:specify`              |
| `/new-module`           | `/speckit:clarify`              |
| `/new-feature`          | `/speckit:plan`                 |
| `/new-scene`            | `/speckit:tasks`                |
| `/review-slice`         | `/speckit:analyze`              |
| `/verify-boundaries`    | `/speckit:implement`            |
|                         | `/speckit:checklist`            |
|                         | `/speckit:constitution`         |

## CI & automation

Every push/PR runs:

- **`ci`** — typecheck, lint, format, dep-cruise, tests
- **`codeql`** — static security analysis with `security-and-quality` queries
- **`security`** — `pnpm audit` on production deps + OpenSSF Scorecard (SARIF uploaded)
- **`arch-invariants`** — grep-based banned-pattern guard (phaser/Math.random/Date.now/localStorage in `src/domain`)

On push to `main`, **release-please** opens/updates a release PR using conventional commits. Merge it to tag a release. **Dependabot** opens grouped weekly PRs for npm and GitHub Actions updates.

## License

MIT — see [`LICENSE`](./LICENSE).
