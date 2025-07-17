

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // Your Stripe webhook secret from dashboard — to verify event signature
// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// export const stripeWebhook = async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   let event;

//   try {
//     // Verify the webhook signature and extract the event
//     event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
//   } catch (err) {
//     console.error("Webhook signature verification failed.", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle the event types you care about
//   switch (event.type) {
//     case "payment_intent.succeeded":
//       const paymentIntent = event.data.object;

//       try {
//         // Find the Payment record by stripePaymentId (paymentIntent.id)
//         const payment = await Payment.findOne({ stripePaymentId: paymentIntent.id });

//         if (payment) {
//           // Update status to "paid"
//           payment.status = "paid";
//           await payment.save();
//           console.log(`Payment ${payment._id} marked as paid.`);
//         } else {
//           console.warn(`Payment with Stripe PaymentIntent ID ${paymentIntent.id} not found.`);
//         }

        

//       } catch (dbError) {
//         console.error("DB error updating payment status:", dbError);
//         return res.status(500).send("Internal Server Error");
//       }
//       break;

//     // Handle other event types if needed

//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   res.json({ received: true });
// };

import Stripe from "stripe";
import Payment from "../models/paymentModel.js";
import Order from "../models/order.js";  // Import Order model

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;

      try {
        // Find Payment by stripePaymentId
        const payment = await Payment.findOne({ stripePaymentId: paymentIntent.id });

        if (payment) {
          payment.status = "paid";
          await payment.save();

          // Also update the related Order status to "paid"
          if (payment.orderId) {
            await Order.findByIdAndUpdate(payment.orderId, { paymentStatus: "paid" });
          }

          console.log(`Payment ${payment._id} marked as paid, order ${payment.orderId} updated.`);
        } else {
          console.warn(`Payment with Stripe PaymentIntent ID ${paymentIntent.id} not found.`);
        }

      } catch (dbError) {
        console.error("DB error updating payment or order status:", dbError);
        return res.status(500).send("Internal Server Error");
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
