function requireRole(role) {
  return (req, res, next) => {
    const userRole = (req.header("x-user-role") || "").toLowerCase();

    if (!userRole) return res.status(401).json({ message: "Missing header: x-user-role" });
    if (userRole !== role) return res.status(403).json({ message: `Forbidden. Required role: ${role}` });

    next();
  };
}

function requireUserId(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(400).json({ message: "Missing header: x-user-id" });

  const parsed = Number(userId);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return res.status(400).json({ message: "Invalid x-user-id" });
  }

  req.userId = parsed;
  next();
}

module.exports = { requireRole, requireUserId };
