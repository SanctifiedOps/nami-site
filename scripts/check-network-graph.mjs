// Read-only Microsoft Graph credential check. This script never calls sendMail.
const tenantId = process.env.MS_GRAPH_TENANT_ID?.trim();
const clientId = process.env.MS_GRAPH_CLIENT_ID?.trim();
const clientSecret = process.env.MS_GRAPH_CLIENT_SECRET?.trim();

if (!tenantId || !clientId || !clientSecret) {
  console.error("Graph credentials are incomplete. Set MS_GRAPH_TENANT_ID, MS_GRAPH_CLIENT_ID and MS_GRAPH_CLIENT_SECRET.");
  process.exitCode = 1;
} else {
  try {
    const response = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
    });
    if (!response.ok) throw new Error(`Token request failed (${response.status}).`);
    const data = await response.json();
    if (typeof data.access_token !== "string") throw new Error("No access token was returned.");
    const payload = JSON.parse(Buffer.from(data.access_token.split(".")[1] ?? "", "base64url").toString("utf8"));
    if (Array.isArray(payload.roles) && payload.roles.includes("Mail.Send")) {
      throw new Error("The token contains an unscoped Entra Mail.Send grant. Remove it before relying on Exchange mailbox scoping.");
    }
    if (payload.tid !== tenantId || (payload.appid ?? payload.azp) !== clientId) {
      throw new Error("The token belongs to a different tenant or application.");
    }
    console.log("Graph token check passed: correct tenant and application, with no unscoped Entra Mail.Send role. No email was sent.");
    console.log("Exchange Application RBAC scope and delivery still need separate verification before outbound email is enabled.");
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Graph credential check failed.");
    process.exitCode = 1;
  }
}
