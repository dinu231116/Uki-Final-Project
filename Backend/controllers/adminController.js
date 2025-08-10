import User from '../models/user.js';
import Order from '../models/order.js';
import Payment from '../models/payment.js';
import Service from '../models/serviceModel.js'; 

// Dashboard stats (real DB data)
export const getDashboardStats = async (req, res) => {
  try {
    // Count documents
    const orders = await Order.countDocuments();
    const customers = await User.countDocuments();
    const revenueAgg = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const revenue = revenueAgg[0]?.total || 0;

    res.status(200).json({ orders, customers, revenue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user');
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
// ✅ ✅ ✅ Services Controller
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
