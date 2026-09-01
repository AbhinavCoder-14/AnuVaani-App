"use client";

import { useState } from "react";

import type { DeviceScreen } from "@/lib/data/device-demo";

export function useDeviceScreen(defaultScreen: DeviceScreen = "live") {
  const [activeScreen, setActiveScreen] = useState<DeviceScreen>(defaultScreen);
  return { activeScreen, setActiveScreen };
}
