/**
 * Seller middleware
 * Verifies that the authenticated user has seller role
 * Must be used after the auth middleware
 */
module.exports = function(req, res, next) {
  // Check if user exists (should be added by auth middleware)
  if (!req.user) {
    return res.status(401).json({ msg: 'Authentication required' });
  }

  // Check if user is seller
  if (!req.user.isSeller && !req.user.roles.includes('seller')) {
    return res.status(403).json({ msg: 'Seller access required' });
  }

  next();
};
