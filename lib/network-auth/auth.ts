import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { getNetworkDb, schema } from "@/lib/network-db";
import { sendNetworkEmail } from "./email";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";

export async function getNetworkAuth() {
  const db = await getNetworkDb();
  const env = await getRuntimeEnvironment();
  return betterAuth({
    appName: "NAMI Creative Network",
    baseURL: process.env.NODE_ENV === "development"
      ? `http://localhost:${process.env.PORT || "3000"}`
      : env.BETTER_AUTH_URL || env.APP_URL || "https://namicreative.co.uk",
    basePath: "/api/network/auth",
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, { provider: "sqlite", schema }),
    trustedOrigins: [
      "https://namicreative.co.uk",
      "https://www.namicreative.co.uk",
      "https://nami-creative-site-staging.workers.dev",
      "https://nami-creative-site-staging.opsanctus.workers.dev",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    emailAndPassword: {
      enabled: true,
      disableSignUp: process.env.NODE_ENV !== "development",
      minPasswordLength: 10,
      maxPasswordLength: 128,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        await sendNetworkEmail({
          recipient: user.email,
          template: "reset-password",
          subject: "Reset your NAMI Network password",
          heading: "Reset your password",
          body: "Use the button below to choose a new password for your NAMI Creative Network account. This link will expire shortly.",
          actionLabel: "Choose a new password",
          actionUrl: url,
        });
      },
      onPasswordReset: async ({ user }) => {
        await sendNetworkEmail({
          recipient: user.email,
          template: "password-changed",
          subject: "Your NAMI Network password has changed",
          heading: "Your password has been changed",
          body: "Your NAMI Creative Network password was changed successfully. If this was not you, reply to this email straight away.",
        });
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 14,
      updateAge: 60 * 60 * 24,
      cookieCache: { enabled: true, maxAge: 60 * 5 },
    },
    advanced: {
      useSecureCookies: process.env.NODE_ENV === "production",
      database: { generateId: () => crypto.randomUUID() },
    },
    rateLimit: { enabled: true, window: 60, max: 20, storage: "database" },
    plugins: [nextCookies()],
  });
}
