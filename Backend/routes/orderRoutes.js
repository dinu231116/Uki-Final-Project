import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  placeOrder,
  cancelOrder
} from '../controllers/orderController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Specific routes FIRST!
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, getAllOrders);
router.post('/place', protect, placeOrder);
router.put('/cancel/:id', protect, cancelOrder);

// ✅ Dynamic route LAST!
router.get('/:id', protect, getOrderById);

export default router;
