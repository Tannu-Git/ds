const roleAuth = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.employee || !allowedRoles.includes(req.employee.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = roleAuth;