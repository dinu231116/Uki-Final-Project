import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 3 seconds கழித்து MyOrders pageக்கு redirect பண்ணும்
    const timer = setTimeout(() => {
      navigate('/orders');
    }, 3000);

    return () => clearTimeout(timer); // Clean up timer on unmount
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 p-6">
      <div className="bg-white shadow-md rounded p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Thank You!</h1>
        <p className="text-gray-700 mb-6">
          Your order has been placed successfully. We will contact you shortly with pickup details.
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
