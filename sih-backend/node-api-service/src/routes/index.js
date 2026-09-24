const express = require('express');
const router = express.Router();

const reserveRoutes = require('./reserve.routes');
const shortfallRoutes = require('./shortfall.routes');
const authRoutes = require('./auth.routes');
const simulatorRoutes = require('./simulator.routes');

router.use('/auth', authRoutes);
router.use('/reserves', reserveRoutes);
router.use('/shortfalls', shortfallRoutes);
router.use('/simulator', simulatorRoutes);

module.exports = router;