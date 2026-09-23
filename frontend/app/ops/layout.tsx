import type { Metadata } from "next";
import { OpsProvider } from "@/hooks/useOpsStore";
import { OpsSidebar } from "@/components/ops/OpsSidebar";
import { OpsHeader } from "@/components/ops/OpsHeader";

export const metadata: Metadata = {
  title: "Anuvaani Operations",
  description:
    "Monitor deployed voice nodes, follow speech sessions, identify failures and review system performance.",
};

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <OpsProvider>
      <div className="flex min-h-dvh bg-ops-bg">
        <OpsSidebar />
        {/* Main area offset by sidebar width — uses CSS var so collapse works */}
        <div className="ml-sidebar flex flex-1 flex-col">
          <OpsHeader />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </OpsProvider>
  );
}
