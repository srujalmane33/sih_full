import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { MAP_CONFIG } from '@/config/map.config';
import { useZoneContext } from '@/context';
import ZonePulseMarker from './ZonePulseMarker';
import MapLegend from './MapLegend';
import 'leaflet/dist/leaflet.css';

function FlyToZone() {
  const map = useMap();
  const { selectedZone } = useZoneContext();

  useEffect(() => {
    if (selectedZone?.coordinates) {
      map.flyTo(selectedZone.coordinates, 13, { duration: 1.5 });
    }
  }, [selectedZone, map]);

  return null;
}

export default function MapContainerWrapper({ height = '100%', className = '' }) {
  const { zones } = useZoneContext();
  const [activeLayer, setActiveLayer] = useState('SATELLITE');
  const tileConfig = MAP_CONFIG.TILE_PROVIDERS[activeLayer];

  return (
    <div className={`relative rounded-xl overflow-hidden border border-slate-200/90 shadow-2xs ${className}`} style={{ height }}>
      <MapContainer
        center={MAP_CONFIG.DEFAULT_CENTER}
        zoom={MAP_CONFIG.DEFAULT_ZOOM}
        minZoom={MAP_CONFIG.MIN_ZOOM}
        maxZoom={MAP_CONFIG.MAX_ZOOM}
        className="h-full w-full z-0"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          key={activeLayer}
          url={tileConfig.url}
          attribution={tileConfig.attribution}
          maxZoom={tileConfig.maxZoom}
        />

        {zones.map((zone) => (
          <ZonePulseMarker key={zone.id} zone={zone} />
        ))}

        <FlyToZone />
      </MapContainer>

      {/* Layer switcher */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1">
        {Object.entries(MAP_CONFIG.TILE_PROVIDERS).map(([key, layer]) => (
          <button
            key={key}
            onClick={() => setActiveLayer(key)}
            className={`px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-md border transition-all ${
              activeLayer === key
                ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm'
                : 'bg-white/90 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white shadow-xs'
            }`}
          >
            {layer.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <MapLegend />
    </div>
  );
}
