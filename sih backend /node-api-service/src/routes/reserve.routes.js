const express = require('express');
const router = express.Router();
const reserveController = require('../controllers/reserve.controller');

router.post('/estimate', reserveController.getReserveEstimation);

module.exports = router;