import express from 'express';
import User from '../models/user.js';
import Order from '../models/order.js';
import Payment from '../models/paymentModel.js';
import Service from '../models/serviceModel.js';
import { protect } from '../middleware/authMiddleware.js';

import {
  getAllServices,
  createService,
  updateService,
  deleteService,
  getServiceById,
} from '../controllers/serviceController.js';

const router = express.Router();

// Dashboard stats route
router.get('/stats', protect, async (req, res) => {
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

// Services routes
router.get('/services', protect, getAllServices);       // GET all services
router.post('/services', protect, createService);       // POST create service
router.put('/services/:id', protect, updateService);    // PUT update service
router.delete('/services/:id', protect, deleteService); // DELETE service
router.get('/services/:id', protect, getServiceById);   // GET single service by id

// Orders and Payments routes
router.get('/all-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find().populate('user');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/all-payments', protect, async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
