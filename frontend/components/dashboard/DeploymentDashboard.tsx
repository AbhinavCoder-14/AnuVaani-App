"use client";

import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { DeviceFleet } from "@/components/dashboard/DeviceFleet";
import { FleetHealth } from "@/components/dashboard/FleetHealth";
import { LanguageComparison } from "@/components/dashboard/LanguageComparison";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteNav } from "@/components/shared/SiteNav";
import { fleetHealth } from "@/lib/data/deployments";

export function DeploymentDashboard() {
  return (
    <div className="min-h-[100dvh] bg-[#FAFAF8]">
      <SiteNav />
      <main className="page-container space-y-6 py-8 md:space-y-8 md:py-10">
        <header>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-teal">
            ISRO PS 26172 · Eval Console
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-charcoal md:text-4xl">
            Evaluation Dashboard
          </h1>
          <p className="mt-2 text-sm text-brand-muted">
            Evaluation fleet · {fleetHealth.devicesOnline} of {fleetHealth.devicesTotal} benches online
          </p>
        </header>

        <StatusBar />
        <FleetHealth />
        <ActivityTimeline />
        <DeviceFleet />
        <LanguageComparison />
      </main>
      <SiteFooter />
    </div>
  );
}
