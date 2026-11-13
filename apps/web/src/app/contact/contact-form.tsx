"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { ContactField } from "@/lib/contact/validation";
import { HONEYPOT_FIELD } from "@/lib/contact/validation";
import { sendContactMessage, type ContactState } from "./actions";

const MESSAGE_MAX = 5000;

/** Remounting with a new key is the clean way to start a fresh form after success. */
export function ContactForm() {
  const [attempt, setAttempt] = useState(0);
  return <Form key={attempt} onSendAnother={() => setAttempt((n) => n + 1)} />;
}

function Form({ onSendAnother }: { onSendAnother: () => void }) {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(sendContactMessage, { status: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  // Move focus to what changed: the first invalid field, or the confirmation.
  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
    if (state.status === "error" && state.fieldErrors) {
      const first = (["name", "email", "message"] as const).find((field) => state.fieldErrors?.[field]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  }, [state]);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-start gap-4 border-2 border-fg p-6 sm:p-8">
        <p className="font-mono text-label uppercase text-accent">Message sent</p>
        <h2 ref={successRef} tabIndex={-1} className="font-semiwide text-h2 font-bold uppercase outline-none">
          Thanks, I&apos;ll be in touch.
        </h2>
        <p className="text-muted">Your message is in my inbox. I&apos;ll reply to the email address you gave.</p>
        <button
          type="button"
          onClick={onSendAnother}
          className="border border-fg px-5 py-3 text-small font-semibold transition-colors hover:bg-fg hover:text-bg"
        >
          Send another message
        </button>
      </div>
    );
  }

  const fieldErrors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const values = state.status === "error" ? state.values : undefined;
  const formError = state.status === "error" && !state.fieldErrors ? state.message : null;

  return (
    <form ref={formRef} action={formAction} noValidate className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" error={fieldErrors.name}>
          {(props) => <input {...props} type="text" autoComplete="name" maxLength={100} defaultValue={values?.name} />}
        </Field>
        <Field label="Email" name="email" error={fieldErrors.email}>
          {(props) => (
            <input {...props} type="email" autoComplete="email" inputMode="email" maxLength={254} defaultValue={values?.email} />
          )}
        </Field>
      </div>

      <Field label="Message" name="message" error={fieldErrors.message} hint="What are you working on, and how can I help?">
        {(props) => <textarea {...props} rows={7} maxLength={MESSAGE_MAX} defaultValue={values?.message} className={`${props.className} resize-y`} />}
      </Field>

      {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {formError && (
        <p role="alert" className="border-l-2 border-danger pl-3 text-small text-danger">
          {formError}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 bg-accent px-6 py-3 text-small font-semibold text-accent-fg transition-opacity hover:opacity-90 disabled:cursor-progress disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send message"}
        </button>
        <p className="text-label text-muted">Your IP is only stored as a one-way hash, for rate limiting.</p>
      </div>
    </form>
  );
}

type FieldProps = {
  id: string;
  name: ContactField;
  required: true;
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
  className: string;
};

function Field({
  label,
  name,
  error,
  hint,
  children,
}: {
  label: string;
  name: ContactField;
  error?: string;
  hint?: string;
  children: (props: FieldProps) => React.ReactNode;
}) {
  const id = `contact-${name}`;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={id} className="font-mono text-label uppercase text-muted">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="-mt-1 text-small text-muted">
          {hint}
        </p>
      )}
      {children({
        id,
        name,
        required: true,
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy,
        className:
          "w-full border border-line bg-bg px-3 py-2.5 text-body text-fg transition-colors placeholder:text-muted focus:border-fg focus:outline-none aria-invalid:border-danger",
      })}
      {error && (
        <p id={`${id}-error`} className="text-small text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
