import React, { useState, useEffect } from 'react';
import { CheckCircle, Trash2, PlusCircle } from 'lucide-react';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/todos')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!input) return;
    const response = await fetch('http://localhost:5000/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: input, priority: 'Medium' })
    });
    const newTodo = await response.json();
    setTodos([...todos, newTodo]);
    setInput('');
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:5000/api/todos/${id}`, { method: 'DELETE' });
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Smart Todo Management</h1>
        
        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input 
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
            <PlusCircle size={24} />
          </button>
        </form>

        <div className="space-y-3">
          {todos.map(todo => (
            <div key={todo.id} className="flex items-center justify-between p-3 border-b border-gray-50 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className={todo.completed ? "text-green-500" : "text-gray-300"} />
                <span className={todo.completed ? "line-through text-gray-400" : "text-gray-700"}>{todo.title}</span>
              </div>
              <button onClick={() => deleteTodo(todo.id)} className="text-red-400 hover:text-red-600">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;