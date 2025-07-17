import React from "react";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6">
      <h1 className="text-4xl font-bold text-green-700 mb-4">Payment Successful!</h1>
      <p className="text-lg text-green-800 mb-6">Thank you for your payment. Your order is confirmed.</p>

      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Back to Home
      </button>
    </div>
  );
};

export default SuccessPage;
