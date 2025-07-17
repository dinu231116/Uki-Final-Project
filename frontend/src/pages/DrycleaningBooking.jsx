// import React from 'react';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';


const DryCleaningService = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If user is NOT logged in, redirect to login with intended path
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login?redirect=/drycleaning');
    }
  }, [navigate]);

  const handleBookService = () => {
    // If user is logged in, go to booking form or confirm booking
    navigate('/place-order'); // or wherever your booking flow goes
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto p-6 md:p-10 bg-white rounded-xl shadow-xl">
        <button onClick={() => navigate('/services')} className="text-blue-600 hover:underline mb-6 text-sm">
          ← Back to Services
        </button>

        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">Dry Cleaning Service</h1>

        <img src="/src/assets/dryclean.png" alt="Dry Cleaning" className="w-full h-60 object-cover rounded-lg shadow mb-6" />

        <div className="space-y-4 text-gray-700 text-base leading-relaxed">
          <h2 className="font-semibold text-blue-800 mb-1">Description:</h2>
          <p>Professional dry cleaning using advanced solvents — no water, just care! Safe and effective for delicate clothes and formal wear.</p>

          <h2 className="font-semibold text-blue-800 mb-1">Features:</h2>
          <ul className="list-disc list-inside">
            <li>Perfect for suits, sarees & wool</li>
            <li>No color fading or shrinkage</li>
            <li>Premium folding & packaging</li>
          </ul>

          <h2 className="font-semibold text-blue-800 mb-1">Pricing:</h2>
          <p>Blazer: ₹800 | Suit: ₹1200 | Saree: ₹2000</p>
        </div>

        <button onClick={handleBookService} className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-full transition duration-300">
          Continue
        </button>
      </div>
    </div>
  );
};

export default DryCleaningService;
