import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PipelineDashboard = () => {
    const [stats, setStats] = useState({ total_processed_records: 0, success_rate: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data from FastAPI backend
        fetch('/api/monitoring/stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-6 bg-gray-900 text-white min-h-screen">
            <h1 className="text-2xl font-bold mb-6">ETL Pipeline Monitoring Center</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-gray-800 rounded-lg shadow">
                    <p className="text-gray-400">Processed Records</p>
                    <p className="text-3xl font-mono text-blue-400">{stats.total_processed_records.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg shadow">
                    <p className="text-gray-400">Success Rate</p>
                    <p className="text-3xl font-mono text-green-400">{stats.success_rate}%</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg shadow">
                    <button 
                        className="w-full h-full bg-blue-600 hover:bg-blue-700 rounded font-bold transition"
                        onClick={() => alert('Manual ETL Triggered')}
                    >
                        Run Manual Sync
                    </button>
                </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="mb-4 font-semibold">Data Ingestion Flow (Real-time)</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[{time: '10:00', val: 400}, {time: '11:00', val: 700}, {time: '12:00', val: 600}]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="time" stroke="#999" />
                            <YAxis stroke="#999" />
                            <Tooltip contentStyle={{backgroundColor: '#222', border: 'none'}} />
                            <Line type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={2} dot={{r: 4}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default PipelineDashboard;