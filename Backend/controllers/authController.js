import User from '../models/user.js';
import Admin from '../models/admin.js'; // Make sure this is ES Module
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// ✅ Register user — always hash password
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: 'User already exists' });
    }


    const newUser = new User({
      name,
      email,
      password,
      role,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Login user — always compare hashed password
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("👉 Is Match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update Admin — hash password if provided
export const updateAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }
    if (role) updates.role = role;

    const admin = await Admin.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    res.json({ message: 'Admin updated', admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Delete Admin
export const deleteAdmin = async (req, res) => {
  try {
    const deleted = await Admin.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Admin not found' });

    res.json({ message: 'Admin deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
