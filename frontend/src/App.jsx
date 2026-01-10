import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LayoutDashboard, Users, BarChart3, Settings, LogOut, Download, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/analytics')
      .then(res => {
        setData(res.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading Dashboard...</div>;

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6">
        <h1 className="text-2xl font-bold text-blue-500 mb-10">QuickLink Admin</h1>
        <nav className="space-y-4">
          <button className="flex items-center space-x-3 w-full p-3 bg-blue-600 rounded-lg text-white">
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </button>
          <button className="flex items-center space-x-3 w-full p-3 hover:bg-gray-800 rounded-lg transition">
            <Users size={20} /> <span>Users</span>
          </button>
          <button className="flex items-center space-x-3 w-full p-3 hover:bg-gray-800 rounded-lg transition">
            <BarChart3 size={20} /> <span>Analytics</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">System Overview</h2>
          <button 
            onClick={() => window.open('http://localhost:5000/api/export')}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg border border-gray-700 transition"
          >
            <Download size={18} /> <span>Export CSV</span>
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {['Total Clicks', 'Active Users', 'Avg. Performance'].map((label, idx) => (
            <div key={idx} className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <p className="text-gray-400 text-sm">{label}</p>
              <p className="text-2xl font-bold mt-2">{idx === 0 ? '45,231' : idx === 1 ? '1,284' : '99.9%'}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Click Traffic (Last 5 Days)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{backgroundColor: '#111827', borderColor: '#374151'}} />
                  <Line type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Device Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.devices} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {data.devices.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex justify-between">
            <h3 className="text-lg font-semibold">RBAC Management</h3>
            <ShieldCheck className="text-blue-500" />
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-800/50 text-gray-400 text-sm">
              <tr>
                <th className="p-4">User Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {data.users.map(user => (
                <tr key={user.id} className="hover:bg-gray-800/30 transition">
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs ${user.role === 'Admin' ? 'bg-purple-900/40 text-purple-400' : 'bg-blue-900/40 text-blue-400'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm">{user.status}</td>
                  <td className="p-4"><button className="text-blue-500 hover:underline">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}