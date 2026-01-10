const express = require('express');
const cors = require('cors');
const winston = require('winston');

const app = express();
const PORT = 5000;

// Logger Setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

app.use(cors());
app.use(express.json());

// Health Check Endpoint for DevOps Monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// API Endpoints
app.get('/api/todos', (req, res) => {
  logger.info('Fetching todos');
  res.json([{ id: 1, task: 'Finalize Deployment Guide', completed: false }]);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});