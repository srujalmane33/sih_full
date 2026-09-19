import { useMemo } from 'react';

export function useChartMetrics(zones) {
  return useMemo(() => {
    if (!zones?.length) return { chartData: [], avg: {} };
    const chartData = zones.map((z) => ({
      name: z.code,
      target: z.monthlyTargetMT,
      actual: z.actualProductionMT,
      shortfall: z.shortfallMT,
      risk: z.riskScore,
    }));
    const avg = {
      avgShortfall: Math.round(zones.reduce((s, z) => s + z.shortfallPct, 0) / zones.length * 10) / 10,
      avgRisk: Math.round(zones.reduce((s, z) => s + z.riskScore, 0) / zones.length),
    };
    return { chartData, avg };
  }, [zones]);
}
