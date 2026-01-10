const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const morgan = require('morgan');

const app = express();
const PORT = 5000;

// Middleware for QA & Monitoring (Phase 4)
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logging for debugging

// Database Setup
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE todos (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT, completed BOOLEAN, priority TEXT)");
    db.run("INSERT INTO todos (task, completed, priority) VALUES ('System Integration Test', 0, 'High')");
});

// API Endpoints
app.get('/api/todos', (req, res) => {
    db.all("SELECT * FROM todos", [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database Error' });
        res.json(rows);
    });
});

app.post('/api/todos', (req, res) => {
    const { task, priority } = req.body;
    if (!task) return res.status(400).json({ error: 'Task is required' });
    
    db.run("INSERT INTO todos (task, completed, priority) VALUES (?, ?, ?)", [task, 0, priority || 'Medium'], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, task, completed: 0, priority });
    });
});

// Error Boundary Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ status: 'error', message: 'Something broke!' });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Backend running on http://localhost:${PORT}`);
    });
}

module.exports = app;