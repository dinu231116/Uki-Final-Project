import User from '../models/user.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // hide passwords
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  // Validate role
  const validRoles = ['admin', 'user'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'User role updated successfully', user });
  } catch (err) {
    console.error('Update Role Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    const updatedUser = await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
export const getCurrentUser = async (req, res) => {
  if (req.user) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
export const updateUserProfile = (req, res) => {
  const { name, email, phone } = req.body;

  // Simple validation
  if (!name || !email) {
    return res.status(400).json({ error: "Invalid data or not allowed" });
  }

  // Dummy user update simulation (replace with DB update)
  // Normally you'd get user id from req.user after auth middleware

  // For demo, respond success directly
  res.status(200).json({ message: "Profile updated successfully" });
};
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Comes from authMiddleware

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const orders = await Order.find({ user: userId });

    const totalOrders = orders.length;
    const activeOrders = orders.filter(o => o.status !== 'completed').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;

    // Sort orders by createdAt date
    orders.sort((a, b) => b.createdAt - a.createdAt);

    const lastOrder = orders[0] ? orders[0].createdAt : null;

    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      totalOrders,
      activeOrders,
      completedOrders,
      lastOrderDate: lastOrder,
      joinedOn: user.createdAt,
    });
  } catch (err) {
    console.error('Profile Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};