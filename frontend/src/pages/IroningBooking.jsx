import React from 'react';
import { useNavigate } from 'react-router-dom';

const IroningService = () => {
  const navigate = useNavigate();

  const handleBookService = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/our-services?selected=ironing');
    } else {
      navigate('/login?next=/our-services?selected=ironing');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-10">
          <button
            onClick={() => navigate('/services')}
            className="text-blue-600 hover:underline text-sm mb-6 inline-flex items-center"
          >
            ← Back to Services
          </button>

          <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-6">
            Ironing Service
          </h1>

          <div className="w-full mb-6">
            <img
              src="/src/assets/iron.png"
              alt="Ironing"
              className="w-full h-64 md:h-80 object-cover rounded-xl"
            />
          </div>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-lg font-semibold text-blue-800 mb-1">Description:</h2>
              <p>
                Get your clothes perfectly ironed using high-quality steam presses.
                Remove wrinkles and make your outfits look crisp and professional.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-blue-800 mb-1">Features:</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Steam press & flat press options</li>
                <li>No fabric burns or shine</li>
                <li>Ready-to-wear folding service</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-blue-800 mb-1">Pricing:</h2>
              <p>Shirt: ₹30 | Pants: ₹40 | Saree: ₹60</p>
            </div>
          </div>

          <button
            onClick={handleBookService}
            className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-full transition duration-300"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default IroningService;
