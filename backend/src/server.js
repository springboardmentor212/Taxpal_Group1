// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// basic middleware
app.use(morgan('dev')); // request logging
app.use(express.json({ limit: '100kb' })); // parse JSON before routes
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// small debug middleware to print incoming path and body (only in non-prod)
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    try {
      console.log('[REQ DEBUG]', req.method, req.path, 'bodyKeys=', Object.keys(req.body || {}));
    } catch (e) {
      /* ignore debug logging errors */
    }
  }
  next();
});

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/taxpal';
  try {
    // await connection
    await mongoose.connect(uri, {
      // modern defaults; no deprecated flags here
    });

    console.log('MongoDB connected');
    // Print connection details so we know exactly which DB/host we're using
    console.log('Mongoose connection db name:', mongoose.connection && mongoose.connection.name);
    console.log('Mongoose connection host:', mongoose.connection && mongoose.connection.host);
  } catch (err) {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

async function startServer() {
  await connectDB();

  // mount routers (wrapped in try/catch so server still starts even if router has issues)
  try {
    const otpRouter = require('./routes/otp');
    app.use('/api/otp', otpRouter);
    console.log('Mounted /api/otp');
  } catch (e) {
    console.log('No ./routes/otp mounted (file missing or error):', e && e.code ? e.code : e.message || e);
  }

  try {
    const authRouter = require('./routes/auth');
    app.use('/api/auth', authRouter);
    console.log('Mounted /api/auth');
  } catch (e) {
    console.log('No ./routes/auth mounted (file missing or error):', e && e.code ? e.code : e.message || e);
  }

  // health route (optional) — quick sanity check
  app.get('/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));

  // fallback 404
  app.use((req, res) => res.status(404).send('Cannot ' + req.method + ' ' + req.path));

  // start listening
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}

// run
startServer().catch((err) => {
  console.error('Failed to start server:', err && (err.stack || err));
  process.exit(1);
});