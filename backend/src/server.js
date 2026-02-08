const taxRoutes = require("./routes/tax");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const auth = require("./middleware/auth"); //IMPORT AUTH

const app = express();
const PORT = process.env.PORT || 5000;

/* --------------------
   GLOBAL MIDDLEWARE
-------------------- */
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json({ limit: "100kb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

/* Debug middleware (dev only) */
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(
      "[REQ DEBUG]",
      req.method,
      req.path,
      "bodyKeys=",
      Object.keys(req.body || {})
    );
  }
  next();
});

/* --------------------
   DATABASE
-------------------- */
async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/taxpal";
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
    console.log("DB:", mongoose.connection.name);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

/* --------------------
   SERVER BOOTSTRAP
-------------------- */
async function startServer() {
  await connectDB();

  /* PUBLIC ROUTES */
  app.use("/api/otp", require("./routes/otp"));
  console.log("Mounted /api/otp");

  app.use("/api/auth", require("./routes/auth"));
  console.log("Mounted /api/auth");

  /* PROTECTED ROUTES */
  app.use("/api/categories", auth, require("./routes/categories"));
  console.log("Mounted /api/categories");

  app.use("/api/transactions", auth, require("./routes/transactions"));
  console.log("Mounted /api/transactions");

  app.use("/api/dashboard", auth, require("./routes/dashboard"));
  console.log("Mounted /api/dashboard");

  app.use("/api/budgets", auth, require("./routes/budgets"));
  console.log("Mounted /api/budgets");

  app.use("/api/reports", auth, require("./routes/reports"));
  console.log("Mounted /api/reports");

  app.use("/api/tax", taxRoutes);

  /* HEALTH CHECK */
  app.get("/health", (req, res) =>
    res.json({ ok: true, env: process.env.NODE_ENV || "development" })
  );

  /* 404 FALLBACK */
  app.use((req, res) =>
    res.status(404).send(`Cannot ${req.method} ${req.path}`)
  );

  /* START SERVER */
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

/* --------------------
   START
-------------------- */
startServer().catch(err => {
  console.error("Failed to start server:", err.stack || err);
  process.exit(1);
});
