import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const STATUS_STEPS = [
  "Received",
  "Washing",
  "Drying",
  "Ironing",
  "Ready for Pickup",
  "Delivered"
];

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

  // Find current status index
  const currentStatusIdx = STATUS_STEPS.findIndex(
    (step) => step.toLowerCase() === (order.status || "").toLowerCase()
  );

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h1>Order Details</h1>
      <p><b>Order ID:</b> {order._id}</p>
      <p><b>User:</b> {order.user?.name || order.user || "N/A"}</p>
      <p><b>Address:</b> {order.address}</p>
      <p><b>Payment:</b> {order.paymentMethod}</p>

      {/* Status Progress Bar */}
      <div style={{ margin: "30px 0" }}>
        <h3>Status</h3>
        <ol style={{ listStyle: "none", padding: 0, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {STATUS_STEPS.map((step, idx) => (
            <li
              key={step}
              style={{
                padding: "8px 16px",
                borderRadius: 20,
                background: idx <= currentStatusIdx ? "#22c55e" : "#e5e7eb",
                color: idx <= currentStatusIdx ? "#fff" : "#555",
                fontWeight: idx === currentStatusIdx ? "bold" : "normal",
                border: idx === currentStatusIdx ? "2px solid #16a34a" : "none",
                marginRight: idx < STATUS_STEPS.length - 1 ? 8 : 0,
                minWidth: 90,
                textAlign: "center"
              }}
            >
              {step}
            </li>
          ))}
        </ol>
      </div>

      <h3>Items</h3>
      <ul>
        {order.items.map((item, idx) => (
          <li key={idx}>
            {item.name} - Qty: {item.quantity} - Rs {item.price}
          </li>
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