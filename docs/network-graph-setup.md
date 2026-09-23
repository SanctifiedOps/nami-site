# NAMI Network account email: Microsoft Graph

The member site uses Microsoft Graph for account invitations and password-reset messages from `hello@namicreative.co.uk`. Make and Mailchimp remain separate. Do not use the earlier profile-picture campaign as an account-security mailer.

## Microsoft 365 setup

1. In the NAMI Microsoft Entra tenant, register a dedicated single-tenant application for NAMI Network account email. Record its tenant ID and application (client) ID.
2. Do not grant Microsoft Graph `Mail.Send` application permission in Entra. An Entra grant is tenant-wide and is additive to any Exchange RBAC grant, so an Exchange scope would not narrow it.
3. In Exchange Online Application RBAC, assign the `Application Mail.Send` role to the app with a resource scope containing only `hello@namicreative.co.uk`. Confirm that `hello@` is in scope and another mailbox is out of scope. Also confirm the app has no unscoped Entra `Mail.Send` grant.
4. Create a client credential for the app. Store it only as a Cloudflare Worker secret. Record its expiry and rotation owner. Do not commit it or paste it into a ticket.
5. Set `MS_GRAPH_TENANT_ID`, `MS_GRAPH_CLIENT_ID` and `MS_GRAPH_CLIENT_SECRET` on the staging Worker first, then on the production Worker once the scope is verified. Keep `OUTBOUND_EMAIL_MODE=hold` and `OUTBOUND_EMAIL_RETRY_MODE=hold` in both environments. Staging allows delivery only to addresses listed in `OUTBOUND_EMAIL_ALLOWED_RECIPIENTS`.
6. Run `node scripts/check-network-graph.mjs` with those three variables supplied securely in the local process environment. The check requests a token and validates its tenant and app. It does not send mail or prove the Exchange mailbox restriction. It rejects an unscoped Entra `Mail.Send` role.
7. Confirm the mailbox restriction separately. Only after that confirmation, set `MS_GRAPH_MAILBOX_SCOPE_VERIFIED=true` in staging and conduct a single staging invitation and password-reset delivery test to `hello@namicreative.co.uk` only. Inspect the received message and link before changing the production outbound hold. Set the same flag in production only after its app and scope have been checked.

The Worker uses `POST /v1.0/users/hello@namicreative.co.uk/sendMail`. Graph's `202 Accepted` means Microsoft accepted the request for processing; it does not guarantee delivery. Inspect the mailbox and `email_jobs` after the test. Never release held member emails as a bulk job without a separate review.

## Launch gate

Do not set production `OUTBOUND_EMAIL_MODE=live` until the mailbox scope, Turnstile, owner approval flow, password reset, and email retry behaviour have all passed a test-account run. Keep `OUTBOUND_EMAIL_RETRY_MODE=hold` until failed jobs have been reviewed separately. Held `pending` jobs are never automatically released. Do not send invitations to the existing member list as part of the domain cutover.
