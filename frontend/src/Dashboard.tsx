import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [simulationWeight, setWeight] = useState(1.0);

  // Mock data fetching to represent real-time prediction updates
  useEffect(() => {
    const mockData = [
      { day: 'Mon', demand: 120, predicted: 130, stock: 400 },
      { day: 'Tue', demand: 150, predicted: 145, stock: 250 },
      { day: 'Wed', demand: 180, predicted: 190, stock: 70 },
      { day: 'Thu', demand: null, predicted: 210, stock: 50 },
      { day: 'Fri', demand: null, predicted: 180, stock: 30 },
    ];
    setData(mockData);
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">AI Order Forecast Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Forecast Chart */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
          <h2 className="text-lg mb-4">Demand vs Prediction Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="day" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{backgroundColor: '#222', border: 'none'}} />
              <Legend />
              <Line type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={3} dot={{r: 6}} />
              <Line type="monotone" dataKey="predicted" stroke="#10b981" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Simulation UI */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
          <h2 className="text-lg mb-4">Order Simulation (Price Fluctuation)</h2>
          <input 
            type="range" min="0.5" max="1.5" step="0.1" 
            value={simulationWeight} 
            onChange={(e) => setWeight(parseFloat(e.target.value))}
            className="w-full h-2 bg-blue-500 rounded-lg appearance-none cursor-pointer"
          />
          <div className="mt-4 flex justify-between text-sm text-gray-400">
            <span>Low Price (Stockpile)</span>
            <span>High Price (Conserve)</span>
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-400">Adjusted Recommended Order:</p>
            <p className="text-4xl font-mono text-green-400">{(250 * simulationWeight).toFixed(0)} units</p>
          </div>
        </div>
      </div>

      {/* Anomaly Alert Section */}
      {data.some(d => d.stock < 100) && (
        <div className="mt-6 p-4 bg-red-900/50 border border-red-500 rounded-lg animate-pulse">
          <p className="text-red-200 font-bold font-sans">⚠️ CRITICAL: Stock levels for 'Product_A' falling below safety threshold on Wednesday.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;