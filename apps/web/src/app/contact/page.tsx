import type { Metadata } from "next";
import { profile } from "@portfolio/content";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${profile.name} about full-time roles or projects.`,
};

export default function ContactPage() {
  return (
    <main id="main" className="page-gutter flex-1 pt-10 pb-24 sm:pt-14">
      <p className="font-mono text-label uppercase text-muted">Contact</p>
      <h1 className="mt-3 font-wide text-h1 font-extrabold uppercase">Get in touch</h1>

      <div className="mt-10 grid gap-12 border-t-2 border-fg pt-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16">
        <aside className="flex flex-col gap-6">
          <p className="text-[clamp(1.125rem,1.8vw,1.375rem)] leading-snug">
            {profile.openToWork
              ? "I'm open to full-time React, Next.js and React Native roles. Tell me about the team and the problem."
              : "Have a project in mind? Tell me about it."}
          </p>
          <dl className="flex flex-col gap-4 text-small">
            <div className="flex flex-col gap-1">
              <dt className="font-mono text-label uppercase text-muted">Based in</dt>
              <dd>{profile.location} · UTC+5</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="font-mono text-label uppercase text-muted">Elsewhere</dt>
              <dd className="flex gap-4">
                {profile.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-accent">
                    {link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </aside>

        <ContactForm />
      </div>
    </main>
  );
}
