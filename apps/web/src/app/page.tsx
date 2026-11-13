import type { Metadata } from "next";
import { experience, profile } from "@portfolio/content";
import { Hero } from "@/components/home/hero";
import { WorkSection } from "@/components/home/work-section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const current = experience.find((job) => !job.end);
const [city] = profile.location.split(",");

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: site.name,
      url: site.url.href,
    },
    {
      "@type": "Person",
      name: profile.name,
      jobTitle: profile.title,
      description: site.description,
      url: site.url.href,
      sameAs: profile.links.map((link) => link.href),
      address: { "@type": "PostalAddress", addressLocality: city, addressCountry: profile.countryCode },
      ...(current && { worksFor: { "@type": "Organization", name: current.org } }),
    },
  ],
};

export default function Home() {
  return (
    <main id="main" className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <WorkSection />
    </main>
  );
}
