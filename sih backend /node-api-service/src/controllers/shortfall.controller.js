const shortfallService = require('../services/shortfall.service');

exports.predictShortfall = async (req, res, next) => {
  try {
    const { pit_name, rainfall_mm, active_dumpers, active_excavators } = req.body;
    if (!pit_name || rainfall_mm === undefined || active_dumpers === undefined || active_excavators === undefined) {
      return res.status(400).json({ success: false, error: "Missing required operational parameters." });
    }
    const result = await shortfallService.assessShortfall(req.body);
    return res.json({ success: true, assessment: result });
  } catch (err) {
    next(err);
  }
};