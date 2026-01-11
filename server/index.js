const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Socket.io 설정
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React 클라이언트 주소
    methods: ["GET", "POST"]
  }
});

// 인메모리 데이터 (DB 대용)
let menuItems = [
  { id: 1, restaurant: '김밥천국', menu: '라볶이 세트', note: '가성비 최고', votes: 2 },
  { id: 2, restaurant: '서브웨이', menu: '이탈리안 비엠티', note: '다이어트 중이라면...', votes: 5 },
];

// 마감 시간 (서버 시작 + 1시간으로 가정)
let deadline = new Date(Date.now() + 60 * 60 * 1000).toISOString();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // 1. 초기 데이터 전송
  socket.emit('init_data', { menuItems, deadline });

  // 2. 새 메뉴 등록
  socket.on('add_menu', (data) => {
    const newMenu = {
      id: Date.now(),
      restaurant: data.restaurant,
      menu: data.menu,
      note: data.note || '',
      votes: 0
    };
    menuItems.push(newMenu);
    // 모든 클라이언트에게 전파
    io.emit('menu_added', newMenu);
  });

  // 3. 투표하기
  socket.on('vote', (id) => {
    menuItems = menuItems.map(item => {
      if (item.id === id) {
        return { ...item, votes: item.votes + 1 };
      }
      return item;
    });
    // 업데이트 된 전체 리스트 혹은 변경된 항목만 전송 (여기선 전체 전송)
    io.emit('vote_update', menuItems);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});