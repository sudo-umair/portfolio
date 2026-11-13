import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const contactMessages = pgTable(
  "contact_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    message: text("message").notNull(),
    /** Salted SHA-256 of the sender's IP. Used for rate limiting; the raw IP is never stored. */
    ipHash: text("ip_hash").notNull(),
    userAgent: text("user_agent"),
    /** Notification email outcome. The message is saved first, so a failed email never loses it. */
    emailStatus: text("email_status", { enum: ["pending", "sent", "failed", "skipped"] })
      .notNull()
      .default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  // Rate-limit lookups: recent messages per IP hash.
  (table) => [index("contact_messages_ip_hash_created_at_idx").on(table.ipHash, table.createdAt)],
);

export type ContactMessage = typeof contactMessages.$inferSelect;
