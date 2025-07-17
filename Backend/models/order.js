import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    weightKg: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-process', 'completed', 'delivered', 'cancelled'],
      default: 'pending',
    },
    instructions: {
      type: String,
      default: '',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
  },
  { timestamps: true }
);


const Order = mongoose.model('Order', orderSchema);

export default Order;