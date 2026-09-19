const shortfallService = require('../services/shortfall.service');

exports.getOptimizationRecommendations = async (req, res, next) => {
  try {
    const recommendations = await shortfallService.prescribeActions(req.body);
    return res.json({ success: true, recommendations });
  } catch (err) {
    next(err);
  }
};