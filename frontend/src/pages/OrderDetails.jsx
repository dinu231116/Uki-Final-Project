import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/orders/${orderId}`)
      .then(res => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert('Failed to load order details');
        setLoading(false);
      });
  }, [orderId]);

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h1>Order Details</h1>
      <p><b>Order ID:</b> {order._id}</p>
      <p><b>Status:</b> {order.status}</p>
      <p><b>Address:</b> {order.address}</p>
      <p><b>Payment:</b> {order.paymentMethod}</p>

      <h3>Items</h3>
      <ul>
        {order.items.map((item, idx) => (
          <li key={idx}>{item.name} - Qty: {item.quantity} - Rs {item.price}</li>
        ))}
      </ul>

      <p><b>Total:</b> Rs {order.totalAmount}</p>

      {/* Feedback status */}
      {order.feedback ? (
        <div>
          <h3>Your Feedback</h3>
          <p>Rating: {order.feedback.rating}</p>
          <p>Comment: {order.feedback.comment}</p>
        </div>
      ) : (
        <button onClick={() => navigate(`/orders/${orderId}/feedback`)}>
          Give Feedback
        </button>
      )}
    </div>
  );
};

export default OrderDetails;
