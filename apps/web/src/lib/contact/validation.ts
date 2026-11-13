import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(100, "Keep your name under 100 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email so I can reply.")
    .max(254, "That email address is too long.")
    .pipe(z.email("Enter a valid email address.")),
  message: z
    .string()
    .trim()
    .min(10, "Write at least 10 characters.")
    .max(5000, "Keep the message under 5,000 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

/** Name of the honeypot input: hidden from people, filled in by naive bots. */
export const HONEYPOT_FIELD = "website";

export type ParsedContactForm =
  | { kind: "valid"; data: ContactInput }
  | { kind: "invalid"; fieldErrors: Partial<Record<ContactField, string>>; values: Record<ContactField, string> }
  | { kind: "spam" };

export function parseContactForm(formData: FormData): ParsedContactForm {
  const text = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };

  if (text(HONEYPOT_FIELD).trim() !== "") return { kind: "spam" };

  const values = { name: text("name"), email: text("email"), message: text("message") };
  const result = contactSchema.safeParse(values);
  if (result.success) return { kind: "valid", data: result.data };

  const fieldErrors: Partial<Record<ContactField, string>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactField;
    fieldErrors[field] ??= issue.message; // first error per field
  }
  return { kind: "invalid", fieldErrors, values };
}
