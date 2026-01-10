import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const Dashboard = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    
    // Chart Data Mockup
    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            { label: 'Predicted Demand', data: [120, 150, 180, 110, 90, 200, 250], borderColor: '#4F46E5', fill: false },
            { label: 'Actual Stock', data: [130, 140, 120, 100, 80, 50, 20], borderColor: '#EF4444', borderDash: [5, 5] }
        ]
    };

    useEffect(() => {
        const sse = new EventSource('/api/notifications/stream');
        sse.onmessage = (e) => {
            const alert = JSON.parse(e.data);
            setNotifications(prev => [alert, ...prev]);
        };
        return () => sse.close();
    }, []);

    const handleOrder = async (qty: number) => {
        const res = await fetch('/api/orders/one-click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ storeId: 1, productId: 101, quantity: qty })
        });
        if (res.ok) alert('Order Placed Successfully!');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">AI Inventory Forecaster</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-4 rounded shadow">
                    <h2 className="font-semibold mb-2">Demand Forecast vs Stock</h2>
                    <Line data={data} />
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="font-semibold mb-2 text-red-600">Actionable Alerts</h2>
                    {notifications.map((n, i) => (
                        <div key={i} className={`p-3 mb-2 rounded border-l-4 ${n.level === 'CRITICAL' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'}`}>
                            <p className="text-sm">{n.message}</p>
                            <button 
                                onClick={() => handleOrder(150)}
                                className="mt-2 text-xs bg-indigo-600 text-white px-2 py-1 rounded"
                            >
                                One-click Order 150pcs
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;