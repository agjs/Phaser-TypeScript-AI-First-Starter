# Phaser + TypeScript AI-First Starter

A reusable, strictly-typed, architecturally-enforced starter template for Phaser games. Designed so AI agents can contribute at high velocity without eroding structure.

> This repository is intended to be used as a GitHub **template**. Click **"Use this template"** on the GitHub page to fork it into a new repo for each game.

## Stack

- **Phaser 4** — rendering and input
- **TypeScript 6** — strict mode, `verbatimModuleSyntax`, `noUncheckedIndexedAccess`
- **Vite 8** — dev server and bundler
- **Vitest 4** — unit and integration tests
- **ESLint 10 (flat) + eslint-plugin-boundaries** — architectural boundary enforcement
- **dependency-cruiser** — second line of boundary defense
- **Playwright** — browser smoke tests
- **Zod** — schema-validated content
- **husky + lint-staged** — pre-commit gate

## Quickstart

```sh
pnpm install
pnpm dev            # http://localhost:5173
```

Use arrow keys (or WASD) to move. Walk onto the yellow circles to score. Press **S** to save, **R** to reset.

## Architecture

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

See `docs/ai/architecture.md` for the full story.

## Scripts

| Script               | What it does                                                        |
| -------------------- | ------------------------------------------------------------------- |
| `pnpm dev`           | Start Vite dev server                                               |
| `pnpm build`         | Typecheck, then production build                                    |
| `pnpm test`          | Run Vitest unit + integration tests                                 |
| `pnpm test:smoke`    | Run Playwright smoke tests against a built bundle                   |
| `pnpm check`         | **The gate**: typecheck + lint + format + dep-cruise + test         |
| `pnpm check:arch`    | Just architectural checks (lint boundaries + dep-cruiser)           |
| `pnpm catalog`       | Regenerate `docs/ai/catalog.md` from the current source tree        |

### Generators

| Script                          | Generates                                               |
| ------------------------------- | ------------------------------------------------------- |
| `pnpm new:module <Name>`        | A new domain module under `src/domain/<name>/`          |
| `pnpm new:scene <Name>`         | A new Phaser scene                                      |
| `pnpm new:feature <Name>`       | A feature orchestrator + test                           |
| `pnpm new:port <Name>`          | A port interface stub + matching fake                   |
| `pnpm new:content <Name>`       | A Zod schema + sample JSON + validated loader           |
| `pnpm new:adr "<Title>"`        | A numbered ADR in `docs/adr/`                           |

## AI contributors

Read these first:

- `CLAUDE.md` / `AGENTS.md` — the quick entry point
- `docs/ai/architecture.md` — layer rules
- `docs/ai/contribution-contract.md` — ten non-negotiable rules
- `docs/ai/catalog.md` — what exists and where

## License

MIT — see `LICENSE`.
