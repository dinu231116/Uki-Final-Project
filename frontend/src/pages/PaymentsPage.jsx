import React, { useEffect, useState } from 'react';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 14; // 14 rows per page
  const totalPages = Math.ceil(payments.length / rowsPerPage);

  // Current page data slice
  const paginatedPayments = payments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    const fetchPayments = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/api/payment/admin/all-payments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch payments');
        const data = await res.json();
        if (Array.isArray(data)) {
          setPayments(data);
        } else if (Array.isArray(data.payments)) {
          setPayments(data.payments);
        } else {
          setPayments([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:block w-64 bg-blue-900 text-white fixed top-0 left-0 h-full shadow-lg z-20">
        <div className="p-6 font-bold text-xl border-b border-blue-800">Admin Panel</div>
        <nav className="mt-6 flex flex-col gap-2 px-4">
          <a href="/admin/dashboard" className="py-2 px-4 rounded hover:bg-blue-800 transition">Dashboard</a>
          <a href="/admin/users" className="py-2 px-4 rounded hover:bg-blue-800 transition">Users</a>
          <a href="/admin/orders" className="py-2 px-4 rounded hover:bg-blue-800 transition">Orders</a>
          <a href="/admin/payments" className="py-2 px-4 rounded bg-blue-800">Payments</a>
          <a href="/admin/services" className="py-2 px-4 rounded hover:bg-blue-800 transition">Services</a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 p-8">
        <h1 className="text-3xl font-extrabold mb-8 text-blue-900">All Payments</h1>

        {loading && (
          <div className="text-gray-600 text-center text-lg">Loading payments...</div>
        )}

        {error && (
          <div className="text-red-600 font-semibold text-center mb-6">{error}</div>
        )}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto shadow rounded-lg border border-gray-200 bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-100 text-blue-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Payment ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedPayments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500">
                        No payments available.
                      </td>
                    </tr>
                  ) : (
                    paginatedPayments.map((p) => (
                      <tr
                        key={p._id}
                        className="hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700 font-mono truncate max-w-xs">{p._id}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{p.userId?.name || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{p.orderId?._id || '-'}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-700">
                          {new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(p.amount)}
                        </td>
                        <td className={`px-6 py-4 text-sm font-semibold ${
                          p.status.toLowerCase() === 'paid' ? 'text-green-600' :
                          p.status.toLowerCase() === 'pending' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {p.status}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(p.createdAt || p.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

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
        )}
      </main>
    </div>
  );
};

export default PaymentsPage;
