

// ✅ PaymentPage.jsx
// import React from "react";
// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import { useLocation, useNavigate } from "react-router-dom";

// const PaymentPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const stripe = useStripe();
//   const elements = useElements();

//   const orderId = location.state?.orderId;
//   const amount = location.state?.amount;

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!stripe || !elements) {
//       alert("Stripe is not loaded yet");
//       return;
//     }

//     const cardElement = elements.getElement(CardElement);

//     // ✅ Create payment method safely!
//     const { error, paymentMethod } = await stripe.createPaymentMethod({
//       type: "card",
//       card: cardElement,
//     });

//     if (error) {
//       alert(error.message);
//       return;
//     }

//     const token = localStorage.getItem("token");

//     const res = await fetch("http://localhost:5000/api/payment/create", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         orderId,
//         amount,
//         paymentMethodId: paymentMethod.id, // ✅ send only ID, not card details!
//         paymentMethod: "card",
//       }),
//     });

//     const data = await res.json();
//     if (res.ok) {
//       alert("Payment success");
//       navigate("/order-confirmation");
//     } else {
//       alert(data.error);
//     }
//   };

//   return (
//     <div className="p-6 max-w-lg mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Payment</h2>
//       <p>Amount: Rs.{amount}</p>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <CardElement />
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Pay Rs.{amount}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PaymentPage;

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom"; // ✅ ✅ ✅
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
          orderId: orderId, // ✅ from props — must not be undefined!
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
        navigate("/success"); // Optional success page
        
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Stripe Checkout</h2>

      <label className="block mb-2">
        Name:
        <input
          type="text"
          className="border p-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className="block mb-2">
        Card Details:
        <div className="border p-2 rounded">
          <CardElement />
        </div>
      </label>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {message && (
        <div className="mt-4 text-sm text-green-700">{message}</div>
      )}
    </form>
  );
};

const StripeCheckout = () => {
  const location = useLocation(); // ✅ ✅ ✅
  const { orderId, amount } = location.state || {};

  if (!orderId || !amount) {
    return (
      <div className="p-10 text-center text-red-600">
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
