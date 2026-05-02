import { SiteTopNav } from "@/components/navigation/SiteTopNav";
import { ChartPreviewSection } from "@/features/home/components/ChartPreviewSection";
import { CtaSection } from "@/features/home/components/CtaSection";
import { DisclaimerSection } from "@/features/home/components/DisclaimerSection";
import { FeaturesSection } from "@/features/home/components/FeaturesSection";
import { HeroSection } from "@/features/home/components/HeroSection";
import { HowItWorksSection } from "@/features/home/components/HowItWorksSection";

export function HomeLandingPage() {
  return (
    <div className="min-h-full bg-black text-zinc-100">
      <SiteTopNav />

      <main className="fx-container space-y-6 py-8 sm:space-y-8 sm:py-10">
        <HeroSection />
        <ChartPreviewSection />
        <HowItWorksSection />
        <FeaturesSection />
        <DisclaimerSection />
        <CtaSection />
      </main>
    </div>
  );
}
