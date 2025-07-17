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

  // Order cancel handler
  const handleCancel = async (orderId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/order/cancel/${orderId}`, {
        method: 'PUT', // or DELETE based on your backend
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert('Order cancelled successfully');
        // Refresh orders after cancel
        setOrders((prev) => prev.map(order => order._id === orderId ? { ...order, status: 'cancelled' } : order));
      } else {
        alert('Failed to cancel order');
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      alert('Something went wrong while cancelling');
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (orders.length === 0) {
    return <div className="p-4">You have no orders yet.</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border p-4 rounded shadow">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Service:</strong> {order.serviceType}</p>
            <p><strong>Pickup Date:</strong> {new Date(order.pickupDate).toLocaleDateString()}</p>
            <p><strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Weight:</strong> {order.weightKg || 0} Kg</p>
            <p><strong>Total:</strong> ₹{order.total}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Payment:</strong> {order.paymentStatus}</p>

            {order.status !== 'cancelled' && (
              <button
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleCancel(order._id)}
              >
                Cancel Order
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
