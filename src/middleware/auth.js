const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware
 * Verifies JWT token and adds user data to request
 */
module.exports = async function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwtSecret');

    // Add user from payload
    req.user = decoded.user;
    
    // Fetch user from database to get latest roles and permissions
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }
    
    // Add full user object to request
    req.user = user;
    
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
