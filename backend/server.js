/**
 * BookNest - Express Server Entry Point
 * 
 * WHAT IT DOES:
 * Initializes the Express application, configures global middleware,
 * connects to MongoDB, mounts API routes, and starts the HTTP server.
 * 
 * WHY IT IS NEEDED:
 * Acts as the centralized coordinator and gateway for all incoming backend requests
 * from the React frontend.
 * 
 * HOW IT WORKS:
 * 1. Loads configuration from .env.
 * 2. Connects to MongoDB via Mongoose.
 * 3. Applies JSON body-parsing and CORS middleware.
 * 4. Mounts modular route handlers (/api/books, /api/orders, /api/stats).
 * 5. Handles 404 and global errors gracefully.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
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

// Connect to MongoDB Database
connectDB().then(async () => {
  // Auto-seed if database is empty so viva demonstration has data immediately
  try {
    const bookCount = await Book.countDocuments();
    if (bookCount === 0) {
      console.log('[Server] Database is empty. Auto-seeding initial books and orders...');
      const createdBooks = await Book.insertMany(sampleBooks);
      
      if (createdBooks.length >= 3) {
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

// ========================
// Middlewares
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
// API Routes
// ========================

app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BookNest API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

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
// Start Server
// ========================
const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  BookNest Backend Server running on port ${PORT}`);
  console.log(`  API Base URL: http://localhost:${PORT}`);
  console.log(`===============================================`);
});

module.exports = app;
