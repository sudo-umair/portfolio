import "server-only";
import { neon } from "@neondatabase/serverless";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Any Postgres-backed Drizzle database with our schema. Production uses
 * Neon over HTTP; tests pass an in-process PGlite database.
 */
export type Database = PgDatabase<PgQueryResultHKT, typeof schema>;

let db: Database | undefined;

/** Lazily connects so builds and pages that never touch the database don't need DATABASE_URL. */
export function getDb(): Database | null {
  if (db) return db;
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  db = drizzle({ client: neon(url), schema }) as unknown as Database;
  return db;
}
