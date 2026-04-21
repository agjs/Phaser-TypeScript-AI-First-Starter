# Contributing

Thanks for considering a contribution. This template is intentionally opinionated — the rules exist so AI agents can work on the codebase safely, and they apply to humans the same way.

> **Read [`BUILD_THE_GAME.md`](./BUILD_THE_GAME.md) first.** It's the end-to-end walkthrough for the full workflow. This document is the short version.

## Local setup

Requirements: Node `>=22.22.0`, pnpm `>=10.30.0`. A [`.nvmrc`](./.nvmrc) pins the exact Node version if you use `nvm`/`fnm`.

```sh
pnpm install
pnpm check       # the gate
pnpm dev         # http://localhost:5173
```

If `pnpm check` isn't green on a fresh clone, that's a bug — please file an issue before changing code.

## Proposing a change

The canonical workflow is **spec-driven**, using GitHub Spec Kit:

```
/speckit:specify  →  docs/specs/<NNN>/spec.md
/speckit:clarify  →  resolve [NEEDS CLARIFICATION] markers
/speckit:plan     →  plan.md (+ research, data-model, contracts)
/speckit:tasks    →  tasks.md
/speckit:analyze  →  sanity-check the pipeline
/speckit:implement→  walk tasks one at a time
```

Commit the generated spec artifacts — they're part of the change, not scratch work.

**For trivial changes** (typo, rename, one-line fix), skip the pipeline and open a PR directly.

## Architectural rules

These are non-negotiable and enforced by lint + dep-cruiser + CI:

1. **No `phaser` imports in `src/domain/**`.** Domain is pure.
2. **No `Math.random`, `Date.now`, `new Date()`, `localStorage`, `window`, `document`, `fetch` in `src/domain/**`.** Inject a port instead.
3. **Content is schema-validated at import time.** Broken JSON fails the build.
4. **Named exports only** outside a handful of entry points.
5. **`pnpm check` must pass** before a change is considered done.

Full rules: [`docs/ai/contribution-contract.md`](./docs/ai/contribution-contract.md). Constitution (spec-kit): [`.specify/memory/constitution.md`](./.specify/memory/constitution.md).

If you need to break a rule, write an ADR first: `pnpm new:adr "<Title>"`.

## Generators

Before hand-writing anything, check if a generator exists:

| Change                       | Command                       |
| ---------------------------- | ----------------------------- |
| New domain module            | `pnpm new:module <Name>`      |
| New Phaser scene             | `pnpm new:scene <Name>`       |
| New feature                  | `pnpm new:feature <Name>`     |
| New port + fake              | `pnpm new:port <Name>`        |
| New content schema + sample  | `pnpm new:content <Name>`     |
| New ADR                      | `pnpm new:adr "<Title>"`      |
| Refresh codebase catalog     | `pnpm catalog`                |

After adding/removing modules, scenes, features, ports, or content types, run `pnpm catalog` so `docs/ai/catalog.md` stays accurate.

## Commit messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/). release-please consumes them on each push to `main`.

| Prefix     | Effect                                   |
| ---------- | ---------------------------------------- |
| `feat:`    | minor bump, listed under "Features"      |
| `fix:`     | patch bump, "Bug Fixes"                  |
| `perf:`    | patch bump, "Performance"                |
| `refactor:`, `revert:` | listed in release notes      |
| `chore:`, `docs:`, `test:`, `ci:`, `build:` | hidden (no release bump) |

Breaking change: include `!` after the type (`feat!:`) or add a `BREAKING CHANGE:` footer.

## PR checklist

Before requesting review:

- [ ] If non-trivial, `docs/specs/<NNN>/` exists with spec, plan, and tasks
- [ ] `pnpm check` passes locally
- [ ] Tests added/updated for changed domain behaviors
- [ ] `pnpm catalog` regenerated if modules/features/scenes/ports/content changed
- [ ] ADR added under `docs/adr/` if you deviated from an architectural rule
- [ ] Commit message follows Conventional Commits

CI re-runs `pnpm check` plus CodeQL, OpenSSF Scorecard, `pnpm audit`, and `arch-invariants` on every PR.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
