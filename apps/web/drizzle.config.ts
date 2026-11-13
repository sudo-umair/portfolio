import { defineConfig } from "drizzle-kit";

// `pnpm db:generate` needs no database. `pnpm db:migrate` reads DATABASE_URL.
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
  strict: true,
  verbose: true,
});
