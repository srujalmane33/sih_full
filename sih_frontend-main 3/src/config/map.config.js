export const MAP_CONFIG = {
  DEFAULT_CENTER: [21.65, 79.80], // Centered over MOIL MP-Maharashtra Manganese Belt
  DEFAULT_ZOOM: 10,
  MIN_ZOOM: 7,
  MAX_ZOOM: 18,
  
  TILE_PROVIDERS: {
    SATELLITE: {
      id: 'satellite',
      name: 'Sentinel/Esri Satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 18,
    },
    DARK: {
      id: 'dark',
      name: 'Dark Carto Matter',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    },
    TOPO: {
      id: 'topo',
      name: 'OpenTopo Elevation',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
      maxZoom: 17,
    },
  },

  RADAR_PULSE_FREQUENCIES: {
    CRITICAL: 1800, // ms
    HIGH: 2400,
    MEDIUM: 3200,
    LOW: 4000,
  },
};
