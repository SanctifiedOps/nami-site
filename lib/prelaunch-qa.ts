// A narrow staging-only exception for controlled launch tests.
// Production never accepts this token; normal staging requests remain on hold.
export function externalIntegrationsAllowed(
  env: Record<string, string | undefined>,
  request: Request,
  email: string,
): boolean {
  if (!env.APP_ENV || env.EXTERNAL_INTEGRATIONS_MODE === "live") return true;
  if (env.APP_ENV !== "staging" || !env.PRELAUNCH_QA_TOKEN) return false;
  const token = request.headers.get("x-nami-launch-qa-token");
  const testRecipient = /^launch-qa(?:\+[a-z0-9-]+)?@example\.invalid$/i.test(email)
    || /^hello\+launch-qa(?:-[a-z0-9-]+)?@namicreative\.co\.uk$/i.test(email);
  return Boolean(token && token === env.PRELAUNCH_QA_TOKEN && testRecipient);
}
