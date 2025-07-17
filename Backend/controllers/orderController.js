import Order from '../models/order.js';
import AdminSettings from '../models/AdminSettings.js';
import dayjs from 'dayjs';

// ✅ Create Order (NOT USED: for testing only)
export const createOrder = async (req, res) => {
  const { items } = req.body;

  if (!items) {
    return res.status(400).json({ error: 'Items missing' });
  }

  const order = new Order({
    user: req.user.id,
    items,
  });

  await order.save();
  res.json(order);
};

// ✅ Get Single Order by ID
export const getOrderById = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId).populate('user', 'name email');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Get Order Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get My Orders (for logged-in user)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (error) {
    console.error('Get My Orders Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get All Orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    console.error('Get All Orders Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Place Order (with daily capacity check)
export const placeOrder = async (req, res) => {
  const {
    customerName,
    items,
    pickupDate,
    deliveryDate,
    address,
    total,
    serviceType,
    instructions,
    weightKg,
  } = req.body;

  if (
    !customerName ||
    !items ||
    !pickupDate ||
    !deliveryDate ||
    !address ||
    !total ||
    !serviceType ||
    !weightKg
  ) {
    return res.status(400).json({ error: 'Missing order details' });
  }

  try {
    const today = dayjs().format('YYYY-MM-DD');
    const settings = await AdminSettings.findOne({ date: today });

    if (!settings) {
      return res.status(404).json({ error: 'Today settings not found! Please create it first.' });
    }

    if (settings.remainingCapacityKg < weightKg) {
      return res.status(400).json({
        error: `Sorry, only ${settings.remainingCapacityKg} kg left for today.`,
      });
    }

    // Deduct capacity
    settings.remainingCapacityKg -= weightKg;
    await settings.save();

    const newOrder = new Order({
      user: req.user.id,
      customerName,
      items,
      pickupDate,
      deliveryDate,
      address,
      total,
      serviceType,
      instructions,
      weightKg,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Place Order Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Cancel Order (NO validation issues!)
export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order already cancelled' });
    }

    // ✅ Use updateOne to skip schema validation for required fields
    await Order.updateOne(
      { _id: orderId },
      { $set: { status: 'cancelled' } }
    );

    res.json({ message: 'Order cancelled successfully' });

  } catch (error) {
    console.error('Cancel Order Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
