const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'todos.json');

app.use(cors());
app.use(bodyParser.json());

// Initial Data helper
const readTodos = () => {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE));
};

const writeTodos = (todos) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
};

// CRUD Routes
app.get('/api/todos', (req, res) => {
  res.json(readTodos());
});

app.post('/api/todos', (req, res) => {
  const { title, priority } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  
  const todos = readTodos();
  const newTodo = {
    id: uuidv4(),
    title,
    priority: priority || 'Medium',
    completed: false,
    createdAt: new Date().toISOString()
  };
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});

app.patch('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const todos = readTodos();
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  todos[index] = { ...todos[index], ...req.body };
  writeTodos(todos);
  res.json(todos[index]);
});

app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  let todos = readTodos();
  todos = todos.filter(t => t.id !== id);
  writeTodos(todos);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});