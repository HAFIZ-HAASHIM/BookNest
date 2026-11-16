/**
 * BookNest - Express Server Entry Point
 * 
 * WHAT IT DOES:
 * Initializes Express, configures middleware, manages database connection
 * via request-level middleware, mounts API routes, and exports the app for Vercel.
 * 
 * VERCEL SERVERLESS COMPATIBILITY:
 * 1. Exports `app` for Vercel serverless execution.
 * 2. Connects to MongoDB via middleware before route execution, preventing race conditions.
 * 3. `app.listen()` only executes when run standalone locally (`require.main === module`).
 * 4. Returns structured JSON responses when database errors occur instead of crashing.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const Book = require('./models/Book');
const Order = require('./models/Order');
const { sampleBooks } = require('./seed/seedData');

// Route imports
const bookRoutes = require('./routes/bookRoutes');
const orderRoutes = require('./routes/orderRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ========================
// Global Middlewares
// ========================

// Enable Cross-Origin Resource Sharing for React frontend
app.use(cors());

// Parse incoming JSON payloads in request body
app.use(express.json());

// Request logger for debugging & demonstration
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);
  next();
});

// ========================
// Health Check Endpoint (Lightweight, No DB Requirement)
// ========================
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'Disconnected', 1: 'Connected', 2: 'Connecting', 3: 'Disconnecting' };

  res.status(200).json({
    success: true,
    message: 'BookNest API is running smoothly',
    database: states[dbState] || 'Unknown',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ========================
// Database Connection Middleware
// Ensures MongoDB connection is established before route handlers execute
// ========================
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('[Database Middleware Error]', error.message);
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Service temporarily unavailable.',
      error: process.env.NODE_ENV === 'production' ? 'Database unavailable' : error.message,
    });
  }
});

// ========================
// API Routes
// ========================

app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);

// Quick reset / reseed endpoint (Convenient for viva presentation reset)
app.post('/api/seed/reset', async (req, res) => {
  try {
    await Book.deleteMany();
    await Order.deleteMany();
    const createdBooks = await Book.insertMany(sampleBooks);
    
    await Order.insertMany([
      {
        customerName: 'Aarav Sharma',
        customerEmail: 'aarav.sharma@example.com',
        customerPhone: '+91 98765 43210',
        book: createdBooks[0]._id,
        bookTitle: createdBooks[0].title,
        quantity: 2,
        unitPrice: createdBooks[0].price,
        totalPrice: parseFloat((createdBooks[0].price * 2).toFixed(2)),
        status: 'Completed',
      },
      {
        customerName: 'Priya Patel',
        customerEmail: 'priya.patel@example.com',
        customerPhone: '+91 91234 56789',
        book: createdBooks[1]._id,
        bookTitle: createdBooks[1].title,
        quantity: 1,
        unitPrice: createdBooks[1].price,
        totalPrice: parseFloat((createdBooks[1].price * 1).toFixed(2)),
        status: 'Completed',
      },
    ]);

    res.status(200).json({
      success: true,
      message: 'Database reset and re-seeded successfully with demo data',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reset database',
      error: error.message,
    });
  }
});

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to BookNest API Server',
    endpoints: {
      books: '/api/books',
      orders: '/api/orders',
      stats: '/api/stats/dashboard',
      health: '/api/health',
    },
  });
});

// ========================
// 404 & Error Handlers
// ========================

// Catch unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ========================
// Standalone Local Server Startup
// Only starts HTTP listener when executed directly (node server.js),
// NOT when imported as a serverless function by Vercel
// ========================
if (require.main === module) {
  connectDB().then(async () => {
    try {
      const bookCount = await Book.countDocuments();
      if (bookCount === 0) {
        console.log('[Server] Database is empty. Auto-seeding initial books and orders...');
        const createdBooks = await Book.insertMany(sampleBooks);
        if (createdBooks.length >= 2) {
          await Order.insertMany([
            {
              customerName: 'Aarav Sharma',
              customerEmail: 'aarav.sharma@example.com',
              customerPhone: '+91 98765 43210',
              book: createdBooks[0]._id,
              bookTitle: createdBooks[0].title,
              quantity: 2,
              unitPrice: createdBooks[0].price,
              totalPrice: parseFloat((createdBooks[0].price * 2).toFixed(2)),
              status: 'Completed',
            },
            {
              customerName: 'Priya Patel',
              customerEmail: 'priya.patel@example.com',
              customerPhone: '+91 91234 56789',
              book: createdBooks[1]._id,
              bookTitle: createdBooks[1].title,
              quantity: 1,
              unitPrice: createdBooks[1].price,
              totalPrice: parseFloat((createdBooks[1].price * 1).toFixed(2)),
              status: 'Completed',
            },
          ]);
        }
        console.log('[Server] Auto-seed complete.');
      }
    } catch (seedErr) {
      console.warn('[Server] Auto-seed check error:', seedErr.message);
    }
  });

  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`  BookNest Backend Server running on port ${PORT}`);
    console.log(`  API Base URL: http://localhost:${PORT}`);
    console.log(`===============================================`);
  });
}

// Export Express app for Vercel Serverless
module.exports = app;
