const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const apiRoutes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5001;


// Initialize DB (optional, will warn and bypass if not running)
connectDB();

// Enable CORS for all origins, methods, and headers
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Base health route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'node-api-gateway' });
});

// Aggregate API routers: /api/v1/auth, /api/v1/reserves, /api/v1/shortfalls, /api/v1/simulator
app.use('/api/v1', apiRoutes);

// Error middleware
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Node API Gateway listening on port ${PORT}`);
});