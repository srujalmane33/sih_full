import { RISK_LEVELS } from '../config/riskLevels.config';

export function getRiskColor(levelOrScore) {
  if (typeof levelOrScore === 'string') {
    const key = levelOrScore.toUpperCase();
    return RISK_LEVELS[key]?.color || '#94a3b8';
  }
  const score = Number(levelOrScore) || 0;
  if (score >= 81) return RISK_LEVELS.CRITICAL.color;
  if (score >= 61) return RISK_LEVELS.HIGH.color;
  if (score >= 31) return RISK_LEVELS.MEDIUM.color;
  return RISK_LEVELS.LOW.color;
}

export function getRiskBadgeClasses(level) {
  const key = (level || 'LOW').toUpperCase();
  const cfg = RISK_LEVELS[key] || RISK_LEVELS.LOW;
  return `${cfg.badgeBg} ${cfg.badgeBorder} ${cfg.badgeText}`;
}

export function getGradeQualityColor(gradePct) {
  if (gradePct >= 44) return '#10b981'; // High-grade
  if (gradePct >= 38) return '#38bdf8'; // Medium-grade
  return '#f59e0b'; // Low/ferro-grade
}
