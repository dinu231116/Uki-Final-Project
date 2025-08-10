import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editedData, setEditedData] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 14;
  const totalPages = Math.ceil(users.length / rowsPerPage);

  const paginatedUsers = users.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const ROLES = ['admin', 'manager', 'staff', 'user', 'customer'];

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/user/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();

        if (Array.isArray(data.users)) {
          setUsers(data.users);
          const initial = {};
          data.users.forEach((u) => {
            initial[u._id] = { name: u.name, role: u.role };
          });
          setEditedData(initial);
        } else {
          setUsers([]);
        }
      } catch (err) {
        setError('Unable to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/user/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete user');

      setUsers(users.filter((u) => u._id !== userId));
      toast.success('User deleted successfully!');

      if (paginatedUsers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      toast.error('Delete failed: ' + err.message);
    }
  };

  const handleInputChange = (userId, field, value) => {
    setEditedData({
      ...editedData,
      [userId]: {
        ...editedData[userId],
        [field]: value,
      },
    });
  };

  const handleUpdate = async (userId) => {
    const { name, role } = editedData[userId];
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, role }),
      });

      if (!res.ok) throw new Error('Failed to update user');

      setUsers(users.map((u) =>
        u._id === userId ? { ...u, name, role } : u
      ));

      toast.success('User updated!');
    } catch (err) {
      toast.error('Update failed: ' + err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden md:block w-64 bg-blue-900 text-white fixed top-0 left-0 h-full shadow-lg z-20">
        <div className="p-6 font-bold text-xl border-b border-blue-800">Admin Panel</div>
        <nav className="mt-6 flex flex-col gap-2 px-4">
          <a href="/admin/dashboard" className="py-2 px-4 rounded hover:bg-blue-800 transition">Dashboard</a>
          <a href="/admin/users" className="py-2 px-4 rounded bg-blue-800">Users</a>
          <a href="/admin/orders" className="py-2 px-4 rounded hover:bg-blue-800 transition">Orders</a>
          <a href="/admin/payments" className="py-2 px-4 rounded hover:bg-blue-800 transition">Payments</a>
          <a href="/admin/services" className="py-2 px-4 rounded hover:bg-blue-800 transition">Services</a>
        </nav>
      </aside>

      <main className="flex-1 md:ml-64 p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">All Users</h1>

        {loading && <div className="text-gray-600">Loading users...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr className="bg-blue-100 text-blue-900">
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">Role</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((u) => (
                      <tr key={u._id} className="border-b hover:bg-blue-50">
                        <td className="py-2 px-4">
                          <input
                            value={editedData[u._id]?.name || ''}
                            onChange={(e) =>
                              handleInputChange(u._id, 'name', e.target.value)
                            }
                            className="border rounded px-2 py-1"
                          />
                        </td>
                        <td className="py-2 px-4">{u.email}</td>
                        <td className="py-2 px-4">
                          <select
                            value={editedData[u._id]?.role || ''}
                            onChange={(e) =>
                              handleInputChange(u._id, 'role', e.target.value)
                            }
                            className="border rounded px-2 py-1"
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-4 flex gap-2">
                          <button
                            onClick={() => handleUpdate(u._id)}
                            className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(u._id)}
                            className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

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

        {/* ToastContainer */}
        <ToastContainer position="top-right" autoClose={3000} />
      </main>
    </div>
  );
};

export default UsersPage;
