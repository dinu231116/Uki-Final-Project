import React, { useEffect, useState } from 'react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 14; // இதோ இதே வச்சிருக்குறது, 14 rows per page

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/all-orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Fetch orders error:', err);
        setError('Unable to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Create formatter for Sri Lankan Rupees
  const lkrFormatter = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
  });

  // Pagination logic
  const totalPages = Math.ceil(orders.length / rowsPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed */}
      <aside className="hidden md:block w-64 bg-blue-900 text-white fixed top-0 left-0 h-full shadow-lg z-20">
        <div className="p-6 font-bold text-xl border-b border-blue-800">Admin Panel</div>
        <nav className="mt-6 flex flex-col gap-2 px-4">
          <a href="/admin/dashboard" className="py-2 px-4 rounded hover:bg-blue-800 transition">Dashboard</a>
          <a href="/admin/users" className="py-2 px-4 rounded hover:bg-blue-800 transition">Users</a>
          <a href="/admin/orders" className="py-2 px-4 rounded bg-blue-800">Orders</a>
          <a href="/admin/payments" className="py-2 px-4 rounded hover:bg-blue-800 transition">Payments</a>
          <a href="/admin/services" className="py-2 px-4 rounded hover:bg-blue-800 transition">Services</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">All Orders</h1>

        {loading && <div className="text-gray-600">Loading orders...</div>}

        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto rounded shadow">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-blue-100 text-blue-900 text-sm">
                    <th className="py-3 px-4 text-left">Order ID</th>
                    <th className="py-3 px-4 text-left">User Name</th>
                    <th className="py-3 px-4 text-left">Address</th>
                    <th className="py-3 px-4 text-left">Phone</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {!paginatedOrders.length ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-gray-500">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((o, idx) => (
                      <tr
                        key={o._id}
                        className={`${
                          idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } border-b hover:bg-blue-50 transition`}
                      >
                        <td className="py-3 px-4 break-words">{o._id}</td>
                        <td className="py-3 px-4 break-words">{o.user?.name || '-'}</td>
                        <td className="py-3 px-4 break-words">{o.user?.address || '-'}</td>
                        <td className="py-3 px-4">{o.user?.phone || '-'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              o.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : o.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {o.status || 'N/A'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {o.createdAt
                            ? new Date(o.createdAt).toLocaleDateString()
                            : '-'}
                        </td>
                        <td className="py-3 px-4">
                          {o.total ? lkrFormatter.format(Number(o.total)) : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
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
        )}
      </main>
    </div>
  );
};

export default OrdersPage;
