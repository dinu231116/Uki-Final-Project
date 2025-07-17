import React, { useEffect, useState } from 'react';

const OrderTracking = ({ orderId }) => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/orders/${orderId}/status`);
        if (!res.ok) throw new Error('Failed to fetch status');

        const data = await res.json();
        setStatus(data.status);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [orderId]);

  if (loading) return <p>Loading order status...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  const steps = [
    'Order Placed',
    'Picked Up',
    'Washing',
    'Ironing',
    'Ready for Delivery',
    'Delivered',
  ];

  return (
    <div>
      <h2>Order Tracking</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {steps.map((step) => {
          const isCurrent = step === status;
          const isDone = steps.indexOf(step) < steps.indexOf(status);

          return (
            <li
              key={step}
              style={{
                padding: '8px',
                margin: '6px 0',
                backgroundColor: isCurrent ? '#4caf50' : isDone ? '#a5d6a7' : '#ddd',
                color: isCurrent || isDone ? 'white' : 'black',
                fontWeight: isCurrent ? 'bold' : 'normal',
                borderRadius: '4px',
              }}
            >
              {step} {isCurrent && '✔️'}
            </li>
          );
        })}
      </ul>
      <p>Current Status: <b>{status}</b></p>
    </div>
  );
};

export default OrderTracking;