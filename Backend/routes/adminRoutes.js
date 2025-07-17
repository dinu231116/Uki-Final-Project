import express from 'express';
import User from '../models/user.js';
import Order from '../models/order.js';
import Payment from '../models/paymentModel.js';
import { protect } from '../middleware/authMiddleware.js';
// import { getAllOrders } from '../controllers/orderController.js'; // நீங்கள் இதை பயன்படுத்த விரும்பினால் uncomment பண்ணவும்.

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalPayments = await Payment.countDocuments();

    const users = await User.find();
    const orders = await Order.find();
    const payments = await Payment.find();

    res.json({
      totalUsers,
      totalOrders,
      totalPayments,
      users,
      orders,
      payments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Add GET /all-orders route protected by auth middleware
router.get('/all-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find(); // தேவையென்றால் user-wise filter செய்யலாம்: { user: req.user._id }
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/all-payments', (req, res) => {
  // DB ல இருந்து payments எடு
  res.json({ payments: [] });
});

export default router;
