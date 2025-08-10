import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DryCleaningService = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login?redirect=/drycleaning');
    }
  }, [navigate]);

  const handleBookService = () => {
    navigate('/our-services'); // Adjust to your booking flow
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div className="max-w-2xl mx-auto p-8 md:p-12 bg-white rounded-2xl shadow-2xl border border-gray-100">
        <button
          onClick={() => navigate('/services')}
          className="text-blue-700 hover:text-blue-900 hover:underline mb-8 inline-flex items-center text-sm font-medium transition-colors"
        >
          ← Back to Services
        </button>

        <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-8">
          Dry Cleaning Service
        </h1>

        <img
          src="/src/assets/dryclean.png"
          alt="Dry Cleaning"
          className="w-full h-72 object-cover rounded-xl shadow-md mb-8"
        />

        <div className="space-y-6 text-gray-700 text-base leading-relaxed">
          <div>
            <h2 className="font-semibold text-blue-800 mb-2">Description</h2>
            <p>
              Professional dry cleaning using advanced solvents — no water, just care!
              Safe and effective for delicate clothes and formal wear.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-blue-800 mb-2">Features</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Perfect for suits, sarees & wool</li>
              <li>No color fading or shrinkage</li>
              <li>Premium folding & packaging</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-blue-800 mb-2">Pricing</h2>
            <p>Blazer: ₹800 &nbsp; | &nbsp; Suit: ₹1200 &nbsp; | &nbsp; Saree: ₹2000</p>
          </div>
        </div>

        <button
          onClick={handleBookService}
          className="w-full mt-10 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-4 rounded-full shadow-md transition-transform transform hover:scale-105"
        >
          Continue to Book
        </button>
      </div>
    </div>
  );
};

export default DryCleaningService;
