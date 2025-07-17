import express from 'express';
import { createPayment, getAllPayments } from '../controllers/paymentController.js';
import { protect , adminOnly} from '../middleware/authMiddleware.js';  // JWT auth middleware

const router = express.Router();

router.post('/create', protect, createPayment);
router.get('/admin/all-payments', protect, adminOnly, getAllPayments);


export default router;
