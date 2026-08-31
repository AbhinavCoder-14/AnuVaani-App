"use client";

import { useCallback, useState } from "react";

import type { DeviceInfo } from "@/types/device";

interface UseDeviceReturn {
  devices: DeviceInfo[];
  selectedDevice: DeviceInfo | null;
  selectDevice: (deviceId: string) => void;
}

/** Device state hook — will connect to backend device registry later. */
export function useDevice(): UseDeviceReturn {
  const [devices] = useState<DeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);

  const selectDevice = useCallback(
    (deviceId: string) => {
      const device = devices.find((d) => d.device_id === deviceId) ?? null;
      setSelectedDevice(device);
    },
    [devices],
  );

  return { devices, selectedDevice, selectDevice };
}
