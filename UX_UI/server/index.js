const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Socket.io 설정 (CORS 허용)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// 메모리 데이터 저장소 (DB 대용)
let restaurants = [
  { id: 1, name: "스시 오마카세", category: "Japanese", votes: 12 },
  { id: 2, name: "매운 갈비찜", category: "Korean", votes: 8 },
  { id: 3, name: "수제 버거", category: "Western", votes: 5 },
  { id: 4, name: "마라탕", category: "Chinese", votes: 15 },
];

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // 1. 초기 데이터 전송
  socket.emit('init_data', restaurants);

  // 2. 투표 이벤트 처리
  socket.on('vote', (restaurantId) => {
    // 서버 데이터 업데이트
    restaurants = restaurants.map((r) => 
      r.id === restaurantId ? { ...r, votes: r.votes + 1 } : r
    );
    // 모든 클라이언트에게 최신 데이터 브로드캐스트
    io.emit('update_data', restaurants);
  });

  // 3. 식당 추가 이벤트 처리
  socket.on('add_restaurant', (newRestaurant) => {
    const restaurant = {
      id: Date.now(),
      name: newRestaurant.name,
      category: newRestaurant.category,
      votes: 0
    };
    restaurants.push(restaurant);
    io.emit('update_data', restaurants);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING ON PORT 3001");
});