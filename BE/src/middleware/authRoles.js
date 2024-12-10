const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    // Check if req.user exists and the role is allowed
    if (!req.user || !allowedRoles.includes(req.user.role.name)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next(); // User has one of the required roles
  };
};

module.exports = authorizeRoles;
