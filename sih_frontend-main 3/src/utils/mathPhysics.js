/**
 * Mining Physics & Shortfall Penalty Computation Engine
 * SIH 2026 Problem Statement 26009 - Manganese Intelligence
 */

export const STANDARD_HOURS_PER_MONTH = 720; // 30 days * 24 hours
export const RAINFALL_DRAINAGE_THRESHOLD_MM = 25.0; // mm before pit/bench runoff saturates
export const BASELINE_ROCK_HARDNESS_MOHS = 5.0; // Braunite benchmark hardness

/**
 * Calculates shortfall penalties and projected production based on environmental
 * and operational parameters.
 */
export function calculateShortfallPhysics({
  targetProductionMT = 25000,
  rainfallMm = 0,
  downtimeHours = 0,
  rockHardnessMohs = 5.0,
  blastingDelayDays = 0,
  mineType = 'Opencast',
}) {
  const target = Math.max(1000, Number(targetProductionMT) || 25000);
  const rain = Math.max(0, Number(rainfallMm) || 0);
  const downtime = Math.max(0, Number(downtimeHours) || 0);
  const hardness = Math.max(1.0, Math.min(10.0, Number(rockHardnessMohs) || 5.0));
  const blastingDelay = Math.max(0, Number(blastingDelayDays) || 0);

  // 1. Downtime Shortfall: Direct mechanical / electrical stoppage
  // Opencast: 1.15 multiplier due to ripple effect on shovels & dumpers
  // Underground: 1.30 multiplier due to shaft hoisting bottleneck
  const downtimeFactor = mineType === 'Underground' ? 1.3 : 1.15;
  const downtimeLossRatio = Math.min(0.85, (downtime / STANDARD_HOURS_PER_MONTH) * downtimeFactor);
  const downtimePenaltyMT = Math.round(target * downtimeLossRatio);

  // 2. Moisture / Rainfall Shortfall:
  // Excess water above threshold causes pit slurry, traction loss, slope creep, and sump pumping overhead
  const rainExcess = Math.max(0, rain - RAINFALL_DRAINAGE_THRESHOLD_MM);
  const moistureCoeff = mineType === 'Opencast' ? 0.0032 : 0.0024;
  const moistureLossRatio = Math.min(0.4, rainExcess * moistureCoeff);
  const moisturePenaltyMT = Math.round(target * moistureLossRatio);

  // 3. Rock Hardness (Mohs) Fragmentation Penalty:
  // Above 5.0 Mohs, explosive powder factor must increase; crushing throughput drops non-linearly
  const hardnessDelta = Math.max(0, hardness - BASELINE_ROCK_HARDNESS_MOHS);
  const hardnessLossRatio = Math.min(0.35, Math.pow(hardnessDelta, 1.25) * 0.095);
  const rockHardnessPenaltyMT = Math.round(target * hardnessLossRatio);

  // 4. Blasting Cycle Delay:
  // Each day of delayed blast stalls advance face development
  const blastingLossRatio = Math.min(0.25, (blastingDelay / 30) * 0.85);
  const blastingPenaltyMT = Math.round(target * blastingLossRatio);

  // Total Projected Shortfall (with dampening interaction factor)
  const rawSum = downtimePenaltyMT + moisturePenaltyMT + rockHardnessPenaltyMT + blastingPenaltyMT;
  const netShortfallMT = Math.min(target * 0.95, Math.round(rawSum));
  const projectedOutputMT = Math.max(0, target - netShortfallMT);
  const shortfallPct = Number(((netShortfallMT / target) * 100).toFixed(1));

  // Derive dynamic risk score (0 - 100)
  const riskScore = Math.min(100, Math.round(shortfallPct * 2.8 + (rain > 70 ? 15 : 0) + (downtime > 40 ? 15 : 0)));

  let riskLevel = 'LOW';
  if (riskScore >= 81) riskLevel = 'CRITICAL';
  else if (riskScore >= 61) riskLevel = 'HIGH';
  else if (riskScore >= 31) riskLevel = 'MEDIUM';

  // Feature contribution breakdown (percentages for SHAP-style charts)
  const totalRaw = Math.max(1, downtimePenaltyMT + moisturePenaltyMT + rockHardnessPenaltyMT + blastingPenaltyMT);
  const contributions = [
    { name: 'Equipment Downtime', value: downtimePenaltyMT, percentage: Math.round((downtimePenaltyMT / totalRaw) * 100), color: '#ef4444' },
    { name: 'Moisture / Rainfall', value: moisturePenaltyMT, percentage: Math.round((moisturePenaltyMT / totalRaw) * 100), color: '#38bdf8' },
    { name: 'Rock Hardness (Mohs)', value: rockHardnessPenaltyMT, percentage: Math.round((rockHardnessPenaltyMT / totalRaw) * 100), color: '#f59e0b' },
    { name: 'Blasting Cycle Delay', value: blastingPenaltyMT, percentage: Math.round((blastingPenaltyMT / totalRaw) * 100), color: '#a855f7' },
  ];

  return {
    targetProductionMT: target,
    projectedOutputMT,
    netShortfallMT,
    shortfallPct,
    riskScore,
    riskLevel,
    penalties: {
      downtimePenaltyMT,
      moisturePenaltyMT,
      rockHardnessPenaltyMT,
      blastingPenaltyMT,
    },
    contributions,
  };
}
