import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/todos', newTodo);
      setNewTodo({ title: '', content: '' });
      fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Smart Todo System</h1>
          <p className="text-gray-600">Phase 2: System Architecture & UI Prototype</p>
        </header>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Todo</h2>
          <form onSubmit={addTodo} className="space-y-4">
            <input 
              className="w-full p-2 border rounded" 
              placeholder="Title" 
              value={newTodo.title}
              onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
            />
            <textarea 
              className="w-full p-2 border rounded" 
              placeholder="Content" 
              value={newTodo.content}
              onChange={(e) => setNewTodo({...newTodo, content: e.target.value})}
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create Task</button>
          </form>
        </div>

        <div className="grid gap-4">
          {todos.map(todo => (
            <div key={todo.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500 flex justify-between items-center">
              <div>
                <h3 className="font-bold">{todo.title}</h3>
                <p className="text-sm text-gray-500">{todo.content}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${todo.is_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {todo.is_completed ? 'Completed' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;