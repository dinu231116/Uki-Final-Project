// import express from 'express';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
// import { registerUser,loginUser,updateAdmin} from '../controllers/authController.js';

// const router = express.Router();
// router.post('/login', loginUser);
// router.post('/register', registerUser);


// export default router;


import express from 'express';
import { registerUser, loginUser, updateAdmin } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';  // middleware-ஐ import பண்ணுங்கள்

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);

// Admin update route - protect and adminOnly middleware-ஐ சேர்த்து பாதுகாக்கலாம்
router.put('/admin/update', protect, adminOnly, updateAdmin);

export default router;
