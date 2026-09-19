let BoreholeModel;
try {
  const mongoose = require('mongoose');
  const boreholeSchema = new mongoose.Schema({
    boreholeId: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    depthMeters: { type: Number, required: true },
    predictedMnGrade: { type: Number, required: true },
    gradeClass: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });
  BoreholeModel = mongoose.models.BoreholeRecord || mongoose.model('BoreholeRecord', boreholeSchema);
} catch (e) {
  BoreholeModel = {
    create: async () => Promise.resolve({})
  };
}

module.exports = BoreholeModel;