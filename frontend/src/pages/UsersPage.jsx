// import React, { useEffect, useState } from 'react';

// const UsersPage = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     const fetchUsers = async () => {
//       try {
//         const res = await fetch('http://localhost:5000/api/user/users', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) throw new Error('Failed to fetch users');
//         const data = await res.json();
//         console.log(data); // Debug: See what backend returns
//         // If backend returns { users: [...] }
//         if (Array.isArray(data.users)) {
//           setUsers(data.users);
//         } else if (Array.isArray(data)) {
//           setUsers(data); // If backend returns just an array
//         } else {
//           setUsers([]);
//         }
//       } catch (err) {
//         setError('Unable to load users.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   return (
//     <div className="p-8 min-h-screen bg-gray-50">
//       <h1 className="text-3xl font-bold mb-6 text-blue-900">All Users</h1>
//       {loading && <div className="text-gray-600">Loading users...</div>}
//       {error && <div className="text-red-600">{error}</div>}
//       {!loading && !error && (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white rounded shadow">
//             <thead>
//               <tr className="bg-blue-100 text-blue-900">
//                 <th className="py-2 px-4 text-left">Name</th>
//                 <th className="py-2 px-4 text-left">Email</th>
//                 <th className="py-2 px-4 text-left">Role</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.length === 0 ? (
//                 <tr>
//                   <td colSpan={3} className="text-center py-4 text-gray-500">
//                     No users found.
//                   </td>
//                 </tr>
//               ) : (
//                 users.map((u) => (
//                   <tr key={u._id} className="border-b hover:bg-blue-50">
//                     <td className="py-2 px-4">{u.name}</td>
//                     <td className="py-2 px-4">{u.email}</td>
//                     <td className="py-2 px-4 capitalize">{u.role}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UsersPage;

import React, { useEffect, useState } from 'react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editedData, setEditedData] = useState({});

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
      alert('User deleted successfully!');
    } catch (err) {
      alert('Delete failed: ' + err.message);
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

      alert('User updated!');
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">All Users</h1>
      {loading && <div className="text-gray-600">Loading users...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && (
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
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
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
      )}
    </div>
  );
};

export default UsersPage;
