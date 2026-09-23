import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/network-db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "sqlite",
});
