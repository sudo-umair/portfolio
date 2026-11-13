import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/db";
import * as schema from "@/db/schema";
import { buildNotificationEmail, hashIp, RATE_LIMIT, saveContactMessage, setEmailStatus } from "./service";

const migrationsFolder = fileURLToPath(new URL("../../../drizzle", import.meta.url));
const input = { name: "Ada Lovelace", email: "ada@example.com", message: "Hello, I'd like to talk about a role." };

let db: Database;

// A fresh in-process Postgres per test, migrated with the real migrations.
beforeEach(async () => {
  const pglite = drizzle({ client: new PGlite(), schema });
  await migrate(pglite, { migrationsFolder });
  db = pglite as unknown as Database;
});

const save = (ipHash: string, now?: Date) => saveContactMessage(db, { input, ipHash, userAgent: "vitest", now });

describe("saveContactMessage", () => {
  it("saves the message with a pending email status", async () => {
    const result = await save("ip-a");
    expect(result.status).toBe("saved");

    const rows = await db.select().from(schema.contactMessages);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ ...input, ipHash: "ip-a", userAgent: "vitest", emailStatus: "pending" });
  });

  it(`allows ${RATE_LIMIT.max} messages per IP per hour, then refuses`, async () => {
    for (let i = 0; i < RATE_LIMIT.max; i++) expect((await save("ip-a")).status).toBe("saved");
    expect(await save("ip-a")).toEqual({ status: "rate_limited" });
    expect(await db.$count(schema.contactMessages)).toBe(RATE_LIMIT.max);
  });

  it("limits each IP separately", async () => {
    for (let i = 0; i < RATE_LIMIT.max; i++) await save("ip-a");
    expect((await save("ip-b")).status).toBe("saved");
  });

  it("lets an IP send again once old messages leave the window", async () => {
    const now = new Date("2026-11-13T12:00:00Z");
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    for (let i = 0; i < RATE_LIMIT.max; i++) await save("ip-a", twoHoursAgo);
    expect((await save("ip-a", now)).status).toBe("saved");
  });
});

describe("setEmailStatus", () => {
  it("records the notification outcome", async () => {
    const result = await save("ip-a");
    if (result.status !== "saved") throw new Error("expected a saved message");
    await setEmailStatus(db, result.id, "sent");
    const [row] = await db.select().from(schema.contactMessages);
    expect(row?.emailStatus).toBe("sent");
  });
});

describe("hashIp", () => {
  it("is stable for the same IP and salt, and differs by salt", () => {
    expect(hashIp("203.0.113.7", "salt")).toBe(hashIp("203.0.113.7", "salt"));
    expect(hashIp("203.0.113.7", "salt")).not.toBe(hashIp("203.0.113.7", "other"));
    expect(hashIp("203.0.113.7", "salt")).not.toContain("203.0.113.7");
  });
});

describe("buildNotificationEmail", () => {
  it("sets Reply-To to the sender and includes the message", () => {
    const email = buildNotificationEmail(input);
    expect(email.subject).toBe("Portfolio message from Ada Lovelace");
    expect(email.replyTo).toBe("ada@example.com");
    expect(email.text).toContain(input.message);
  });
});
