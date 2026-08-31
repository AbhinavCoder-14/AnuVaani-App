const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface HealthResponse {
  status: string;
  service: string;
}

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_URL}/health`, {
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }

  return response.json() as Promise<HealthResponse>;
}

export async function fetchDevices(): Promise<unknown[]> {
  const response = await fetch(`${API_URL}/api/devices`);

  if (!response.ok) {
    throw new Error(`Failed to fetch devices: ${response.status}`);
  }

  return response.json();
}
