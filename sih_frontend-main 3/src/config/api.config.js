export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1',

  TIMEOUT_MS: 8000,
  POLLING_INTERVAL_MS: 15000,
  SIMULATED_STREAM: import.meta.env.VITE_ENABLE_SIMULATED_STREAM === 'true',
  ENDPOINTS: {
    FEED: '/data/dashboard_feed.json',
    GEOJSON: '/data/moil_concessions.geojson',
    TELEMETRY_STREAM: '/telemetry/live',
    SIMULATE: '/analytics/simulate',
    SIMULATOR_PREDICT: '/simulator/predict',
    DISPATCH_ACTION: '/recommendations/dispatch',
  },
};

