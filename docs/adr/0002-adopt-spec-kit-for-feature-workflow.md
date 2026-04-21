# 0002. Adopt GitHub Spec Kit for the feature workflow

Date: 2026-04-21
Status: accepted

## Context

We already have a strong AI-first scaffolding foundation (strict TS,
architectural lint rules, generators, docs/ai/*, ADRs). What's missing is a
structured, step-by-step workflow for *turning a feature idea into code* that
stays aligned with `docs/ai/architecture.md` and `docs/ai/contribution-contract.md`.

Without one, every feature session re-invents the workflow: sometimes the spec
is in a PR description, sometimes in a chat scrollback, sometimes nowhere. The
plan is sometimes written, sometimes skipped. Tasks sometimes exist as a todo
list, sometimes only in the AI's head. The result is uneven review quality and
drift from architectural rules.

Spec-driven development tools solve this by imposing a fixed sequence:
specify → clarify → plan → tasks → analyze → implement. Each step produces a
durable artifact that survives the session.

## Decision

We adopt **GitHub Spec Kit** (`github/spec-kit`) as the canonical feature
workflow.

Scope of the adoption:

1. Commands installed under `.claude/commands/speckit/` (namespaced to avoid
   colliding with our project commands like `/check`, `/new-module`): `/speckit:specify`,
   `/speckit:clarify`, `/speckit:plan`, `/speckit:tasks`, `/speckit:analyze`,
   `/speckit:implement`, `/speckit:checklist`, `/speckit:constitution`.
2. Templates and helper scripts in `.specify/`, following spec-kit's conventions.
3. A project-specific constitution at `.specify/memory/constitution.md` that
   points to our existing `docs/ai/architecture.md` and
   `docs/ai/contribution-contract.md` so spec-kit commands enforce the same
   rules the rest of the scaffold enforces.
4. Generated specifications live at `docs/specs/<NNN-feature-name>/` — checked
   into git, not ignored. Spec history is a first-class artifact.

Installation method: **manual copy** from the upstream repo (fetched via `gh api`).
The canonical install path is `uvx specify init --ai claude`, which requires
`uv`. We did not want to add `uv` as a precondition for forking this template,
so we copied the files directly. See `.specify/README.md` for the upgrade
procedure.

## Consequences

Easier:
- Every feature has a spec, plan, tasks, and implementation trail that lives in
  the repo, not in chat history.
- The constitution is the single source of truth; spec-kit commands reject
  specs/plans/tasks that violate architectural rules.
- AI agents follow the same workflow across sessions — no more "wait, did we
  write a plan for this?"
- Code review can point at concrete artifacts ("this task doesn't match task
  #3 in tasks.md").

Harder:
- One more workflow for contributors to learn. Mitigated by the dedicated
  slash commands and the `/speckit:*` namespace.
- Manual upgrades when spec-kit evolves. Mitigated by the documented upgrade
  recipe in `.specify/README.md` and by the fact that spec-kit is stable enough
  that upgrades should be rare.

## Alternatives considered

- **Kiro** — rejected. Tighter IDE coupling and less mature slash-command integration
  with Claude Code.
- **Cursor rules / `.cursorrules`** — rejected. Rule-based, not workflow-based;
  does not give you the spec → plan → tasks → implement pipeline.
- **Custom `docs/specs/` workflow built from our existing `.claude/commands/` and
  ADR infrastructure** — rejected. Reinventing a solved problem; spec-kit already
  handles artifact layout, cross-linking, and constitution enforcement.
- **Skip spec-driven development entirely** — rejected. The whole point of this
  template is AI-first discipline; a feature workflow is a missing piece.
