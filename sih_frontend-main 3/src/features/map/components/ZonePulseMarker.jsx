import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useMemo } from 'react';
import { getRiskConfig } from '@/config/riskLevels.config';
import { useZoneContext } from '@/context';
import { formatNumber, formatPercentage } from '@/utils/formatters';

function createRadarIcon(riskLevel) {
  const config = getRiskConfig(riskLevel);
  return L.divIcon({
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
    html: `
      <div class="radar-marker-container ${config.markerClass}">
        <div class="radar-wave radar-wave-1"></div>
        <div class="radar-wave radar-wave-2"></div>
        <div class="radar-marker-core"></div>
      </div>
    `,
  });
}

export default function ZonePulseMarker({ zone }) {
  const { selectZone } = useZoneContext();
  const icon = useMemo(() => createRadarIcon(zone.riskLevel), [zone.riskLevel]);

  return (
    <Marker
      position={zone.coordinates}
      icon={icon}
      eventHandlers={{
        click: () => selectZone(zone.id),
      }}
    >
      <Popup maxWidth={280} minWidth={220}>
        <div className="text-sm">
          <h4 className="font-bold text-slate-100 text-base mb-1">{zone.name}</h4>
          <p className="text-xs text-slate-400 mb-2">{zone.code} • {zone.district}, {zone.state}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <span className="text-slate-400">Risk Score:</span>
            <span className="font-bold" style={{ color: getRiskConfig(zone.riskLevel).color }}>{zone.riskScore}/100</span>
            <span className="text-slate-400">Shortfall:</span>
            <span className="font-bold text-red-400">{formatPercentage(zone.shortfallPct)}</span>
            <span className="text-slate-400">Target:</span>
            <span className="text-slate-200">{formatNumber(zone.monthlyTargetMT)} MT</span>
            <span className="text-slate-400">Ore Grade:</span>
            <span className="text-amber-400">{zone.oreGrade}% Mn</span>
            <span className="text-slate-400">Rain 24h:</span>
            <span className="text-cyan-400">{zone.telemetry.rainfall24h} mm</span>
            <span className="text-slate-400">Downtime:</span>
            <span className="text-orange-400">{zone.telemetry.equipmentDowntime} hrs</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
