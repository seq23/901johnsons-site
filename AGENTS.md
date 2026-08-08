# Repo Agent Bootstrap

This repository is governed by the user's local Repo Operator system.

## Source of authority
1. Read all repo-local authority/governance/runbook/contract files before mutation; repo-local authority controls according to its hierarchy.
2. Global Repo Work OS: `~/repo-tools/reference-authorities/repo-work-os`.
3. Active tool manifest: `~/repo-tools/manifests/ACTIVE_SCRIPTS.md`.
4. Hallmark is existing authority/tooling under `~/repo-tools/reference-authorities/hallmark`; use it when substantial architecture or production-readiness review requires it. Do not recreate it.

## Terminal access
Normal work: `~/repo-tools/agent/repo-work <repo>`
Help/refresher: `~/repo-tools/agent/repo-work --help`
Supervisor: `~/repo-tools/agent/repo-supervisor --engine <codex|claude|antigravity> --repo <repo-name> --worktree <exact-worktree-path> --task-file <task-file>`
Status: `~/repo-tools/agent/repo-status`
Bake-off: `~/repo-tools/agent/repo-bakeoff --repo-path <canonical-repo-path> --baseline <SHA> --slug <task-slug> --task-file <task-file> --engines codex,claude,antigravity`

## Operating law
- Lock exact repo/worktree/branch/baseline/remote before mutation.
- Unattended mutation only on isolated `work/*` worktrees.
- Never substitute or mutate another canonical repo.
- Preserve governed full-baseline ZIP handoffs where required.
- Local updater validation + exact-SHA GitHub checks gate merge eligibility.
- RED/UNPROVEN is merge-blocked; main/default merge requires human authorization.
- Quota/rate-limit = BLOCKED/UNSCORED, not model failure.
- Route material UI/UX/design-system work through the available design workflow when useful; skip for backend-only work.
- Use existing repo tools/authority; do not create duplicate systems.
