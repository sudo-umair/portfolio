import { describe, expect, it } from "vitest";
import { HONEYPOT_FIELD, parseContactForm } from "./validation";

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

const valid = { name: "Ada Lovelace", email: "ada@example.com", message: "Hello, I'd like to talk about a role." };

describe("parseContactForm", () => {
  it("accepts a valid message and trims whitespace", () => {
    const result = parseContactForm(form({ ...valid, name: "  Ada Lovelace  ", email: " ada@example.com " }));
    expect(result).toEqual({ kind: "valid", data: valid });
  });

  it("returns one readable error per invalid field and echoes the values", () => {
    const result = parseContactForm(form({ name: "", email: "not-an-email", message: "short" }));
    expect(result.kind).toBe("invalid");
    if (result.kind !== "invalid") return;
    expect(result.fieldErrors).toEqual({
      name: "Enter your name.",
      email: "Enter a valid email address.",
      message: "Write at least 10 characters.",
    });
    expect(result.values).toEqual({ name: "", email: "not-an-email", message: "short" });
  });

  it("asks for an email when it's empty", () => {
    const result = parseContactForm(form({ ...valid, email: "   " }));
    expect(result.kind === "invalid" && result.fieldErrors.email).toBe("Enter your email so I can reply.");
  });

  it("rejects overly long messages", () => {
    const result = parseContactForm(form({ ...valid, message: "x".repeat(5001) }));
    expect(result.kind === "invalid" && result.fieldErrors.message).toBe("Keep the message under 5,000 characters.");
  });

  it("treats missing fields as empty instead of throwing", () => {
    expect(parseContactForm(new FormData()).kind).toBe("invalid");
  });

  it("flags a filled honeypot as spam before validating", () => {
    expect(parseContactForm(form({ ...valid, [HONEYPOT_FIELD]: "https://spam.example" }))).toEqual({ kind: "spam" });
  });
});
