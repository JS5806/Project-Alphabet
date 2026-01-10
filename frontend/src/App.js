import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [inventory, setInventory] = useState([
    { name: 'Product A', stock: 45, predicted: 60 },
    { name: 'Product B', stock: 12, predicted: 40 },
    { name: 'Product C', stock: 88, predicted: 70 },
  ]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">SmartStock AI Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl mb-4">Inventory vs Predictive Demand</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inventory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="stock" stroke="#8884d8" />
                <Line type="monotone" dataKey="predicted" stroke="#82ca9d" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl mb-4">AI Smart Recommendations</h2>
          <ul className="space-y-4">
            {inventory.filter(i => i.stock < i.predicted).map(item => (
              <li key={item.name} className="flex justify-between items-center p-3 bg-red-50 border-l-4 border-red-500">
                <span>{item.name} is low on stock.</span>
                <button className="bg-blue-600 text-white px-4 py-1 rounded">Order {item.predicted - item.stock} units</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;