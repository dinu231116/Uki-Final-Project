import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    items: [],
    pickupDate: '',
    deliveryDate: '',
    address: '',
    total: '',
    serviceType: '',
    instructions: '',
    weightKg: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
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
          items: [{ name: "Example Item", quantity: 1 }], // update this as needed
          pickupDate: formData.pickupDate,
          deliveryDate: formData.deliveryDate,
          address: formData.address,
          total: Number(formData.total),
          serviceType: formData.serviceType,
          instructions: formData.instructions,
          weightKg: parseFloat(formData.weightKg)
        })
      });

      if (res.ok) {
        const data = await res.json();
        toast.success('Order placed successfully!');
        // Pass orderId and amount to payment page
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
    <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-semibold mb-6 text-center text-blue-700">Place Your Order</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Customer Name</label>
          <input
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Pickup Date</label>
          <input
            type="date"
            name="pickupDate"
            value={formData.pickupDate}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Delivery Date</label>
          <input
            type="date"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your pickup address"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Total (₹)</label>
          <input
            type="number"
            name="total"
            value={formData.total}
            onChange={handleChange}
            required
            min={0}
            step="0.01"
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Total amount"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Service Type</label>
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select a service</option>
            <option value="Washing">Washing</option>
            <option value="DryCleaning">Dry Cleaning</option>
            <option value="Ironing">Ironing</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Instructions</label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any special instructions (optional)"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Weight (Kg)</label>
          <input
            type="number"
            name="weightKg"
            value={formData.weightKg}
            onChange={handleChange}
            required
            min={0}
            step="0.01"
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter weight in kilograms"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 py-3 rounded-md font-semibold text-white transition ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default PlaceOrder;
