const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// Mock Sensor Data Generator
setInterval(() => {
    const data = {
        temp: (20 + Math.random() * 5).toFixed(2),
        humidity: (50 + Math.random() * 10).toFixed(2),
        timestamp: new Date().toISOString()
    };
    io.emit('sensor_data', data);
}, 2000);

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('control_device', (command) => {
        console.log('Control Command Received:', command);
        // In production, this would publish to an MQTT topic
        io.emit('device_status', { deviceId: command.id, status: command.action });
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`SmartFarm Backend running on port ${PORT}`);
});