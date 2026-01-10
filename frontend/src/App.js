import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [status, setStatus] = useState('Checking Backend...');

  useEffect(() => {
    axios.get('http://localhost:5000/api/todos')
      .then(res => {
        setTodos(res.data);
        setStatus('Connected to Backend');
      })
      .catch(err => setStatus('Backend Offline'));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Smart Todo Admin Dashboard</h1>
      <p>System Status: <strong>{status}</strong></p>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.task}</li>
        ))}
      </ul>
      <div style={{ marginTop: '50px', border: '1px solid #ccc', padding: '10px' }}>
        <h3>Operator Tools</h3>
        <button onClick={() => alert('Simulating Log Export...')}>Export Logs</button>
      </div>
    </div>
  );
}

export default App;