const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads folder if not exists
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');

// Mock Data
let userData = {
    id: 1,
    username: 'dev_hero',
    nickname: 'CodingKing',
    bio: 'Fullstack developer exploring the world.',
    profile_image_url: 'https://via.placeholder.com/150'
};

// File Upload Config
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// API Endpoints
app.get('/api/v1/users/me', (req, res) => {
    res.json(userData);
});

app.patch('/api/v1/users/me', upload.single('profileImage'), (req, res) => {
    const { nickname, bio } = req.body;
    
    // Nickname conflict check (mock)
    if (nickname === 'taken') {
        return res.status(409).json({ message: 'Nickname already in use' });
    }

    if (nickname) userData.nickname = nickname;
    if (bio) userData.bio = bio;
    if (req.file) {
        userData.profile_image_url = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    }

    res.json({ message: 'Update successful', user: userData });
});

app.listen(PORT, () => {
    console.log(`Backend Server running at http://localhost:${PORT}`);
});