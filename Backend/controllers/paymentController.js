// controllers/paymentController.js

import dotenv from "dotenv";
dotenv.config();

import Payment from "../models/paymentModel.js";
import Order from "../models/order.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ CREATE PAYMENT (with Stripe integration)
export const createPayment = async (req, res) => {
  const { orderId, amount, paymentMethod, cardDetails, paymentMethodId } = req.body;

  if (!orderId || !amount || !paymentMethod) {
    return res.status(400).json({ error: "Invalid data" });
  }

  const userId = req.user ? req.user._id || req.user.id : null;
  if (!userId) {
    return res.status(401).json({ error: "User not authorized" });
  }

  try {
    let stripePaymentId = null;
    let paymentStatus = "pending";

    if (paymentMethod === "card") {
      // Accept Stripe PaymentMethod ID from frontend
      if (!paymentMethodId) {
        return res.status(400).json({ error: "Stripe paymentMethodId required" });
      }
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency: "inr",
          payment_method: paymentMethodId, // Use Stripe PaymentMethod ID
          confirm: true,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never',
          },
        });
        stripePaymentId = paymentIntent.id;
        paymentStatus = paymentIntent.status === "succeeded" ? "paid" : "failed";
      } catch (stripeError) {
        return res.status(400).json({ error: stripeError.message || "Stripe payment failed" });
      }
    } else if (["cash", "bank", "ezcash"].includes(paymentMethod)) {
      paymentStatus = "pending";
    }

    // Save payment in DB
    const payment = await Payment.create({
      userId,
      orderId, // Always set orderId, let Mongoose handle validation
      amount,
      paymentMethod,
      stripePaymentId,
      status: paymentStatus,
    });

    res.status(201).json({
      message: "Payment created successfully",
      paymentId: payment._id,
      status: payment.status,
      stripePaymentId,
    });
  } catch (error) {
    console.error("Create payment error:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

// ✅ GET ALL PAYMENTS
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "name email") // user details
      .populate("orderId"); // order details

    res.status(200).json({ payments });
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({ error: "Server error fetching payments" });
  }
};
