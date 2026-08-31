import { CaseStudiesSection } from "@/components/landing/CaseStudiesSection";
import { ComparisonSection } from "@/components/landing/ComparisonSection";
import { DashboardShowcaseSection } from "@/components/landing/DashboardShowcaseSection";
import { DeploymentJourney } from "@/components/landing/DeploymentJourney";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { MetricsStrip } from "@/components/landing/MetricsStrip";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { TechSpecsSection } from "@/components/landing/TechSpecsSection";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteNav } from "@/components/shared/SiteNav";

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <main className="w-full max-w-full overflow-x-hidden">
        <HeroSection />
        <MetricsStrip />
        <ProblemSection />
        <HowItWorksSection />
        <FeaturesSection />
        <DashboardShowcaseSection />
        <CaseStudiesSection />
        <TechSpecsSection />
        <ComparisonSection />
        <DeploymentJourney />
      </main>
      <SiteFooter />
    </>
  );
}