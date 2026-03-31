// ── Role-based access guards ──────────────────────────────────────────────
// Use AFTER protectRoute (which sets req.userRole)

export const isAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied – Admins only" });
  }
  next();
};

export const isDoctor = (req, res, next) => {
  if (req.userRole !== "doctor") {
    return res.status(403).json({ success: false, message: "Access denied – Doctors only" });
  }
  next();
};

export const isUser = (req, res, next) => {
  if (req.userRole !== "user") {
    return res.status(403).json({ success: false, message: "Access denied – Users only" });
  }
  next();
};

// Allow admin OR doctor
export const isAdminOrDoctor = (req, res, next) => {
  if (req.userRole !== "admin" && req.userRole !== "doctor") {
    return res.status(403).json({ success: false, message: "Access denied – Admin or Doctor only" });
  }
  next();
};
