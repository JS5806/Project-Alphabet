import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RealTimeForecaster = () => {
  const [feedback, setFeedback] = useState({});

  // Fetch real-time sales vs predictions
  const { data, isLoading } = useQuery('fieldData', async () => {
    const res = await fetch('/api/v1/forecast/comparison');
    return res.json();
  }, { refetchInterval: 5000 });

  const mutation = useMutation(newFeedback => {
    return fetch('/api/v1/feedback', {
      method: 'POST',
      body: JSON.stringify(newFeedback),
      headers: { 'Content-Type': 'application/json' }
    });
  });

  const handleFeedback = (sku, status) => {
    mutation.mutate({ sku, status, timestamp: new Date().toISOString() });
    setFeedback(prev => ({ ...prev, [sku]: status }));
  };

  if (isLoading) return <div>Loading Field Data...</div>;

  return (
    <div className="dashboard-container">
      <h2>Live Inventory Forecast vs. Actual Sales</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="actual" stroke="#8884d8" strokeWidth={3} />
          <Line type="monotone" dataKey="predicted" stroke="#82ca9d" strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>

      <div className="feedback-section">
        <h3>Store Manager Feedback</h3>
        {data.slice(0, 5).map(item => (
          <div key={item.sku} className="feedback-row">
            <span>SKU: {item.sku} (Err: {Math.round(item.error * 100)}%)</span>
            <button onClick={() => handleFeedback(item.sku, 'Excess')}>Excessive</button>
            <button onClick={() => handleFeedback(item.sku, 'Optimal')}>Optimal</button>
            <button onClick={() => handleFeedback(item.sku, 'Insufficient')}>Insufficient</button>
            {feedback[item.sku] && <span> - Feedback Saved: {feedback[item.sku]}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealTimeForecaster;