import { Hero } from "@/components/home/hero";
import { WorkSection } from "@/components/home/work-section";

export default function Home() {
  return (
    <main id="main" className="flex-1">
      <Hero />
      <WorkSection />
    </main>
  );
}
