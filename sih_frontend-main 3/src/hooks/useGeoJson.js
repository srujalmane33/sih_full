import { useState, useEffect } from 'react';
import { getJson } from '../services/httpClient';
import { API_CONFIG } from '../config/api.config';

export function useGeoJson() {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await getJson(API_CONFIG.ENDPOINTS.GEOJSON);
        if (isMounted) {
          setGeoData(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[useGeoJson] Failed to load GeoJSON:', err);
          setError(err.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { geoData, loading, error };
}
