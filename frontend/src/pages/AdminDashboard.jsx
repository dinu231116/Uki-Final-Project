import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsType, setDetailsType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          navigate('/login');
        } else {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };

    fetchStats();
  }, [navigate]);

  const handleViewDetails = async (type) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    let url = '';
    if (type === 'users') url = 'http://localhost:5000/api/admin/users';
    if (type === 'orders') url = 'http://localhost:5000/api/admin/orders';
    if (type === 'payments') url = 'http://localhost:5000/api/admin/payments';

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        navigate('/login');
      } else {
        const data = await res.json();
        setDetails(data);
        setDetailsType(type);
      }
    } catch (err) {
      console.error(`Failed to fetch ${type}:`, err);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <Link to="/admin/dashboard" className="block hover:bg-blue-700 px-3 py-2 rounded">
            Dashboard Home
          </Link>
          <Link to="/admin/orders" className="block hover:bg-blue-700 px-3 py-2 rounded">
            Orders
          </Link>
          <Link to="/admin/users" className="block hover:bg-blue-700 px-3 py-2 rounded">
            Users
          </Link>
          <Link to="/admin/payments" className="block hover:bg-blue-700 px-3 py-2 rounded">
            Payments
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-4 text-blue-900">Dashboard Overview</h1>

        {!stats ? (
          <p className="text-gray-700">Loading dashboard data...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Total Users</h2>
              <p className="text-2xl mb-4">{stats.totalUsers}</p>
              
            </div>
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Total Orders</h2>
              <p className="text-2xl mb-4">{stats.totalOrders}</p>
             
            </div>
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Total Payments</h2>
              <p className="text-2xl mb-4">{stats.totalPayments}</p>
              
            </div>
          </div>
        )}

        {/* Render detailed data if available */}
        {details && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 capitalize">{detailsType} Details</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr>
                    {details.length > 0 &&
                      Object.keys(details[0]).map((key) => (
                        <th key={key} className="border px-4 py-2 text-left">
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {details.map((item, index) => (
                    <tr key={index} className="border-t">
                      {Object.values(item).map((val, i) => (
                        <td key={i} className="border px-4 py-2">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
