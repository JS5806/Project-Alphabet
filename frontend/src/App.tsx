import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, CheckCircle, Circle, Plus, ListTodo } from 'lucide-react';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

const API_URL = 'http://localhost:5000/api/todos';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const res = await axios.post(API_URL, { title: input, priority: 'Medium' });
    setTodos([...todos, res.data]);
    setInput('');
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    await axios.patch(`${API_URL}/${id}`, { completed: !completed });
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !completed } : t));
  };

  const deleteTodo = async (id: string) => {
    await axios.delete(`${API_URL}/${id}`);
    setTodos(todos.filter(t => t.id !== id));
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 bg-indigo-600">
          <div className="flex items-center gap-3 text-white mb-6">
            <ListTodo size={32} />
            <h1 className="text-2xl font-bold">Smart Todo</h1>
          </div>
          
          <form onSubmit={addTodo} className="relative">
            <input 
              className="w-full py-3 px-4 rounded-xl outline-none pr-12"
              placeholder="What needs to be done?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-1.5 p-1.5 bg-indigo-500 text-white rounded-lg">
              <Plus size={24} />
            </button>
          </form>
        </div>

        <div className="flex border-b">
          {(['all', 'active', 'completed'] as const).map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                filter === f ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <ul className="divide-y">
          {filteredTodos.map(todo => (
            <li key={todo.id} className="flex items-center gap-3 p-4 hover:bg-slate-50 group">
              <button onClick={() => toggleTodo(todo.id, todo.completed)}>
                {todo.completed ? 
                  <CheckCircle className="text-green-500" /> : 
                  <Circle className="text-gray-300" />
                }
              </button>
              <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {todo.title}
              </span>
              <button 
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
          {filteredTodos.length === 0 && (
            <li className="p-8 text-center text-gray-400 italic">No tasks found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}