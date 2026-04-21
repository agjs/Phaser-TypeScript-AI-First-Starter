# AGENTS.md

Tool-neutral AI contributor instructions. Read by Claude Code, Cursor, Copilot, Codex, and similar agents.

**This file mirrors `CLAUDE.md`.** Keep the two in sync — if you change one, change the other.

---

This is a Phaser + TypeScript game built on an AI-first architecture. Before doing anything, read:

- `docs/ai/architecture.md` — layer diagram and import rules
- `docs/ai/contribution-contract.md` — ten non-negotiable rules
- `docs/ai/catalog.md` — the canonical index of everything in the codebase

## The golden rule

One obvious home per concern. Do not place domain logic in Phaser scenes. Do not import `phaser` from `src/domain/**`.

## Before writing code, check if a generator exists

| Intent                 | Command                       |
| ---------------------- | ----------------------------- |
| New domain module      | `pnpm new:module <Name>`      |
| New Phaser scene       | `pnpm new:scene <Name>`       |
| New feature            | `pnpm new:feature <Name>`     |
| New port + fake        | `pnpm new:port <Name>`        |
| New content schema     | `pnpm new:content <Name>`     |
| New ADR                | `pnpm new:adr "<Title>"`      |
| Refresh catalog        | `pnpm catalog`                |

## Before claiming done

```sh
pnpm check
```

Must pass. Fix root causes; do not skip hooks.
