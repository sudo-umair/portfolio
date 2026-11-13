import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { WorkSection } from "@/components/home/work-section";

// Title, description and Open Graph come from the root layout.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main id="main" className="flex-1">
      <Hero />
      <WorkSection />
    </main>
  );
}
