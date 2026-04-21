# .specify/

GitHub Spec Kit's working directory. Added manually from the upstream repo
(`github/spec-kit`) because `uv`/`uvx` isn't required to be installed.

## Layout

| Path | Purpose |
|---|---|
| `memory/constitution.md` | Authoritative project rules referenced by every spec-kit command |
| `templates/*.md` | Templates for spec, plan, tasks, constitution, checklist |
| `scripts/bash/*.sh` | Helper scripts invoked by the slash commands |

## Commands

The slash commands live in `.claude/commands/speckit/` and are invoked as
`/speckit:specify`, `/speckit:plan`, `/speckit:tasks`, etc. Their `sh:` frontmatter
has been updated to reference `.specify/scripts/bash/*` (spec-kit's CLI adds this
prefix automatically; we add it by hand).

## Updating spec-kit

Because this was installed manually, upgrades are manual too. When you want to
pick up newer spec-kit templates or commands:

```sh
gh api repos/github/spec-kit/contents/templates/commands --jq '.[].name' \
  | xargs -I{} gh api repos/github/spec-kit/contents/templates/commands/{} --jq .content \
  | base64 -d > .claude/commands/speckit/{}
```

(Or install `uv` and run `uvx specify init --ai claude --script sh --force` in
a throwaway dir and diff the output.)
