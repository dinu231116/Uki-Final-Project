import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // <-- import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // <-- import styles

const PlaceOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    customerName: '',
    pickupDate: '',
    deliveryDate: '',
    total: '',
    instructions: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    let cartTotal = '';
    if (location.state?.total) {
      cartTotal = location.state.total;
    } else {
      cartTotal = localStorage.getItem('cartTotal') || '';
    }

    setFormData(prev => ({
      ...prev,
      customerName: user?.name || '',
      total: cartTotal
    }));
  }, [location.state]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first'); // <-- toastify for not logged in
      navigate('/login');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/order/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          items: [{ name: "Example Item", quantity: 1 }], // Replace with actual cart items
          pickupDate: formData.pickupDate,
          deliveryDate: formData.deliveryDate,
          total: Number(formData.total),
          instructions: formData.instructions
        })
      });

      if (res.ok) {
        const data = await res.json();
        toast.success('Order placed successfully!');
        navigate('/payment', { state: { orderId: data.order._id, amount: data.order.total } });
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to place order');
      }
    } catch (err) {
      console.error('Order place error:', err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg mt-16">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">
        Place Your Order
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Name */}
        <div>
          <label htmlFor="customerName" className="block mb-2 font-semibold text-gray-700">
            Customer Name
          </label>
          <input
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your Name"
          />
        </div>

        {/* Pickup Date */}
        <div>
          <label htmlFor="pickupDate" className="block mb-2 font-semibold text-gray-700">
            Pickup Date
          </label>
          <input
            id="pickupDate"
            type="date"
            name="pickupDate"
            value={formData.pickupDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Delivery Date */}
        <div>
          <label htmlFor="deliveryDate" className="block mb-2 font-semibold text-gray-700">
            Delivery Date
          </label>
          <input
            id="deliveryDate"
            type="date"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Total */}
        <div>
          <label htmlFor="total" className="block mb-2 font-semibold text-gray-700">
            Total (LKR)
          </label>
          <input
            id="total"
            type="text"
            name="total"
            value={`LKR ${Number(formData.total).toLocaleString('en-LK')}`}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Instructions */}
        <div>
          <label htmlFor="instructions" className="block mb-2 font-semibold text-gray-700">
            Instructions
          </label>
          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows={4}
            placeholder="Any special instructions (optional)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={2500} /> {/* <-- ToastContainer */}
    </div>
  );
};

export default PlaceOrder;