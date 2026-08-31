export interface DeviceMetrics {
  cpu_percent?: number;
  ram_mb?: number;
  model_size_kb?: number;
  kws_inference_ms?: number;
  network_latency_ms?: number;
  end_to_end_latency_ms?: number;
}

export interface MetricsUpdatedEvent {
  type: "metrics_updated";
  device_id: string;
  metrics: DeviceMetrics;
  timestamp: string;
}

export type MetricsEvent = MetricsUpdatedEvent;
