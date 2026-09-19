const mlClient = require('../config/mlClient');
const PitLog = require('../models/PitLog');
const logger = require('../utils/logger');

exports.assessShortfall = async (opsData) => {
  const { pit_name, rainfall_mm, active_dumpers, active_excavators, water_logging_hours, blasting_delayed } = opsData;

  const { data } = await mlClient.post('/predict-shortfall', {
    pit_name,
    rainfall_mm: parseFloat(rainfall_mm),
    water_logging_hours: water_logging_hours !== undefined ? parseFloat(water_logging_hours) : 0.0,
    active_dumpers: parseInt(active_dumpers, 10),
    active_excavators: parseInt(active_excavators, 10),
    blasting_delayed: Boolean(blasting_delayed)
  });

  // Optional async DB persist
  PitLog.create({
    pitName: pit_name,
    rainfallMm: rainfall_mm,
    activeDumpers: active_dumpers,
    activeExcavators: active_excavators,
    blastingDelayed: Boolean(blasting_delayed),
    shortfallProbability: data.shortfall_probability,
    riskLevel: data.risk_level,
    recommendedAction: data.recommended_action
  }).catch(err => logger.warn("DB save skipped:", err.message));

  return data;
};

exports.prescribeActions = async (params) => {
  const { data } = await mlClient.post('/prescribe-actions', params);
  return data;
};