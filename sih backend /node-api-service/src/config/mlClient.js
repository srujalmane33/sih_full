const axios = require('axios');
require('dotenv').config();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000/api/v1';

const mlClient = axios.create({
  baseURL: ML_SERVICE_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
});

module.exports = mlClient;