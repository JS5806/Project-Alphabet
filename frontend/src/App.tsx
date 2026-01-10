import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: '09:00', stock: 400, prediction: 450 },
  { name: '12:00', stock: 300, prediction: 380 },
  { name: '15:00', stock: 200, prediction: 320 },
  { name: '18:00', stock: 150, prediction: 500 },
];

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">SmartStore AI Optimizer</h1>
        <p className="text-gray-600">Real-time Inventory & Demand Analytics</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Demand Forecast vs. Current Stock</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="stock" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="prediction" stroke="#82ca9d" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">AI Recommendations</h2>
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 border-l-4 border-orange-500 text-orange-700">
              <p className="font-bold">Low Stock Alert: Fresh Milk</p>
              <p>Predicted demand will increase by 30% due to upcoming rain.</p>
            </div>
            <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              <p className="font-bold">Optimization: Beverage Section</p>
              <p>Current stock levels are sufficient for the weekend.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;