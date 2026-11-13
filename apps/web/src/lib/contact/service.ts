import { createHash } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import type { Database } from "@/db";
import { contactMessages } from "@/db/schema";
import type { ContactInput } from "./validation";

export const RATE_LIMIT = { max: 3, windowMs: 60 * 60 * 1000 } as const;

export function hashIp(ip: string, salt: string) {
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export type SaveResult = { status: "saved"; id: string } | { status: "rate_limited" };

/**
 * Rate-limit check and insert in one statement: the row is only inserted if
 * this IP hash has fewer than RATE_LIMIT.max messages in the window.
 *
 * Known limit: two truly simultaneous requests from one IP can both pass the
 * count. Closing that needs an interactive transaction with an advisory lock,
 * which Neon's HTTP driver doesn't support. Acceptable for a contact form.
 */
export async function saveContactMessage(
  db: Database,
  {
    input,
    ipHash,
    userAgent,
    now = new Date(),
  }: { input: ContactInput; ipHash: string; userAgent: string | null; now?: Date },
): Promise<SaveResult> {
  const since = new Date(now.getTime() - RATE_LIMIT.windowMs).toISOString();
  const result = await db.execute(sql`
    insert into ${contactMessages} (name, email, message, ip_hash, user_agent, created_at)
    select ${input.name}, ${input.email}, ${input.message}, ${ipHash}, ${userAgent}, ${now.toISOString()}::timestamptz
    where (
      select count(*) from ${contactMessages}
      where ip_hash = ${ipHash} and created_at > ${since}::timestamptz
    ) < ${RATE_LIMIT.max}
    returning id
  `);

  // Both drivers (neon-http, PGlite) return { rows }.
  const [row] = (result as unknown as { rows: { id: string }[] }).rows;
  return row ? { status: "saved", id: row.id } : { status: "rate_limited" };
}

export async function setEmailStatus(db: Database, id: string, status: "sent" | "failed" | "skipped") {
  await db.update(contactMessages).set({ emailStatus: status }).where(eq(contactMessages.id, id));
}

/** Plain-text notification. Reply-To is the sender, so replying from the inbox just works. */
export function buildNotificationEmail(input: ContactInput) {
  return {
    subject: `Portfolio message from ${input.name}`,
    replyTo: input.email,
    text: [`From: ${input.name} <${input.email}>`, "", input.message].join("\n"),
  };
}
