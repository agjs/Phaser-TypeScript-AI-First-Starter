---
description: Run pnpm check and summarize any failures
---

Run `pnpm check` and report the result:

- If it passes: say "check: green" and stop.
- If it fails: show the first failing step and the first 20 lines of its output, then stop. Do not attempt fixes unless I ask.
