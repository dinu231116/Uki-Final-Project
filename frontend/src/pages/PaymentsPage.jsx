import React, { useEffect, useState } from 'react';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect(() => {
  //   const token = localStorage.getItem('token');

  //   const fetchPayments = async () => {
  //     try {
  //       const res = await fetch('http://localhost:5000/api/admin/all-payments', {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       if (!res.ok) throw new Error('Failed to fetch payments');
  //       const data = await res.json();
  //       setPayments(data);
  //     } catch (err) {
  //       setError('Unable to load payments.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPayments();
  // }, []);

  //   useEffect(() => {
  //   const token = localStorage.getItem('token');

  //   const fetchPayments = async () => {
  //     try {
  //       const res = await fetch('http://localhost:5000/api/admin/all-payments', {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       if (!res.ok) throw new Error('Failed to fetch payments');
  //       const data = await res.json();
  //       console.log('Payments API response:', data);

  //       // ✅ Adjust here: if backend returns { payments: [...] }
  //       if (Array.isArray(data)) {
  //         setPayments(data);
  //       } else if (Array.isArray(data.payments)) {
  //         setPayments(data.payments);
  //       } else {
  //         setPayments([]); // fallback to empty
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       setError('Unable to load payments.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPayments();
  // }, []);


  useEffect(() => {
    const fetchPayments = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/api/payment/admin/all-payments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch payments');
        const data = await res.json();
        console.log('Payments response:', data);

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
 <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">All Payments</h1>
      {loading && <div className="text-gray-600">Loading payments...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-blue-100 text-blue-900">
                <th className="py-2 px-4 text-left">Payment ID</th>
                <th className="py-2 px-4 text-left">User</th>
                <th className="py-2 px-4 text-left">Order</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
              <tr><td colSpan="5">No payments</td></tr>
            ) : (
              payments.map(p => (
                <tr key={p._id}>
                  <td>{p._id}</td>
                  <td>{p.userId?.name || '-'}</td>
                  <td>{p.orderId?._id || '-'}</td>
                  <td>{p.amount}</td>
                  <td>{p.status}</td>
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

export default PaymentsPage;