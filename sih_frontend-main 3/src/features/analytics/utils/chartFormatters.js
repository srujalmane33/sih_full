export function formatAxisTick(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return value;
}

export function formatTooltipValue(value, name) {
  return [`${value.toLocaleString('en-IN')} MT`, name];
}
