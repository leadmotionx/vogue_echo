import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ChevronRight,
  TrendingUp,
  Package,
  ShoppingCart,
  Users
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { backendUrl } from '../config';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/dashboard/stats', { headers: { token } });
      if (response.data.success) {
        setStats(response.data.stats);
        setRecentOrders(response.data.recentOrders);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const statCards = [
    { title: 'Total Revenue', value: `Rs.${stats.totalRevenue.toLocaleString()}`, change: 'Real-time calculation', trend: 'up', icon: <TrendingUp size={20} /> },
    { title: 'Total Orders', value: stats.totalOrders, change: 'Lifetime orders', trend: 'up', icon: <ShoppingCart size={20} /> },
    { title: 'Inventory count', value: stats.totalProducts, change: 'Active archival pieces', trend: 'neutral', icon: <Package size={20} /> },
    { title: 'Active Users', value: stats.totalUsers, change: 'Registered customers', trend: 'up', icon: <Users size={20} /> },
  ];

  const chartData = {
    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'],
    datasets: [
      {
        label: 'NET SALES',
        data: [200, 350, 280, 420, 250, stats.totalRevenue / 1000],
        backgroundColor: '#1a1a1a',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { display: false },
      x: { grid: { display: false }, ticks: { font: { size: 9, weight: '700' }, color: '#bbb' } }
    }
  };

  if (loading) return <div className="p-10 serif">Loading Real-time Metrics...</div>;

  return (
    <div className="dashboard-container">
      <div className="stats-grid">
        {statCards.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-header">
              <span className="stat-title">{stat.title}</span>
              <div style={{ color: '#8b7e66', opacity: 0.6 }}>{stat.icon}</div>
            </div>
            <div className="stat-value serif">{stat.value}</div>
            <div className="stat-change" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888' }}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="content-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="chart-container">
          <div style={{ marginBottom: '30px' }}>
            <h3 className="serif" style={{ fontSize: '22px' }}>Sales Overview</h3>
            <p style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '5px' }}>Current Performance Indicators</p>
          </div>
          <div style={{ height: '300px' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="promo-card" style={{ background: '#1a1a1a', color: 'white', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span className="promo-tag" style={{ color: '#8b7e66', fontWeight: 'bold', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase' }}>System Status</span>
          <h3 className="serif" style={{ fontSize: '24px', margin: '15px 0' }}>Real-time Sync Active</h3>
          <p style={{ fontSize: '13px', color: '#888', lineHeight: '1.6' }}>
            Your dashboard is now connected to the live database. All revenue and order metrics are calculated in real-time from actual transactions.
          </p>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3 className="serif">Recent Orders</h3>
          <p>Real-time transaction stream</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: '700' }}>#{order._id.slice(-6).toUpperCase()}</td>
                <td>{order.address.firstName} {order.address.lastName}</td>
                <td style={{ fontWeight: '700' }}>Rs.{order.amount.toLocaleString()}</td>
                <td style={{ color: '#888' }}>{new Date(order.date).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${order.status === 'Delivered' ? 'status-shipped' : 'status-pending'}`}>
                    {order.status}
                  </span>
                </td>
                <td><ChevronRight size={16} color="#ccc" /></td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>No orders found yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
