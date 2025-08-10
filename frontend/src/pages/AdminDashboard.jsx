import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, ShoppingCart, CreditCard, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsType, setDetailsType] = useState(null);

  // Pagination state for details table
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const getActiveLink = (path) => {
    return location.pathname === path ? 'bg-blue-700 text-white' : 'hover:bg-blue-600 text-blue-100';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
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

    // Determine details view from path
    const pathParts = location.pathname.split('/');
    if (pathParts[2] && ['users', 'orders', 'payments', 'services'].includes(pathParts[2])) {
      handleViewDetails(pathParts[2]);
    } else {
      setDetails(null);
      setDetailsType(null);
    }
  }, [navigate, location.pathname]);

  const handleViewDetails = async (type) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    let url = '';
    if (type === 'users') url = 'http://localhost:5000/api/admin/users';
    else if (type === 'orders') url = 'http://localhost:5000/api/admin/orders';
    else if (type === 'payments') url = 'http://localhost:5000/api/admin/payments';
    else if (type === 'services') url = 'http://localhost:5000/api/admin/services';

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        navigate('/login');
      } else {
        const data = await res.json();
        setDetails(data);
        setDetailsType(type);
        setCurrentPage(1); // Reset to first page on new details
      }
    } catch (err) {
      console.error(`Failed to fetch ${type}:`, err);
    }
  };

  // Pagination logic for details table
  const paginatedDetails = details
    ? details.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : [];
  const totalPages = details ? Math.ceil(details.length / rowsPerPage) : 1;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 space-y-6 fixed top-0 left-0 h-full overflow-y-auto z-20 shadow-lg">
        <h2 className="text-3xl font-extrabold mb-8 tracking-wide">Admin Panel</h2>
        <nav className="space-y-3">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 px-4 py-2 rounded ${getActiveLink('/admin/dashboard')}`}
            onClick={() => {
              setDetails(null);
              setDetailsType(null);
            }}
          >
            <Settings size={18} />
            Dashboard Home
          </Link>
          <Link
            to="/admin/orders"
            className={`flex items-center gap-3 px-4 py-2 rounded ${getActiveLink('/admin/orders')}`}
            onClick={() => handleViewDetails('orders')}
          >
            <ShoppingCart size={18} />
            Orders
          </Link>
          <Link
            to="/admin/users"
            className={`flex items-center gap-3 px-4 py-2 rounded ${getActiveLink('/admin/users')}`}
            onClick={() => handleViewDetails('users')}
          >
            <User size={18} />
            Users
          </Link>
          <Link
            to="/admin/payments"
            className={`flex items-center gap-3 px-4 py-2 rounded ${getActiveLink('/admin/payments')}`}
            onClick={() => handleViewDetails('payments')}
          >
            <CreditCard size={18} />
            Payments
          </Link>
          <Link
            to="/admin/services"
            className={`flex items-center gap-3 px-4 py-2 rounded ${getActiveLink('/admin/services')}`}
            onClick={() => handleViewDetails('services')}
          >
            <Settings size={18} />
            Services
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 ml-64">
        <h1 className="text-4xl font-bold mb-6 text-blue-900 tracking-tight">Dashboard Overview</h1>

        {/* Stats cards */}
        {!detailsType && !stats ? (
          <p className="text-gray-600 text-lg">Loading dashboard data...</p>
        ) : !detailsType && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md border border-blue-200 flex flex-col items-center">
              <User className="text-blue-500" size={36} />
              <h2 className="text-xl font-semibold mt-4 mb-2">Total Users</h2>
              <p className="text-3xl font-extrabold text-blue-700">{stats.totalUsers}</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md border border-green-200 flex flex-col items-center">
              <ShoppingCart className="text-green-500" size={36} />
              <h2 className="text-xl font-semibold mt-4 mb-2">Total Orders</h2>
              <p className="text-3xl font-extrabold text-green-700">{stats.totalOrders}</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md border border-yellow-200 flex flex-col items-center">
              <CreditCard className="text-yellow-500" size={36} />
              <h2 className="text-xl font-semibold mt-4 mb-2">Total Payments</h2>
              <p className="text-3xl font-extrabold text-yellow-700">{stats.totalPayments}</p>
            </div>
          </div>
        )}

        {/* Detailed table with pagination */}
        {details && detailsType && (
          <div className="mt-10 bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 capitalize text-gray-800">{detailsType} Details</h2>
            <div className="overflow-x-auto">
              {paginatedDetails.length > 0 ? (
                <>
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-blue-100 text-blue-900">
                      <tr>
                        {Object.keys(paginatedDetails[0]).map((key) => (
                          <th
                            key={key}
                            className="border border-gray-300 px-5 py-3 text-left text-sm font-semibold tracking-wide"
                          >
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedDetails.map((item, idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-blue-50 cursor-pointer'}
                        >
                          {Object.values(item).map((val, i) => (
                            <td key={i} className="border border-gray-300 px-5 py-3 text-sm text-gray-700">
                              {typeof val === 'boolean' ? (val ? 'Yes' : 'No') : val ?? '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Pagination controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6 gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-l bg-blue-600 text-white font-bold hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        Prev
                      </button>
                      {[...Array(totalPages)].map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentPage(idx + 1)}
                          className={`px-4 py-2 font-bold ${
                            currentPage === idx + 1
                              ? 'bg-yellow-500 text-white'
                              : 'bg-gray-200 text-blue-900 hover:bg-blue-100'
                          } transition`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-r bg-blue-600 text-white font-bold hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-600 text-center py-10">No {detailsType} to display.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;