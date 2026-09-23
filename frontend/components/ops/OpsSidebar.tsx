"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Monitor,
  MessageSquareText,
  BarChart3,
  Settings,
  Video,
  ChevronLeft,
  ChevronRight,
  Radio,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/ops", label: "Overview", icon: LayoutDashboard },
  { href: "/ops/devices", label: "Devices", icon: Monitor },
  { href: "/ops/sessions", label: "Sessions", icon: MessageSquareText },
  { href: "/demo", label: "Demo Video", icon: Video },
  { href: "/ops/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/ops/settings", label: "Settings", icon: Settings },
] as const;

export function OpsSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  function isActive(href: string): boolean {
    if (href === "/ops") return pathname === "/ops";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={`fixed left-0 top-0 z-30 flex h-dvh flex-col border-r border-ops-border bg-ops-card transition-all duration-200 ${
        collapsed ? "w-sidebar-collapsed" : "w-sidebar"
      }`}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-ops-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ops-teal text-white">
          <Radio className="h-4 w-4" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ops-text">Anuvaani</p>
            <p className="truncate text-[11px] text-ops-text-secondary">Operations</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`ops-sidebar-link ${active ? "ops-sidebar-link-active" : ""}`}
              title={collapsed ? label : undefined}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-ops-border px-3 py-3">
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="ops-sidebar-link w-full justify-center"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
