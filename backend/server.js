const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Mock Database for Theme Preference (UI/UX Phase Requirement)
let userSettings = {
    theme: 'dark',
    contrast: 'high',
    font: 'Pretendard'
};

app.get('/api/settings', (req, res) => {
    res.json(userSettings);
});

app.post('/api/settings', (req, res) => {
    userSettings = { ...userSettings, ...req.body };
    res.json({ message: 'Settings updated successfully', settings: userSettings });
});

app.listen(PORT, () => {
    echo `Backend Logic Service running on http://localhost:${PORT}`;
});