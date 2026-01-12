require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const server = http.createServer(app);

// UX 포인트: 실시간 데이터 동기화를 위한 Socket.io 설정
const io = new Server(server, {
  cors: {
    origin: "*", // 실제 배포 시 클라이언트 도메인으로 제한 필요
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// --- MongoDB Schemas ---
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String }
});

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  votes: { type: Number, default: 0 },
  voters: [{ type: String }] // 중복 투표 방지용 (User IDs)
});

const User = mongoose.model('User', UserSchema);
const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

// --- DB Connection ---
// 로컬 MongoDB URI 또는 Mongo Atlas URI 사용
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lunch-vote';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// --- REST API (Auth & Initial Data) ---
const SECRET_KEY = "uxui_secret_key"; // 환경변수로 관리 권장

// 1. 회원가입
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ error: "Registration failed" });
  }
});

// 2. 로그인
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id, name: user.name }, SECRET_KEY);
    res.json({ token, name: user.name, userId: user._id });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// 3. 식당 등록 (Create)
app.post('/api/restaurants', async (req, res) => {
  try {
    const { name, description } = req.body;
    const newPlace = await Restaurant.create({ name, description });
    // UX: 데이터 변경 즉시 소켓 브로드캐스트
    const allPlaces = await Restaurant.find().sort({ votes: -1 });
    io.emit('update_data', allPlaces);
    res.status(201).json(newPlace);
  } catch (err) {
    res.status(500).json({ error: "Failed to add restaurant" });
  }
});

// --- Socket.io Real-time Logic ---
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // 초기 데이터 전송
  Restaurant.find().sort({ votes: -1 }).then(places => {
    socket.emit('update_data', places);
  });

  // 투표 액션 처리
  socket.on('vote', async ({ restaurantId, userId }) => {
    try {
      const place = await Restaurant.findById(restaurantId);
      if (!place) return;

      // 토글 로직 (이미 투표했으면 취소, 아니면 추가)
      const hasVoted = place.voters.includes(userId);
      
      if (hasVoted) {
        place.votes -= 1;
        place.voters = place.voters.filter(id => id !== userId);
      } else {
        place.votes += 1;
        place.voters.push(userId);
      }
      
      await place.save();

      // 전체 클라이언트 업데이트 (실시간 그래프 반영)
      const allPlaces = await Restaurant.find().sort({ votes: -1 });
      io.emit('update_data', allPlaces);
    } catch (err) {
      console.error("Voting error:", err);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));