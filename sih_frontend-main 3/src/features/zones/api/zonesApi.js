import { getJson } from '@/services/httpClient';
import { API_CONFIG } from '@/config/api.config';

export async function fetchZonesFeed() {
  return getJson(API_CONFIG.ENDPOINTS.FEED);
}

export async function fetchConcessions() {
  return getJson(API_CONFIG.ENDPOINTS.GEOJSON);
}
