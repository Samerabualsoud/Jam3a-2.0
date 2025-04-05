/**
 * Admin middleware
 * Verifies that the authenticated user has admin role
 * Must be used after the auth middleware
 */
module.exports = function(req, res, next) {
  // Check if user exists (should be added by auth middleware)
  if (!req.user) {
    return res.status(401).json({ msg: 'Authentication required' });
  }

  // Check if user is admin
  if (!req.user.isAdmin && !req.user.roles.includes('admin')) {
    return res.status(403).json({ msg: 'Admin access required' });
  }

  next();
};
