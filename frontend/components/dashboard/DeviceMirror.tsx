"use client";

import Image from "next/image";

import {
  demoDevice,
  deviceScreens,
  pipelineModules,
  screenOrder,
  type DeviceScreen,
} from "@/lib/data/device-demo";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DeviceMirrorProps {
  activeScreen: DeviceScreen;
  onScreenChange: (screen: DeviceScreen) => void;
}

export function DeviceMirror({ activeScreen, onScreenChange }: DeviceMirrorProps) {
  const screen = deviceScreens[activeScreen];
  const currentIndex = screenOrder.indexOf(activeScreen);

  const goPrev = () => {
    const next = screenOrder[(currentIndex - 1 + screenOrder.length) % screenOrder.length];
    onScreenChange(next);
  };

  const goNext = () => {
    const next = screenOrder[(currentIndex + 1) % screenOrder.length];
    onScreenChange(next);
  };

  return (
    <article className="dash-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#0f2d6e] px-4 py-3 text-white">
        <button
          type="button"
          onClick={goPrev}
          className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 hover:bg-white/20"
          aria-label="Previous screen"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-center">
          <p className="text-sm font-bold tracking-wide">{demoDevice.name}</p>
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
          alt={`${screen.label} module screen`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      <div className="flex items-center gap-2 border-t border-[#E5E7EB] bg-[#0f2d6e] px-3 py-2">
        {screenOrder.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onScreenChange(id)}
            className={`flex-1 rounded-lg px-2 py-2 text-center text-[11px] font-bold tracking-wide transition-colors ${
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
        <div className="grid grid-cols-3 gap-2 border-t border-[#E5E7EB] bg-[#0a1f4d] p-3">
          {pipelineModules.map((mod) => (
            <div
              key={mod.id}
              className={`rounded-xl px-2 py-3 text-center ${
                mod.active ? "bg-[#f5d547] text-[#0a1f4d]" : "bg-[#1a4a9e] text-white"
              }`}
            >
              <p className="text-[10px] font-semibold uppercase opacity-80">{mod.label}</p>
              <p className="mt-1 text-sm font-bold">{mod.value}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
