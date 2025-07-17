import React from 'react';
import { useNavigate } from 'react-router-dom';

const WashingService = () => {
  const navigate = useNavigate();

  const handleBookService = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/our-services?selected=washing');
    } else {
      navigate('/login?next=/our-services?selected=washing');
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
            Washing Service
          </h1>

          <div className="w-full mb-6">
            <img
              src="/src/assets/wash.png"
              alt="Washing Service"
              className="w-full h-64 md:h-80 object-cover rounded-xl"
            />
          </div>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-lg font-semibold text-blue-800 mb-1">Description:</h2>
              <p>Premium washing with eco-friendly detergents. Gentle care for all types of fabrics.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-blue-800 mb-1">Features:</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Machine wash & hand wash options</li>
                <li>Fabric softener included</li>
                <li>Perfect folding & packaging</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-blue-800 mb-1">Pricing:</h2>
              <p>Per Kg: ₹50 | Bedsheet: ₹80 | Blanket: ₹150</p>
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

export default WashingService;
