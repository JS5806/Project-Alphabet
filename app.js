{
  "name": "lunch-vote-system",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.0",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "ioredis": "^5.3.2",
    "jsonwebtoken": "^9.0.0",
    "pg": "^8.11.0",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.32.0",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^4.6.3",
    "axios": "^1.4.0"
  }
}
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASS=postgres
DB_NAME=lunch_db
JWT_SECRET=lunch_secret_key_1234
REDIS_HOST=localhost
REDIS_PORT=6379
COMPANY_DOMAIN=company.com
KAKAO_API_KEY=your_kakao_rest_api_key
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

redis.on('connect', () => console.log('Redis Connected'));
redis.on('error', (err) => console.error('Redis Error:', err));

module.exports = redis;
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lunch Voting API',
      version: '1.0.0',
      description: 'API for Lunch Voting System with Redis & Maps',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

module.exports = swaggerJsdoc(options);
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

module.exports = User;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Restaurant = sequelize.define('Restaurant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING, // e.g., 'KOREAN', 'CHINESE'
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  weight: {
    type: DataTypes.INTEGER, // Recommendation weight
    defaultValue: 1
  }
}, {
  timestamps: true
});

module.exports = Restaurant;
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
const axios = require('axios');
require('dotenv').config();

// 실제 구현 시 Kakao/Naver API 호출. 현재는 Mock 처리
exports.getCoordinates = async (address) => {
  try {
    /* 
    // Example Kakao Local API Logic
    const response = await axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
      headers: { Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}` },
      params: { query: address }
    });
    const { x, y } = response.data.documents[0];
    return { lat: parseFloat(y), lng: parseFloat(x) };
    */
    
    // Mock Return
    console.log(`[Map API] Fetching coords for: ${address}`);
    return { lat: 37.5665 + (Math.random() * 0.01), lng: 126.9780 + (Math.random() * 0.01) };
  } catch (error) {
    console.error('Map API Error:', error);
    throw new Error('Failed to fetch coordinates');
  }
};
const redis = require('../config/redis');

class VoteService {
  constructor() {
    this.prefix = 'vote:' + new Date().toISOString().split('T')[0]; // Daily key: vote:2023-10-27
  }

  async castVote(userId, restaurantId) {
    const userKey = `${this.prefix}:users`;
    const scoreKey = `${this.prefix}:scores`;

    // Redis Transaction: Check duplicate -> Increment
    // Watch userKey to prevent race conditions
    await redis.watch(userKey);
    
    const hasVoted = await redis.sismember(userKey, userId);
    
    if (hasVoted) {
      await redis.unwatch();
      throw new Error('User has already voted today');
    }

    const pipeline = redis.multi();
    pipeline.sadd(userKey, userId);
    pipeline.zincrby(scoreKey, 1, restaurantId);
    
    const results = await pipeline.exec();
    
    if (!results) {
      throw new Error('Transaction failed, try again');
    }
    return true;
  }

  async getRanking() {
    const scoreKey = `${this.prefix}:scores`;
    // Get top 5 restaurants
    const ranking = await redis.zrevrange(scoreKey, 0, 4, 'WITHSCORES');
    
    // Formatting Redis ZSET result [id, score, id, score...]
    const formatted = [];
    for (let i = 0; i < ranking.length; i += 2) {
      formatted.push({ restaurantId: ranking[i], votes: parseInt(ranking[i+1]) });
    }
    return formatted;
  }
}

module.exports = new VoteService();
const Restaurant = require('../models/restaurant');
const mapService = require('../services/mapService');
const { Op } = require('sequelize');

exports.createRestaurant = async (req, res) => {
  try {
    const { name, category, address } = req.body;
    
    // Fetch coordinates from Map API
    const { lat, lng } = await mapService.getCoordinates(address);

    const restaurant = await Restaurant.create({
      name,
      category,
      address,
      latitude: lat,
      longitude: lng
    });

    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.recommend = async (req, res) => {
  try {
    const { category } = req.query;
    const whereClause = category ? { category } : {};
    
    const restaurants = await Restaurant.findAll({ where: whereClause });
    
    if (restaurants.length === 0) return res.status(404).json({ message: 'No restaurants found' });

    // Weighted Random Algorithm
    let totalWeight = 0;
    restaurants.forEach(r => totalWeight += r.weight);

    let randomVal = Math.random() * totalWeight;
    let selected = null;

    for (const r of restaurants) {
      if (randomVal < r.weight) {
        selected = r;
        break;
      }
      randomVal -= r.weight;
    }

    res.json(selected || restaurants[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const { email, password, department } = req.body;

    // Domain Check
    const domain = email.split('@')[1];
    if (domain !== process.env.COMPANY_DOMAIN) {
      return res.status(400).json({ error: 'Invalid company domain' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, department });
    
    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const voteService = require('../services/voteService');

exports.vote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { restaurantId } = req.body;

    await voteService.castVote(userId, restaurantId);
    res.json({ message: 'Vote accepted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getResults = async (req, res) => {
  try {
    const results = await voteService.getRanking();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const restaurantController = require('../controllers/restaurantController');
const voteController = require('../controllers/voteController');
const authenticateToken = require('../middlewares/auth');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               department: { type: string }
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Add restaurant
 *     security: [{ bearerAuth: [] }]
 *     tags: [Restaurant]
 */
router.post('/restaurants', authenticateToken, restaurantController.createRestaurant);
router.get('/restaurants/recommend', authenticateToken, restaurantController.recommend);

/**
 * @swagger
 * /vote:
 *   post:
 *     summary: Cast a vote
 *     security: [{ bearerAuth: [] }]
 *     tags: [Vote]
 */
router.post('/vote', authenticateToken, voteController.vote);
router.get('/vote/results', authenticateToken, voteController.getResults);

module.exports = router;
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const sequelize = require('./config/database');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();

app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Sync DB and Start Server
const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
  });
}).catch(err => {
  console.error('Database connection failed:', err);
});