import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// Next.js loads .env.local for the app; drizzle-kit doesn't, so load it here.
// Real environment variables still win (loadEnvFile doesn't override them).
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

// `pnpm db:generate` needs no database. `pnpm db:migrate` reads DATABASE_URL.
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
  strict: true,
  verbose: true,
});
