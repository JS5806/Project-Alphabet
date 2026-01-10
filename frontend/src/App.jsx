import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Plus } from 'lucide-react';

function App() {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api/todos')
            .then(res => res.json())
            .then(data => setTodos(data))
            .catch(err => console.error('API Error:', err));
    }, []);

    const addTodo = async () => {
        if (!input) return;
        const res = await fetch('http://localhost:5000/api/todos', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task: input, priority: 'Medium' })
        });
        const newTodo = await res.json();
        setTodos([...todos, newTodo]);
        setInput('');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <header style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#2d3436' }}>Smart Todo - Phase 4</h1>
                <p style={{ color: '#636e72' }}>Integrated Testing & QA Environment</p>
            </header>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input 
                    style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #dfe6e9' }}
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add testing task..."
                />
                <button 
                    onClick={addTodo} 
                    style={{ padding: '10px 20px', background: '#0984e3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    <Plus size={20} />
                </button>
            </div>

            <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                {todos.map(todo => (
                    <div key={todo.id} style={{ padding: '15px', borderBottom: '1px solid #f1f2f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {todo.completed ? <CheckCircle color="green" /> : <AlertCircle color="#e17055" />}
                            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.task}</span>
                        </div>
                        <span style={{ fontSize: '12px', background: '#dfe6e9', padding: '2px 8px', borderRadius: '10px' }}>{todo.priority}</span>
                    </div>
                ))}
            </div>

            <footer style={{ marginTop: '30px', fontSize: '12px', color: '#b2bec3', textAlign: 'center' }}>
                Lighthouse Performance Goal: 90+ | Cross-Browser: Chrome, Safari, Edge, Mobile
            </footer>
        </div>
    );
}

export default App;