const express = require('express');
const router = express.Router();
const simulatorController = require('../controllers/simulator.controller');

router.post('/predict', simulatorController.predict);

module.exports = router;
