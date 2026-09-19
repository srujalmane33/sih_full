export const RISK_LEVELS = {
  LOW: {
    id: 'LOW',
    label: 'Low Risk',
    minScore: 0,
    maxScore: 30,
    color: '#10b981', // Emerald 500
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeText: 'text-emerald-700',
    markerClass: 'radar-pulse-low',
    pulseSpeed: '3.5s',
    description: 'Operations optimal within standard variance limits.',
  },
  MEDIUM: {
    id: 'MEDIUM',
    label: 'Medium Risk',
    minScore: 31,
    maxScore: 60,
    color: '#f59e0b', // Amber 500
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200',
    badgeText: 'text-amber-700',
    markerClass: 'radar-pulse-medium',
    pulseSpeed: '2.8s',
    description: 'Elevated precipitation or localized equipment downtime detected.',
  },
  HIGH: {
    id: 'HIGH',
    label: 'High Risk',
    minScore: 61,
    maxScore: 80,
    color: '#f97316', // Orange 500
    badgeBg: 'bg-orange-50',
    badgeBorder: 'border-orange-200',
    badgeText: 'text-orange-700',
    markerClass: 'radar-pulse-high',
    pulseSpeed: '2.2s',
    description: 'Production shortfall exceeding 15%. Prescriptive mitigation advised.',
  },
  CRITICAL: {
    id: 'CRITICAL',
    label: 'Critical Risk',
    minScore: 81,
    maxScore: 100,
    color: '#ef4444', // Red 500
    badgeBg: 'bg-red-50',
    badgeBorder: 'border-red-200',
    badgeText: 'text-red-700',
    markerClass: 'radar-pulse-critical',
    pulseSpeed: '1.8s',
    description: 'Severe pit inundation, shaft fault, or acute production shortfall > 25%.',
  },
};

export const getRiskConfig = (levelOrScore) => {
  if (typeof levelOrScore === 'string') {
    const key = levelOrScore.toUpperCase();
    return RISK_LEVELS[key] || RISK_LEVELS.LOW;
  }
  const score = Number(levelOrScore) || 0;
  if (score >= 81) return RISK_LEVELS.CRITICAL;
  if (score >= 61) return RISK_LEVELS.HIGH;
  if (score >= 31) return RISK_LEVELS.MEDIUM;
  return RISK_LEVELS.LOW;
};
