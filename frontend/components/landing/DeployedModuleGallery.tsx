"use client";

import Image from "next/image";

import {
  demoDevice,
  deviceScreens,
  pipelineModules,
  screenOrder,
  type DeviceScreen,
} from "@/lib/data/device-demo";
import { useDeviceScreen } from "@/hooks/useDeviceScreen";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";

function ModuleScreenViewer({
  activeScreen,
  onScreenChange,
}: {
  activeScreen: DeviceScreen;
  onScreenChange: (screen: DeviceScreen) => void;
}) {
  const screen = deviceScreens[activeScreen];
  const currentIndex = screenOrder.indexOf(activeScreen);

  const goPrev = () => {
    onScreenChange(screenOrder[(currentIndex - 1 + screenOrder.length) % screenOrder.length]);
  };

  const goNext = () => {
    onScreenChange(screenOrder[(currentIndex + 1) % screenOrder.length]);
  };

  return (
    <article className="overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-[#0a1f4d] shadow-[0_24px_48px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <button
          type="button"
          onClick={goPrev}
          className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 hover:bg-white/20"
          aria-label="Previous screen"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-center">
          <p className="text-sm font-bold">{demoDevice.name}</p>
          <p className="text-[11px] text-white/70">say {demoDevice.keyword}</p>
        </div>
        <button
          type="button"
          onClick={goNext}
          className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 hover:bg-white/20"
          aria-label="Next screen"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="relative aspect-[4/3] w-full bg-[#0a1f4d]">
        <Image
          src={screen.image}
          alt={`${screen.label} — on-device UI`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 480px"
        />
      </div>

      <div className="flex gap-2 px-3 py-2">
        {screenOrder.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onScreenChange(id)}
            className={`flex-1 rounded-lg py-2 text-center text-[11px] font-bold tracking-wide transition-colors ${
              activeScreen === id
                ? "bg-[#f5d547] text-[#0a1f4d]"
                : "bg-[#1a4a9e] text-white hover:bg-[#2559b8]"
            }`}
          >
            {deviceScreens[id].label}
          </button>
        ))}
      </div>

      {activeScreen === "path" && (
        <div className="grid grid-cols-3 gap-2 border-t border-white/10 p-3">
          {pipelineModules.map((mod) => (
            <div
              key={mod.id}
              className={`rounded-xl px-2 py-2 text-center ${
                mod.active ? "bg-[#f5d547] text-[#0a1f4d]" : "bg-[#1a4a9e] text-white"
              }`}
            >
              <p className="text-[9px] font-semibold uppercase opacity-80">{mod.label}</p>
              <p className="mt-0.5 text-xs font-bold">{mod.value}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export function DeployedModuleGallery() {
  const { activeScreen, setActiveScreen } = useDeviceScreen("live");

  return (
    <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-12">
      <Reveal>
        <div className="max-w-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-teal">
            On-device UI
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-brand-charcoal md:text-3xl">
            What runs on the module
          </h3>
          <p className="mt-3 text-base leading-relaxed text-brand-body">
            LIVE, QUOTA, PATH, and ABOUT screens from the deployed ESP32-S3 bench — the same views
            mirrored in the fleet dashboard.
          </p>
          <div className="mt-6 relative hidden overflow-hidden rounded-card border border-[#E5E7EB] md:block">
            <Image
              src="/images/device-modules/setup.jpg"
              alt="ESP32-S3 edge node on bench"
              width={640}
              height={400}
              className="h-48 w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <p className="absolute bottom-3 left-4 text-xs font-medium text-white">
              ESP32-S3 + OLED · field bench
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mx-auto w-full max-w-[420px] lg:ml-auto lg:mr-0">
          <ModuleScreenViewer activeScreen={activeScreen} onScreenChange={setActiveScreen} />
        </div>
      </Reveal>
    </div>
  );
}
