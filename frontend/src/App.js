import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Thermometer, Droplets, Power, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const socket = io('http://localhost:5000');

function App() {
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState({ temp: 0, humidity: 0 });
  const [pumpStatus, setPumpStatus] = useState(false);

  useEffect(() => {
    socket.on('sensor_data', (payload) => {
      setCurrent(payload);
      setData(prev => [...prev.slice(-10), { time: payload.timestamp.split('T')[1].split('.')[0], temp: parseFloat(payload.temp) }]);
    });
    return () => socket.off('sensor_data');
  }, []);

  const togglePump = () => {
    const action = !pumpStatus ? 'ON' : 'OFF';
    socket.emit('control_device', { id: 'PUMP_01', action });
    setPumpStatus(!pumpStatus);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1>SmartFarm Integrated Control System</h1>
        <p>Phase 1: Real-time Monitoring Architecture Prototype</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Thermometer color="#e53e3e" />
            <h3>Temperature</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{current.temp}°C</p>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Droplets color="#3182ce" />
            <h3>Humidity</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{current.humidity}%</p>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <Power color={pumpStatus ? '#48bb78' : '#718096'} />
            <h3>Water Pump</h3>
          </div>
          <button 
            onClick={togglePump}
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '8px', 
              border: 'none', 
              backgroundColor: pumpStatus ? '#f56565' : '#48bb78', 
              color: 'white', 
              cursor: 'pointer', 
              fontWeight: 'bold'
            }}
          >
            {pumpStatus ? 'STOP PUMP' : 'START PUMP'}
          </button>
        </div>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', height: '400px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Activity color="#805ad5" />
          <h3>Live Temperature Analytics</h3>
        </div>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[15, 35]} />
            <Tooltip />
            <Line type="monotone" dataKey="temp" stroke="#805ad5" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;