const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// SQLite Database setup (Local Demo Mode)
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, is_completed BOOLEAN)");
    db.run("INSERT INTO todos (title, content, is_completed) VALUES ('Build Architecture', 'Design DB and API', 1)");
    db.run("INSERT INTO todos (title, content, is_completed) VALUES ('Implement UI/UX', 'Create Wireframes', 0)");
});

// REST API Endpoints
app.get('/api/todos', (req, res) => {
    db.all("SELECT * FROM todos", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/todos', (req, res) => {
    const { title, content } = req.body;
    db.run("INSERT INTO todos (title, content, is_completed) VALUES (?, ?, ?)", [title, content, 0], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, title, content });
    });
});

app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
});