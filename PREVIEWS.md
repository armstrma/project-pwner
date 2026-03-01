# Preview & Thread Updates

This project is set up for preview/status updates via:

- GitHub Actions workflow: `.github/workflows/preview.yml`
- Discord webhook posting into the orchestrator thread

## What it does

On each PR update (`opened`, `synchronize`, `reopened`) or manual run:

1. Installs dependencies
2. Attempts Vercel preview deploy from `apps/web`
3. Posts a status message to Discord thread:
   - 🟢 preview URL (success)
   - 🟡 skipped (missing deploy secrets)
   - 🔴 failed (deploy attempt failed)

## Required GitHub Secrets

In the repo settings, add:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `DISCORD_WEBHOOK_URL`
- `DISCORD_THREAD_ID` (optional if webhook is already thread-scoped)

## Notes

- Posting is best-effort and will not fail the workflow.
- Until `apps/web` is a real Next.js app, deploy may fail; thread updates still include workflow links for visibility.
