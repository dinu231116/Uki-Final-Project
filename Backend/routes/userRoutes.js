import express from 'express';
import {
  updateUser,
  deleteUser,
  getAllUsers,
  updateUserRole,
  updateUserProfile,
  getCurrentUser,
  getProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// ✅ Update user role (admin only)
router.put('/:id/role', protect, adminOnly, updateUserRole);

// ✅ Get currently logged-in user
router.get('/profile', protect, getProfile);

// ✅ Get all users (admin only)
router.get('/users', protect, adminOnly, getAllUsers);

// ✅ Update user by ID
router.put('/:id', protect, updateUser);

// ✅ Delete user by ID
router.delete('/:id', protect, deleteUser);

// ✅ Update user profile
router.put('/', protect, updateUserProfile);


// ✅ Test route (optional)
router.get('/', (req, res) => {
  res.json({ message: 'User route working!' });
});

export default router;
