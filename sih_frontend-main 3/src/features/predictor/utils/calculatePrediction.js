/**
 * ML Production & Risk Prediction Calculation Engine
 * 
 * Computes estimated manganese production, shortfall risk, reserve confidence,
 * feature importance drivers, and prescriptive action recommendations
 * based on geological, equipment, and environmental metrics.
 */

export function calculatePrediction(formData) {
  const targetQuota = Math.max(1, Number(formData.targetQuota) || 40000);
  const rainfall = Math.max(0, Number(formData.rainfall) || 85);
  const soilMoisture = Math.max(0, Number(formData.soilMoisture) || 62);
  const equipmentDowntime = Math.max(0, Number(formData.equipmentDowntime) || 16);
  const ndvi = Math.max(0, Math.min(1, Number(formData.ndvi) || 0.38));
  
  // Parse rock hardness numeric value from string (e.g., "6 - Medium Hard" -> 6)
  let rockHardness = 6;
  if (typeof formData.rockHardness === 'string') {
    const match = formData.rockHardness.match(/\d+/);
    if (match) rockHardness = Number(match[0]);
  } else if (typeof formData.rockHardness === 'number') {
    rockHardness = formData.rockHardness;
  }

  // 1. Calculate Feature Importance Penalties and Boosts
  // Default values: downtime=16 -> 55%, moisture=62 -> 16%, rainfall=85 -> 21%, ndvi=0.38 -> 15%
  const downtimePenalty = Math.min(95, Math.max(5, Math.round((equipmentDowntime / 16) * 55)));
  const moisturePenalty = Math.min(60, Math.max(4, Math.round((soilMoisture / 62) * 16)));
  const rainfallPenalty = Math.min(70, Math.max(5, Math.round((rainfall / 85) * 21)));
  const ndviBoost = Math.min(40, Math.max(2, Math.round((ndvi / 0.38) * 15)));

  // Rock hardness effect: base is 6 (0 effect)
  const rockHardnessFactor = (rockHardness - 6) * 2.5;

  // Net production reduction percentage
  // At defaults: (55 * 0.45 = 24.75) + (21 * 0.25 = 5.25) + (16 * 0.20 = 3.20) - (15 * 0.113 = 1.70) = 31.5%
  const calculatedReductionPct =
    (downtimePenalty * 0.45) +
    (rainfallPenalty * 0.25) +
    (moisturePenalty * 0.20) +
    rockHardnessFactor -
    (ndviBoost * 0.1133);

  const shortfallPct = Number(Math.max(2, Math.min(85, calculatedReductionPct)).toFixed(1));
  const predictedProduction = Math.round(targetQuota * (1 - shortfallPct / 100));
  const shortfallTons = Math.max(0, targetQuota - predictedProduction);

  // Shortfall Risk Level
  let shortfallRisk = 'LOW';
  if (shortfallPct >= 28) {
    shortfallRisk = 'HIGH';
  } else if (shortfallPct >= 14) {
    shortfallRisk = 'MEDIUM';
  }

  // Reserve Score Calculation: (at 31.5% reduction -> 77%)
  const reserveScore = Math.max(35, Math.min(98, Math.round(100 - (shortfallPct * 0.73))));
  let reserveConfidence = 'HIGH Confidence';
  if (reserveScore < 60) {
    reserveConfidence = 'LOW Confidence';
  } else if (reserveScore < 75) {
    reserveConfidence = 'MODERATE Confidence';
  }

  // 2. Feature Importance Array
  const featureImportance = [
    {
      name: 'Equipment Downtime',
      impactType: 'penalty',
      value: -downtimePenalty,
      display: `-${downtimePenalty}% penalty`,
      progress: downtimePenalty,
      color: 'danger',
    },
    {
      name: 'Soil Saturation & Moisture',
      impactType: 'penalty',
      value: -moisturePenalty,
      display: `-${moisturePenalty}% penalty`,
      progress: moisturePenalty,
      color: 'danger',
    },
    {
      name: 'Monsoon Rainfall',
      impactType: 'penalty',
      value: -rainfallPenalty,
      display: `-${rainfallPenalty}% penalty`,
      progress: rainfallPenalty,
      color: 'danger',
    },
    {
      name: 'Vegetation Index (NDVI)',
      impactType: 'boost',
      value: ndviBoost,
      display: `+${ndviBoost}% boost`,
      progress: ndviBoost,
      color: 'boost',
    },
  ];

  // 3. Dynamic Prescriptive Action Plan
  const actionPlan = [
    soilMoisture > 50
      ? `High soil moisture alert: Inspect slope drainage and reinforce haul road gravel.`
      : `Soil stability optimal: Maintain standard routine drainage channels.`,
    equipmentDowntime > 8
      ? `Equipment downtime warning (${equipmentDowntime}h): Deploy mobile maintenance rig for hydraulic servicing.`
      : `Fleet mechanics stable: Equipment operating within normal 8h window.`,
    shortfallPct > 20
      ? `Critical ${shortfallPct}% shortfall predicted: Reallocate ${Math.round(shortfallTons / 1000)}K tons quota to auxiliary bench.`
      : `Production rate stable: Project on track to meet ${Math.round(targetQuota / 1000)}K tons target.`,
  ];

  return {
    predictedProduction,
    predictedProductionFormatted: `${(predictedProduction / 1000).toFixed(1)}K T`,
    targetQuotaFormatted: `${Math.round(targetQuota / 1000)}K T`,
    shortfallPercentage: shortfallPct,
    shortfallRisk,
    reserveScore,
    reserveConfidence,
    featureImportance,
    actionPlan,
    computedAt: new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
  };
}
