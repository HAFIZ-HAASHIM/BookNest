/**
 * Database Connection Module
 * 
 * WHAT IT DOES:
 * Connects the Express backend to MongoDB using Mongoose, optimized for both
 * Vercel Serverless Functions and Local Standalone Development.
 * 
 * SERVERLESS COMPATIBILITY:
 * - Uses a global connection cache (`global.mongoose`) across warm lambda invocations.
 * - Caches both the active connection (`conn`) and the pending connection promise (`promise`).
 * - Guarantees that concurrent requests share the exact same in-flight connection promise,
 *   preventing duplicate connections and connection-pool exhaustion on MongoDB Atlas.
 * - In Production: Strictly uses `process.env.MONGODB_URI`, masks credentials in logs,
 *   never uses in-memory DB, and throws errors instead of calling `process.exit(1)`.
 * - In Development: Falls back to embedded `MongoMemoryServer` if no local database is running.
 */

const mongoose = require('mongoose');

// Maintain global connection cache across serverless warm starts
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

let memoryServer = null;

// Helper function to safely mask credentials in logs
const sanitizeUri = (uri) => {
  if (!uri) return '';
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
};

const connectDB = async () => {
  // 1. If connection already established and ready, reuse it immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/booknest';

  // In production, MONGODB_URI is strictly required
  if (isProduction && !process.env.MONGODB_URI) {
    const errorMsg = 'MONGODB_URI environment variable is required in production.';
    console.error(`[Database Error] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  // 2. If no connection promise is in-flight, create one
  if (!cached.promise) {
    const connectionOptions = {
      serverSelectionTimeoutMS: isProduction ? 10000 : 3000,
      bufferCommands: false, // Disable Mongoose buffering to catch connection errors early
    };

    console.log(`[Database] Connecting to MongoDB: ${sanitizeUri(uri)}`);

    cached.promise = mongoose
      .connect(uri, connectionOptions)
      .then((mongooseInstance) => {
        console.log(`[Database] Successfully connected to MongoDB: ${sanitizeUri(uri)}`);
        return mongooseInstance;
      })
      .catch(async (error) => {
        // Reset promise so subsequent requests can retry
        cached.promise = null;

        // In Production: Never fallback to in-memory DB; throw error for Express middleware to handle
        if (isProduction) {
          console.error(`[Database Error] Production connection failed: ${error.message}`);
          throw new Error(`Production MongoDB connection failed: ${error.message}`);
        }

        // In Development/Test: Fallback to embedded MongoMemoryServer for offline lab demonstration
        console.warn(`[Database] Local MongoDB unreachable (${error.message}). Starting development in-memory database...`);
        try {
          const { MongoMemoryServer } = require('mongodb-memory-server');
          if (!memoryServer) {
            memoryServer = await MongoMemoryServer.create();
          }
          const memUri = memoryServer.getUri();
          const memInstance = await mongoose.connect(memUri);
          console.log(`[Database] Connected to embedded MongoDB at: ${memUri}`);
          return memInstance;
        } catch (memError) {
          console.error('[Database] Failed to initialize embedded MongoDB:', memError.message);
          throw memError;
        }
      });
  }

  // 3. Await the shared connection promise (handles concurrent requests safely)
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    throw err;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
      memoryServer = null;
    }
    cached.conn = null;
    cached.promise = null;
    console.log('[Database] Disconnected from MongoDB.');
  } catch (err) {
    console.error('[Database] Error while disconnecting:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
