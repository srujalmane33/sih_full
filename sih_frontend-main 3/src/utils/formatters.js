/**
 * Formatting helpers for MANGANAI dashboard
 */

export function formatNumber(num, decimals = 0) {
  if (num === null || num === undefined || isNaN(num)) return '—';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(num);
}

export function formatMetricTonnes(tonnes, decimals = 1) {
  if (tonnes === null || tonnes === undefined || isNaN(tonnes)) return '—';
  if (tonnes >= 1000000) {
    return `${(tonnes / 1000000).toFixed(decimals)} M MT`;
  }
  if (tonnes >= 1000) {
    return `${(tonnes / 1000).toFixed(decimals)} k MT`;
  }
  return `${formatNumber(tonnes, decimals)} MT`;
}

export function formatPercentage(pct, decimals = 1) {
  if (pct === null || pct === undefined || isNaN(pct)) return '—';
  return `${Number(pct).toFixed(decimals)}%`;
}

export function formatTimestamp(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}
