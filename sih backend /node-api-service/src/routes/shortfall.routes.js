const express = require('express');
const router = express.Router();
const shortfallController = require('../controllers/shortfall.controller');
const optimizationController = require('../controllers/optimization.controller');

router.post('/assess', shortfallController.predictShortfall);
router.post('/prescribe', optimizationController.getOptimizationRecommendations);

module.exports = router;