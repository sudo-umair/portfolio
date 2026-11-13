"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { Resend } from "resend";
import { getDb } from "@/db";
import { buildNotificationEmail, hashIp, saveContactMessage, setEmailStatus } from "@/lib/contact/service";
import { parseContactForm, type ContactField, type ContactInput } from "@/lib/contact/validation";
import { getContactEnv, type ContactEnv } from "@/lib/env";

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<ContactField, string>>;
      /** Echoed back because React resets the form after an action. */
      values?: Record<ContactField, string>;
    };

const UNAVAILABLE = "Messages can't be sent right now. Please reach out on LinkedIn instead.";

export async function sendContactMessage(_previous: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = parseContactForm(formData);

  // Report success to bots so they learn nothing; store nothing.
  if (parsed.kind === "spam") return { status: "success" };

  if (parsed.kind === "invalid") {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors: parsed.fieldErrors,
      values: parsed.values,
    };
  }

  const input = parsed.data;
  const values = { name: input.name, email: input.email, message: input.message };
  const db = getDb();
  const env = getContactEnv();
  if (!db || !env.ipSalt) return { status: "error", message: UNAVAILABLE, values };

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown";

  try {
    const result = await saveContactMessage(db, {
      input,
      ipHash: hashIp(ip, env.ipSalt),
      userAgent: requestHeaders.get("user-agent")?.slice(0, 500) ?? null,
    });

    if (result.status === "rate_limited") {
      return {
        status: "error",
        message: "You've sent a few messages already. Please try again in an hour.",
        values,
      };
    }

    // The message is saved; email after the response so the sender never waits on Resend.
    after(() => notify(result.id, input, env));
    return { status: "success" };
  } catch (error) {
    console.error("[contact] failed to save message", error);
    return { status: "error", message: UNAVAILABLE, values };
  }
}

async function notify(id: string, input: ContactInput, env: ContactEnv) {
  const db = getDb();
  if (!db) return;
  if (!env.email) {
    await setEmailStatus(db, id, "skipped");
    return;
  }

  const email = buildNotificationEmail(input);
  try {
    const { error } = await new Resend(env.email.apiKey).emails.send({
      from: env.email.from,
      to: env.email.to,
      replyTo: email.replyTo,
      subject: email.subject,
      text: email.text,
    });
    if (error) throw new Error(`${error.name}: ${error.message}`);
    await setEmailStatus(db, id, "sent");
  } catch (error) {
    console.error("[contact] notification email failed", error);
    await setEmailStatus(db, id, "failed").catch(() => {});
  }
}
