let PitLogModel;
try {
  const mongoose = require('mongoose');
  const pitLogSchema = new mongoose.Schema({
    pitName: { type: String, required: true },
    rainfallMm: { type: Number, required: true },
    activeDumpers: { type: Number, required: true },
    activeExcavators: { type: Number, required: true },
    blastingDelayed: { type: Boolean, default: false },
    shortfallProbability: { type: Number, required: true },
    riskLevel: { type: String, required: true },
    recommendedAction: { type: String, required: true },
    loggedAt: { type: Date, default: Date.now }
  });
  PitLogModel = mongoose.models.PitLog || mongoose.model('PitLog', pitLogSchema);
} catch (e) {
  PitLogModel = {
    create: async () => Promise.resolve({})
  };
}

module.exports = PitLogModel;