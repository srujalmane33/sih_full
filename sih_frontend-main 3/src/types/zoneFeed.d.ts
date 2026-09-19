import { MineTelemetry, SatelliteObservation } from './telemetry';

export interface MineZone {
  id: string;
  name: string;
  code: string;
  state: string;
  district: string;
  coordinates: [number, number];
  mineType: 'Underground' | 'Opencast';
  depthMeters: number;
  reservesMT: number;
  oreGrade: number; // percentage Mn
  mineralForm: string;
  monthlyTargetMT: number;
  actualProductionMT: number;
  shortfallMT: number;
  shortfallPct: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  telemetry: MineTelemetry;
  satellite: SatelliteObservation;
  primaryBottleneck: string;
  recommendedAction: string;
}

export interface DashboardFeed {
  systemStatus: {
    telemetryHealth: string;
    lastIngest: string;
    satelliteSync: string;
    activeAlertsCount: number;
    networkLatencyMs: number;
  };
  summaryMetrics: {
    totalReservesMT: number;
    avgManganeseGrade: number;
    monthlyTargetMT: number;
    actualProductionMT: number;
    projectedShortfallMT: number;
    fleetAvailabilityPct: number;
    overallReserveConfidencePct: number;
    criticalZoneCount: number;
    highRiskZoneCount: number;
    monitoredZonesCount: number;
  };
  zones: MineZone[];
}
