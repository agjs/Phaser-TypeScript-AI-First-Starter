# Claude Code Instructions

This is a Phaser + TypeScript game built on an AI-first architecture. Before doing anything, read:

- `docs/ai/architecture.md` — layer diagram and import rules
- `docs/ai/contribution-contract.md` — ten non-negotiable rules
- `docs/ai/catalog.md` — the canonical index of everything in the codebase

## The golden rule

One obvious home per concern. Do not place domain logic in Phaser scenes. Do not import `phaser` from `src/domain/**`.

## Before writing code, check if a generator exists

Always use generators instead of hand-writing boilerplate — they save tokens and keep patterns consistent.

| Intent                 | Command                       |
| ---------------------- | ----------------------------- |
| New domain module      | `pnpm new:module <Name>`      |
| New Phaser scene       | `pnpm new:scene <Name>`       |
| New feature            | `pnpm new:feature <Name>`     |
| New port + fake        | `pnpm new:port <Name>`        |
| New content schema     | `pnpm new:content <Name>`     |
| New ADR                | `pnpm new:adr "<Title>"`      |
| Refresh catalog        | `pnpm catalog`                |

## Quick reference: where does X go?

| Kind of logic                    | Goes here                               |
| -------------------------------- | --------------------------------------- |
| Game rules, state transitions    | `src/domain/<module>/*.behavior.ts`     |
| Feature orchestration            | `src/features/<feature>/*Feature.ts`    |
| Phaser scenes                    | `src/runtime/phaser/scenes/<Scene>/`    |
| Port interfaces                  | `src/shared/types/ports.ts`             |
| Port implementations             | `src/runtime/adapters/`                 |
| Enemy/item definitions           | `src/content/definitions/<kind>/`       |

## Before claiming done

```sh
pnpm check
```

Must pass. If a hook fails, fix the root cause — do not bypass with `--no-verify`.

## The catalog

`docs/ai/catalog.md` is the canonical index of domain modules, features, scenes, ports, and content. Read it **before** searching the codebase. Regenerate with `pnpm catalog` if stale.

## Contributing new patterns

If you want to break a rule, write an ADR with `pnpm new:adr "<Title>"` first. Architectural decisions must be recorded, not argued per-session.
