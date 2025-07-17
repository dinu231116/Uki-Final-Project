import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { protect } from './middleware/authMiddleware.js'; // JWT middleware
import settingsRoutes from './routes/adminSettings.js';
import { stripeWebhook } from './controllers/webhookController.js'; // Stripe webhook handler
import bodyParser from 'body-parser';


// Load .env variables
dotenv.config();

// Initialize app
const app = express();

app.post(
  "/webhook",
   bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);
// Middleware

app.use(express.json());



app.use(cors({
  origin: 'http://localhost:3000', // Adjust this to your frontend URL  credentials: true, // Allow cookies to be sent
  credentials: true,
}));
// Connect to MongoDB
connectDB();

// Public Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/adminsettings', settingsRoutes);


app.use('/api/payment', paymentRoutes);

// Protected Routes (only these need token)
app.use('/api/order', protect, orderRoutes);
app.use('/api/order', orderRoutes);



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});