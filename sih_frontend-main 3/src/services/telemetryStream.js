/**
 * Telemetry Stream Service
 * Provides synthetic live sensor telemetry jitter & event bus for MOIL mines
 */

class TelemetryStreamService {
  constructor() {
    this.subscribers = new Set();
    this.timer = null;
    this.intervalMs = 8000;
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this.tick();
    }, this.intervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    if (this.subscribers.size === 1) {
      this.start();
    }
    return () => {
      this.subscribers.delete(callback);
      if (this.subscribers.size === 0) {
        this.stop();
      }
    };
  }

  tick() {
    // Generate slight random telemetry perturbation
    const delta = {
      timestamp: new Date().toISOString(),
      rainfallDelta: (Math.random() - 0.48) * 1.5,
      inflowDelta: (Math.random() - 0.45) * 4.0,
      equipmentJitter: Math.random() > 0.85,
    };
    this.subscribers.forEach((cb) => cb(delta));
  }
}

export const telemetryStream = new TelemetryStreamService();
