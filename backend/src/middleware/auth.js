// src/middleware/auth.js

const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  try {
    let token = null;

    /* 1️⃣ Try Authorization header */
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    /* 2️⃣ Fallback: cookie token (optional, future-safe) */
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ error: "Authentication token missing" });
    }

    /* 3️⃣ Verify token */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* 4️⃣ Normalize user object */
    req.user = {
      id: decoded.id || decoded.userId || decoded._id,
      email: decoded.email || null,
      username: decoded.username || null,
    };

    if (!req.user.id) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};


/*
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

*/