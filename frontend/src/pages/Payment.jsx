import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const stripePromise = loadStripe("pk_test_51RlQJhRx75sIZYHeM7ZOPs0jaEfjWbrB5lpw5Sz3eYiAY6KjEkuAhgWU4RyjezRgjDdpdLuJ8Cb0bDPKNoO1GydH00Wnsn9oFh");

const CheckoutForm = ({ orderId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: { name },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/payment/create",
        {
          orderId,
          amount: Number(amount),
          paymentMethod: "card",
          paymentMethodId: paymentMethod.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status === "paid") {
        toast.success("Payment succeeded! Redirecting...");
        navigate("/success");
      } else {
        toast.error(`Payment failed: ${res.data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Payment failed");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-8 mt-12 bg-white rounded-lg shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-blue-700">Stripe Checkout</h2>

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Name on Card
        </label>
        <input
          type="text"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Full Name"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Card Details
        </label>
        <div className="p-4 border border-gray-300 rounded-lg bg-white">
          <CardElement />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-3 rounded-lg font-semibold text-white transition ${
          loading || !stripe
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Processing..." : `Pay LKR ${Number(amount).toLocaleString('en-LK')}`}
      </button>

      {message && (
        <p className="text-center text-red-600 text-sm">{message}</p>
      )}
    </form>
  );
};

const StripeCheckout = () => {
  const location = useLocation();
  const { orderId, amount } = location.state || {};

  if (!orderId || !amount) {
    return (
      <div className="p-10 text-center text-red-600 font-semibold">
        ❌ Order ID or amount not found. Please place your order first.
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm orderId={orderId} amount={amount} />
    </Elements>
  );
};

export default StripeCheckout;
