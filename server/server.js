const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/lunch-vote', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected')).catch(err => console.error(err));

// --- Socket.io Logic ---
io.on('connection', (socket) => {
  console.log('User connected');
  
  // 초기 데이터 전송
  const sendRestaurants = async () => {
    const list = await Restaurant.find().sort({ votes: -1 });
    io.emit('update-list', list);
  };
  
  socket.on('request-list', sendRestaurants);
});

// --- API Routes ---

// 1. Auth (Simple simulation)
app.post('/api/register', async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const user = new User({ email, password, username });
    await user.save();
    res.json({ success: true, user: { id: user._id, username: user.username } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.json({ success: true, user: { id: user._id, username: user.username } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// 2. Restaurant CRUD & 3. Vote
app.post('/api/restaurants', async (req, res) => {
  try {
    const newRest = new Restaurant(req.body);
    await newRest.save();
    
    // 실시간 업데이트
    const list = await Restaurant.find().sort({ votes: -1 });
    io.emit('update-list', list);
    
    res.json(newRest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/restaurants/:id', async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    const list = await Restaurant.find().sort({ votes: -1 });
    io.emit('update-list', list);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vote Toggle Logic
app.post('/api/vote/:id', async (req, res) => {
  const { userId } = req.body;
  const restaurant = await Restaurant.findById(req.params.id);
  
  if (!restaurant) return res.status(404).send('Not found');

  const index = restaurant.votedBy.indexOf(userId);
  
  if (index === -1) {
    // 투표 (Vote)
    restaurant.votedBy.push(userId);
    restaurant.votes += 1;
  } else {
    // 투표 취소 (Unvote)
    restaurant.votedBy.splice(index, 1);
    restaurant.votes -= 1;
  }
  
  await restaurant.save();
  
  // Real-time broadcast
  const list = await Restaurant.find().sort({ votes: -1 });
  io.emit('update-list', list);
  
  res.json({ success: true });
});

server.listen(5000, () => console.log('Server running on port 5000'));