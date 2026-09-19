/**
 * Rule-based Prescriptive Action Generator
 * Evaluates MOIL mine zones and simulation results against operational rule matrix
 */
export function generateRecommendations(zones = [], simResults = {}) {
  const actions = [];
  let id = 0;

  // Zone-specific rule evaluations
  zones.forEach((zone) => {
    const t = zone.telemetry || {};

    // R1: Critical rainfall saturation
    if (t.rainfall24h > 60) {
      actions.push({
        id: `rec-${++id}`,
        title: 'Deploy Emergency Dewatering Pumps',
        description: `Rainfall at ${zone.name} has reached ${t.rainfall24h} mm/24h. Activate auxiliary 150kW submersible dewatering units to prevent pit inundation and maintain sump levels.`,
        severity: t.rainfall24h > 100 ? 'CRITICAL' : 'HIGH',
        category: 'operational',
        targetZone: zone.code,
        impact: `Prevent ~${Math.round(t.rainfall24h * 50)} m³ flooding`,
        trigger: 'rainfall_saturation',
      });
    }

    // R2: Equipment downtime exceeding threshold
    if (t.equipmentDowntime > 30) {
      actions.push({
        id: `rec-${++id}`,
        title: 'Initiate Emergency Fleet Reallocation',
        description: `${zone.name} reporting ${t.equipmentDowntime} hours equipment downtime. Mobilize standby shovel-dumper combination from nearest low-risk zone.`,
        severity: t.equipmentDowntime > 50 ? 'CRITICAL' : 'HIGH',
        category: 'maintenance',
        targetZone: zone.code,
        impact: `Recover ~${Math.round(t.equipmentDowntime * 15)} MT/month`,
        trigger: 'equipment_downtime',
      });
    }

    // R3: Hard rock intrusion
    if (t.rockHardnessMohs > 6.0) {
      actions.push({
        id: `rec-${++id}`,
        title: 'Switch to Enhanced Drill Configuration',
        description: `Rock hardness at ${zone.name} detected at ${t.rockHardnessMohs} Mohs. Replace standard tri-cone bits with tungsten-carbide rotary drill rods. Adjust blast pattern burden from 3.0m to 2.4m.`,
        severity: t.rockHardnessMohs > 7.0 ? 'HIGH' : 'MEDIUM',
        category: 'operational',
        targetZone: zone.code,
        impact: `Improve fragmentation index by ~${Math.round((t.rockHardnessMohs - 5) * 12)}%`,
        trigger: 'hard_rock_intrusion',
      });
    }

    // R4: High groundwater inflow
    if (t.groundwaterInflow > 150) {
      actions.push({
        id: `rec-${++id}`,
        title: 'Activate Perimeter Grout Curtain',
        description: `Groundwater inflow at ${zone.name} is ${t.groundwaterInflow} m³/hr, exceeding safe operational limits. Commission perimeter grouting on north face.`,
        severity: 'HIGH',
        category: 'operational',
        targetZone: zone.code,
        impact: `Reduce inflow by ~40%`,
        trigger: 'groundwater_inflow',
      });
    }

    // R5: Shortfall exceeding threshold
    if (zone.shortfallPct > 20) {
      actions.push({
        id: `rec-${++id}`,
        title: 'Activate Supplementary Production Shift',
        description: `Production shortfall at ${zone.name} is ${zone.shortfallPct}%. Authorize third-shift extraction for 14 days to recover ${zone.shortfallMT} MT deficit.`,
        severity: 'CRITICAL',
        category: 'operational',
        targetZone: zone.code,
        impact: `Recover ${zone.shortfallMT} MT`,
        trigger: 'production_shortfall',
      });
    }

    // R6: Low haul road efficiency
    if (t.haulRoadTrafficIndex < 65) {
      actions.push({
        id: `rec-${++id}`,
        title: 'Haul Road Surface Remediation',
        description: `Haul road traffic index at ${zone.name} is ${t.haulRoadTrafficIndex}/100. Spread crushed aggregate ballast and grade ramp surface to restore dumper cycle times.`,
        severity: 'MEDIUM',
        category: 'maintenance',
        targetZone: zone.code,
        impact: `Improve cycle time by ~20%`,
        trigger: 'haul_road_degradation',
      });
    }
  });

  // Simulation-triggered rules
  if (simResults.shortfallPct > 30) {
    actions.push({
      id: `rec-${++id}`,
      title: 'Simulation Alert: Severe Shortfall Projected',
      description: `Current simulation parameters project ${simResults.shortfallPct}% shortfall (${simResults.netShortfallMT} MT). Recommend immediate review of all operational levers.`,
      severity: 'CRITICAL',
      category: 'operational',
      targetZone: 'ALL',
      impact: `Prevent ${simResults.netShortfallMT} MT loss`,
      trigger: 'simulation_alert',
    });
  }

  // Sort by severity priority
  const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  actions.sort((a, b) => (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3));

  return actions;
}
