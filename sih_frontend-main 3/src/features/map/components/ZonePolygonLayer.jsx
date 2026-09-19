import { GeoJSON } from 'react-leaflet';
import { useGeoJson } from '@/hooks/useGeoJson';

export default function ZonePolygonLayer() {
  const { geoData, loading } = useGeoJson();

  if (loading || !geoData) return null;

  const style = (feature) => ({
    color: feature.properties.fillColor || '#f59e0b',
    weight: 2,
    opacity: 0.7,
    fillOpacity: 0.15,
    dashArray: '5,5',
  });

  return <GeoJSON data={geoData} style={style} />;
}
