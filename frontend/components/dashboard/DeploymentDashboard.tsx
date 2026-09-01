"use client";

import { ModuleDashboard } from "@/components/dashboard/ModuleDashboard";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteNav } from "@/components/shared/SiteNav";

export function DeploymentDashboard() {
  return (
    <div className="min-h-[100dvh] bg-[#FAFAF8]">
      <SiteNav />
      <main className="page-container py-8 md:py-10">
        <ModuleDashboard />
      </main>
      <SiteFooter />
    </div>
  );
}
