// src/middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id || decoded.userId || decoded._id,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch (err) {
    console.error("Auth error:", err.message); // ✅ FIXED
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
