// import mongoose from 'mongoose';

// const paymentSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   orderId: { type: String, required: true },
//   amount: { type: Number, required: true },
//   paymentMethod: {
//     type: String,
//     enum: ["card", "ezcash", "bank", "cash"],
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["pending", "completed", "failed"],
//     default: "pending",
//   },
//   transactionId: { type: String },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date },
// });

// const Payment = mongoose.model('Payment', paymentSchema);

// export default Payment;


import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }, // Changed to ObjectId for proper reference
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['card', 'ezcash', 'bank', 'cash'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'], // Stripe integration uses 'paid' for success
      default: 'pending',
    },
    stripePaymentId: { type: String }, // Store Stripe payment intent id if available
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
