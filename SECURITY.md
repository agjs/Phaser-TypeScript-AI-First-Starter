# Security Policy

## Reporting a vulnerability

**Please do not file public issues for security vulnerabilities.**

Use GitHub's private vulnerability reporting:

1. Go to the **Security** tab of this repository.
2. Click **Report a vulnerability**.
3. Fill in the form with reproduction steps.

Reports are handled on a best-effort basis. This is a starter template, not a production service — expect human-scale response times, not SLA-backed ones.

## Scope

**In scope:**

- Code in this repository (`src/`, `scripts/`, `tests/`, configs, workflows)
- Examples and default configurations that could mislead forks into insecure setups

**Out of scope (report upstream):**

- [Phaser](https://github.com/phaserjs/phaser) — report to the Phaser team
- Node.js, pnpm, Vite, Vitest, ESLint, TypeScript, Zod, Playwright, and other transitive dependencies — report upstream
- Vulnerabilities that require you to have already compromised the developer's machine
- Social engineering of forks

## Supply-chain hygiene

This template ships with:

- Pinned exact versions in `package.json` (no `^` or `~`)
- `pnpm audit --prod --audit-level=high` in CI (fails PRs with known high-severity CVEs in production deps)
- OpenSSF Scorecard workflow (SARIF uploaded to the GitHub security tab)
- CodeQL with `security-and-quality` queries
- Dependabot weekly updates

If you fork this template and remove any of these, you're opting out of the baseline we ship with.

## Disclosure

When a vulnerability is confirmed and fixed, the fix will be released with a `fix!:` or `feat!:` conventional-commit prefix (to trigger a release via release-please) and a `SECURITY` section in the release notes describing the issue and remediation.

Thank you for helping keep the template safe for everyone who forks it.
