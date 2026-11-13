import "server-only";
import { z } from "zod";

const contactEnvSchema = z.object({
  /** Salt for hashing sender IPs. Long and random; changing it resets rate limits. */
  CONTACT_IP_SALT: z.string().min(16).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  /** Where notifications go. */
  CONTACT_TO_EMAIL: z.email().optional(),
  /** Verified Resend sender, e.g. "Portfolio <hello@your-domain.dev>". */
  CONTACT_FROM_EMAIL: z.string().min(3).optional(),
});

export type ContactEnv = {
  ipSalt: string | null;
  /** Null when any email setting is missing: messages are still saved, emails are skipped. */
  email: { apiKey: string; to: string; from: string } | null;
};

/** Read at call time, not import time, so builds never need these secrets. */
export function getContactEnv(): ContactEnv {
  const env = contactEnvSchema.parse({
    CONTACT_IP_SALT: process.env.CONTACT_IP_SALT || undefined,
    RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL || undefined,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL || undefined,
  });
  const { RESEND_API_KEY: apiKey, CONTACT_TO_EMAIL: to, CONTACT_FROM_EMAIL: from } = env;
  return {
    ipSalt: env.CONTACT_IP_SALT ?? null,
    email: apiKey && to && from ? { apiKey, to, from } : null,
  };
}
