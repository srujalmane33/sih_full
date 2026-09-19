export function extractPolygonCentroids(geojsonFeatures) {
  return geojsonFeatures.map((f) => {
    const coords = f.geometry.coordinates[0];
    const lat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
    const lng = coords.reduce((s, c) => s + c[0], 0) / coords.length;
    return { ...f.properties, lat, lng };
  });
}
