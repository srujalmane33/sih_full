export interface MineTelemetry {
  rainfall24h: number; // in mm
  soilMoistureIndex: number; // 0 to 100 percentage
  equipmentDowntime: number; // in hours
  rockHardnessMohs: number; // 1 to 10 Mohs scale
  slopeStabilityFactor: number; // Safety Factor (FoS)
  activeFleetCount: number;
  groundwaterInflow: number; // m3/hr
  haulRoadTrafficIndex: number; // 0-100 efficiency
}

export interface SatelliteObservation {
  lastPass: string;
  sarSubsidenceMm: number;
  spectralBandRatio: number;
  cloudCoveragePct: number;
}
