# NAMI Post Ideas trigger

This Cloudflare Worker starts the morning briefing while Joe's computer is off.

## Behaviour

- Cloudflare calls it at 08:00 and 09:00 UTC.
- The Worker checks `Europe/London` and continues only when the local time is 09:00. This handles GMT and BST automatically.
- It sends a dated, idempotent run ID to Make.
- Cloudflare KV suppresses retries for the same London calendar date.
- `GET /health` provides a safe status check.
- `POST /run` supports a protected manual test.
- `TEST_MODE` remains `true` until the trial emails have been approved.

The run guard is retained for 48 hours. If Make rejects the webhook, the guard is removed so Cloudflare can retry safely.

## Required secrets

Set these through Wrangler and never commit them:

- `MAKE_WEBHOOK_URL`
- `TRIGGER_SECRET`

## Release order

1. Create the Make webhook and its duplicate-run guard.
2. Set both Worker secrets.
3. Run `npm test` and `npm run check`.
4. Deploy the Worker.
5. Use the protected `/run` route for a Joe-only end-to-end test.
6. Keep test mode enabled for three scheduled mornings before switching it off.

The Worker only starts the job. It never publishes social posts.
