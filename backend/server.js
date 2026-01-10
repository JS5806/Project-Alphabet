const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const SECRET_KEY = 'quicklink_secret';

// Mock Data for Analytics
const analyticsData = {
  timeSeries: [
    { date: '2023-10-01', clicks: 400 },
    { date: '2023-10-02', clicks: 600 },
    { date: '2023-10-03', clicks: 800 },
    { date: '2023-10-04', clicks: 500 },
    { date: '2023-10-05', clicks: 1100 },
  ],
  devices: [
    { name: 'Mobile', value: 65 },
    { name: 'Desktop', value: 30 },
    { name: 'Tablet', value: 5 }
  ],
  users: [
    { id: 1, email: 'admin@quicklink.io', role: 'Admin', status: 'Active' },
    { id: 2, email: 'dev@quicklink.io', role: 'User', status: 'Active' },
    { id: 3, email: 'test@quicklink.io', role: 'User', status: 'Suspended' }
  ]
};

app.post('/api/login', (req, res) => {
  const { email } = req.body;
  const token = jwt.sign({ email, role: 'Admin' }, SECRET_KEY);
  res.json({ token, role: 'Admin', email });
});

app.get('/api/analytics', (req, res) => {
  res.json(analyticsData);
});

app.get('/api/export', (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=analytics.csv');
  res.status(200).send("Date,Clicks\n2023-10-01,400\n2023-10-02,600");
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));