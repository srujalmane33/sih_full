const simulatorService = require('../services/simulator.service');

exports.predict = async (req, res, next) => {
  try {
    const { latitude, longitude, targetQuota, rainfall } = req.body;
    if (latitude === undefined || longitude === undefined || targetQuota === undefined || rainfall === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required simulator parameters (latitude, longitude, targetQuota, rainfall).',
      });
    }

    const result = await simulatorService.runSimulatorPrediction(req.body);
    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
