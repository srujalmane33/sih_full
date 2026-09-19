export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface ConcessionPolygonProperties {
  id: string;
  zoneId: string;
  name: string;
  areaHectares: number;
  mineral: string;
  leaseStatus: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  fillColor: string;
}

export interface ConcessionGeoJsonFeature {
  type: 'Feature';
  properties: ConcessionPolygonProperties;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

export interface ProspectPin {
  id: string;
  name: string;
  coordinates: [number, number];
  estimatedGradeMn: number;
  depthEstimateMeters: number;
  confidenceScore: number;
  createdAt: string;
  notes?: string;
}
