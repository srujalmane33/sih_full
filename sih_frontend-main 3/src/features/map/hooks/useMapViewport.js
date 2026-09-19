import { useState, useCallback } from 'react';
import { MAP_CONFIG } from '@/config/map.config';

export function useMapViewport() {
  const [viewport, setViewport] = useState({
    center: MAP_CONFIG.DEFAULT_CENTER,
    zoom: MAP_CONFIG.DEFAULT_ZOOM,
  });

  const flyTo = useCallback((coords, zoom = 13) => {
    setViewport({ center: coords, zoom });
  }, []);

  const resetView = useCallback(() => {
    setViewport({ center: MAP_CONFIG.DEFAULT_CENTER, zoom: MAP_CONFIG.DEFAULT_ZOOM });
  }, []);

  return { viewport, flyTo, resetView };
}
