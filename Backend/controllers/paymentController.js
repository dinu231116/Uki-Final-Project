import dotenv from "dotenv";
dotenv.config();

import Payment from "../models/paymentModel.js";
import Order from "../models/order.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ CREATE PAYMENT (Safe version with validations and Stripe PaymentIntents)
export const createPayment = async (req, res) => {
  const { orderId, amount, paymentMethod, paymentMethodId } = req.body;

  // Validate inputs
  if (!orderId) {
    return res.status(400).json({ error: "orderId is required." });
  }

  if (!amount || typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "Amount must be a positive number." });
  }

  if (!paymentMethod) {
    return res.status(400).json({ error: "paymentMethod is required." });
  }

  // Check user authentication (assuming req.user is set by auth middleware)
  const userId = req.user?._id || req.user?.id || null;
  if (!userId) {
    return res.status(401).json({ error: "User not authorized." });
  }

  try {
    let stripePaymentId = null;
    let paymentStatus = "pending";

    if (paymentMethod === "card") {
      if (!paymentMethodId) {
        return res.status(400).json({ error: "PaymentMethodId is required for card payments." });
      }

      try {
        // Create and confirm a Stripe PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency: "lkr",
          payment_method: paymentMethodId,
          confirm: true,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: "never",
          },
        });;

        stripePaymentId = paymentIntent.id;

        // Set payment status based on paymentIntent status
        // You can also handle other statuses like 'requires_action' here if needed
        if (paymentIntent.status === "succeeded") {
          paymentStatus = "paid";
        } else if (paymentIntent.status === "requires_action") {
          paymentStatus = "requires_action"; // e.g. 3D Secure auth required
        } else {
          paymentStatus = "failed";
        }

      } catch (stripeError) {
        console.error("Stripe payment failed:", stripeError);
        return res.status(400).json({ error: stripeError.message || "Stripe payment failed." });
      }

    } else if (["cash", "bank", "ezcash"].includes(paymentMethod)) {
      // For offline payments, keep status pending
      paymentStatus = "pending";
    } else {
      return res.status(400).json({ error: "Unsupported payment method." });
    }

    // Save the payment record in DB
    const payment = await Payment.create({
      userId,
      orderId,
      amount,
      paymentMethod,
      stripePaymentId,
      status: paymentStatus,
    });

    // Respond with success and payment info
    return res.status(201).json({
      message: "Payment created successfully.",
      paymentId: payment._id,
      status: payment.status,
      stripePaymentId,
    });

  } catch (error) {
    console.error("Create payment error:", error);
    return res.status(500).json({ error: error.message || "Server error while creating payment." });
  }
};

// ✅ GET ALL PAYMENTS (Admin)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "name email")
      .populate("orderId");

    return res.status(200).json({ payments });
  } catch (error) {
    console.error("Get payments error:", error);
    return res.status(500).json({ error: "Server error while fetching payments." });
  }
};
