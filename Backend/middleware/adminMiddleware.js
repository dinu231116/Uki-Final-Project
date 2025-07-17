// export const adminOnly = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') {
//     next();
//   } else {
//     res.status(403).json({ message: 'Access denied: Admins only' });
//   }
// };
// export const protect = (req, res, next) => {
//   console.log('protect middleware triggered');
//   // your existing code...
//   next();
// };

// // adminMiddleware.js


import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Should contain at least: { _id, role }
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') next();
  else res.status(403).json({ message: 'Admins only' });
};
