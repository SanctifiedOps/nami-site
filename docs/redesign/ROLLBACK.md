# Premium redesign rollback record

Created: 6 October 2026

## Frozen baseline

- Commit: `74687fcb63a3da7d62b53d665c43074ce39c0373`
- Branch: `archive/pre-premium-redesign-2026-10-06`
- Tag: `pre-premium-redesign-2026-10-06`
- Redesign branch: `design/premium-overhaul-2026-10-06`

The baseline points to the complete site source immediately before the premium design overhaul began. It includes the previously completed code changes on `main`. It does not deploy anything and it does not modify production data.

## Safe return procedure

To inspect the original source without changing the redesign branch:

```powershell
git switch archive/pre-premium-redesign-2026-10-06
```

To return to the redesign:

```powershell
git switch design/premium-overhaul-2026-10-06
```

Do not force-reset a working branch while it contains uncommitted work. Commit or safely stash the work first.

## Deployment rule

The redesign remains local until Joe explicitly approves a staging deployment. A production deployment requires a separate explicit approval after staging review.
