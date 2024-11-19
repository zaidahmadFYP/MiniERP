const isSuperAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Super Admin') {
      return next();
    }
    return res.status(403).json({ message: 'Access denied. Super Admin privileges required.' });
  };
  
  const isAdminOrSuperAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'Admin' || req.user.role === 'Super Admin')) {
      return next();
    }
    return res.status(403).json({ message: 'Access denied. Admin or higher privileges required.' });
  };
  
  module.exports = { isSuperAdmin, isAdminOrSuperAdmin };
  