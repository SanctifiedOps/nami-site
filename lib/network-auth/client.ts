"use client";

import { createAuthClient } from "better-auth/react";

export const networkAuthClient = createAuthClient({
  basePath: "/api/network/auth",
});
