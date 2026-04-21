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

The cleanest upgrade path uses the official CLI via `uv`:

```sh
# One-time setup (already done if you're reading this on the machine that set up the repo):
curl -LsSf https://astral.sh/uv/install.sh | sh
uv tool install git+https://github.com/github/spec-kit.git

# To pick up new spec-kit templates/commands:
specify init /tmp/spec-kit-fresh --ai claude --script sh --ignore-agent-tools
diff -ru /tmp/spec-kit-fresh/.specify .specify
diff -ru /tmp/spec-kit-fresh/.claude/commands .claude/commands/speckit
# Cherry-pick the diffs you want; apply with cp.
```

Fallback (no `uv`, via `gh` CLI):

```sh
# Re-fetch commands
for f in specify plan tasks implement clarify constitution analyze checklist; do
  gh api repos/github/spec-kit/contents/templates/commands/$f.md --jq .content \
    | base64 -d > .claude/commands/speckit/$f.md
done
# Re-fetch templates and scripts similarly from repos/github/spec-kit/contents/templates/
# and repos/github/spec-kit/contents/scripts/bash/
```

Note: after any upgrade, re-apply the `sh: scripts/bash/` → `sh: .specify/scripts/bash/`
path fix if you used the `gh` fallback (the `specify init` CLI handles this automatically).
