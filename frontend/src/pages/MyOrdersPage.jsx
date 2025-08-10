import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/order/my-orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          alert('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Fetch orders error:', error);
        alert('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (orders.length === 0) {
    return <div className="p-4">You have no orders yet.</div>;
  }

  // Helper: style status with colors
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border p-6 rounded-lg shadow-md bg-white"
          >
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Service:</strong> {order.serviceType}</p>
            <p><strong>Pickup Date:</strong> {new Date(order.pickupDate).toLocaleDateString()}</p>
            <p><strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Weight:</strong> {order.weightKg || 0} Kg</p>
            <p><strong>Total:</strong> ₹{order.total}</p>

            {/* Status badge */}
            <div className="mt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(order.status)}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            {/* Payment status */}
            <p className="mt-2"><strong>Payment:</strong> {order.paymentStatus}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
