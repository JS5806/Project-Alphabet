const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory data for demo purposes (Phase 3 implementation)
let todos = [
  { id: 1, title: 'Project Kickoff', completed: true, priority: 'High' },
  { id: 2, title: 'Develop Smart Todo UI', completed: false, priority: 'Medium' }
];

// API Endpoints
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const newTodo = { id: Date.now(), ...req.body, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.filter(t => t.id !== parseInt(id));
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});