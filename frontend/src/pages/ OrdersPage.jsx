// import React, { useEffect, useState } from 'react';

// const OrdersPage = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     const fetchOrders = async () => {
//       try {
//         const res = await fetch('http://localhost:5000/api/admin/all-orders', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) throw new Error('Failed to fetch orders');
//         const data = await res.json();
//         setOrders(data);
//       } catch (err) {
//         setError('Unable to load orders.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   return (
//     <div className="p-8 min-h-screen bg-gray-50">
//       <h1 className="text-3xl font-bold mb-6 text-blue-900">All Orders</h1>
//       {loading && <div className="text-gray-600">Loading orders...</div>}
//       {error && <div className="text-red-600">{error}</div>}
//       {!loading && !error && (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white rounded shadow">
//             <thead>
//               <tr className="bg-blue-100 text-blue-900">
//                 <th className="py-2 px-4 text-left">Order ID</th>
//                 <th className="py-2 px-4 text-left">User</th>
//                 <th className="py-2 px-4 text-left">Status</th>
//                 <th className="py-2 px-4 text-left">Date</th>
//                 <th className="py-2 px-4 text-left">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.length === 0 && (
//                 <tr>
//                   <td colSpan={5} className="text-center py-4 text-gray-500">
//                     No orders found.
//                   </td>
//                 </tr>
//               )}
//               {orders.map((o) => (
//                 <tr key={o._id} className="border-b hover:bg-blue-50">
//                   <td className="py-2 px-4">{o._id}</td>
//                   <td className="py-2 px-4">{o.user?.name || o.user || '-'}</td>
//                   <td className="py-2 px-4">
//                     <span
//                       className={
//                         o.status === 'completed'
//                           ? 'bg-green-100 text-green-700 px-2 py-1 rounded text-xs'
//                           : o.status === 'pending'
//                           ? 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs'
//                           : 'bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs'
//                       }
//                     >
//                       {o.status || 'N/A'}
//                     </span>
//                   </td>
//                   <td className="py-2 px-4">
//                     {o.createdAt
//                       ? new Date(o.createdAt).toLocaleDateString()
//                       : '-'}
//                   </td>
//                   <td className="py-2 px-4">
//                     {o.total ? `₹${o.total}` : '-'}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrdersPage;


// import React, { useEffect, useState } from 'react';

// const OrdersPage = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     const fetchOrders = async () => {
//       try {
//         const res = await fetch('http://localhost:5000/api/admin/all-orders', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) throw new Error('Failed to fetch orders');
//         const data = await res.json();
//         setOrders(data);
//       } catch (err) {
//         console.error('Fetch orders error:', err);
//         setError('Unable to load orders.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   return (
//     <div className="p-8 min-h-screen bg-gray-50">
//       <h1 className="text-3xl font-bold mb-6 text-blue-900">All Orders</h1>

//       {loading && <div className="text-gray-600">Loading orders...</div>}

//       {error && <div className="text-red-600">{error}</div>}

//       {!loading && !error && (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white rounded shadow">
//             <thead>
//               <tr className="bg-blue-100 text-blue-900">
//                 <th className="py-2 px-4 text-left">Order ID</th>
//                 <th className="py-2 px-4 text-left">User</th>
//                 <th className="py-2 px-4 text-left">Status</th>
//                 <th className="py-2 px-4 text-left">Date</th>
//                 <th className="py-2 px-4 text-left">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {!orders.length ? (
//                 <tr>
//                   <td colSpan={5} className="text-center py-4 text-gray-500">
//                     No orders found.
//                   </td>
//                 </tr>
//               ) : (
//                 orders.map((o) => (
//                   <tr key={o._id} className="border-b hover:bg-blue-50">
//                     <td className="py-2 px-4">{o._id}</td>
//                     <td className="py-2 px-4">{o.user?.name || '-'}</td>
//                     <td className="py-2 px-4">
//                       <span
//                         className={
//                           o.status === 'completed'
//                             ? 'bg-green-100 text-green-700 px-2 py-1 rounded text-xs'
//                             : o.status === 'pending'
//                             ? 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs'
//                             : 'bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs'
//                         }
//                       >
//                         {o.status || 'N/A'}
//                       </span>
//                     </td>
//                     <td className="py-2 px-4">
//                       {o.createdAt
//                         ? new Date(o.createdAt).toLocaleDateString()
//                         : '-'}
//                     </td>
//                     <td className="py-2 px-4">
//                       {o.total ? `₹${o.total}` : '-'}
//                     </td>
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

// export default OrdersPage;
   

import React, { useEffect, useState } from 'react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">All Orders</h1>

      {loading && <div className="text-gray-600">Loading orders...</div>}

      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-blue-100 text-blue-900">
                <th className="py-2 px-4 text-left">Order ID</th>
                <th className="py-2 px-4 text-left">User Name</th>
                <th className="py-2 px-4 text-left">Address</th>
                <th className="py-2 px-4 text-left">Phone</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {!orders.length ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="border-b hover:bg-blue-50">
                    <td className="py-2 px-4">{o._id}</td>
                    <td className="py-2 px-4">{o.user?.name || '-'}</td>
                    <td className="py-2 px-4">{o.user?.address || '-'}</td>
                    <td className="py-2 px-4">{o.user?.phone || '-'}</td>
                    <td className="py-2 px-4">
                      <span
                        className={
                          o.status === 'completed'
                            ? 'bg-green-100 text-green-700 px-2 py-1 rounded text-xs'
                            : o.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs'
                            : 'bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs'
                        }
                      >
                        {o.status || 'N/A'}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="py-2 px-4">{o.total ? `₹${o.total}` : '-'}</td>
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

export default OrdersPage;
