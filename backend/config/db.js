/**
 * Database Connection Module
 * 
 * WHAT IT DOES:
 * Connects the Express backend to MongoDB using the Mongoose ODM library.
 * 
 * WHY IT IS NEEDED:
 * Node.js applications need a persistent data store to save books, inventory,
 * and customer orders.
 * 
 * HOW IT WORKS:
 * 1. In Production (e.g. deployed with MongoDB Atlas):
 *    - Reads the connection string strictly from process.env.MONGODB_URI.
 *    - Connects with appropriate timeouts for cloud TLS handshakes.
 *    - Never starts an in-memory fallback, ensuring data persistence and failing fast
 *      if cloud network credentials or IP whitelists are misconfigured.
 *    - Automatically masks sensitive passwords in server console logs.
 * 
 * 2. In Local Development / Testing:
 *    - Connects to process.env.MONGODB_URI (e.g. local mongodb://127.0.0.1:27017/booknest).
 *    - If no local MongoDB service is installed or running (common on college lab machines),
 *      gracefully starts MongoMemoryServer for immediate offline demonstration.
 */

const mongoose = require('mongoose');

let memoryServer = null;

// Helper function to mask database credentials in server logs
const sanitizeUri = (uri) => {
  if (!uri) return '';
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
};

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/booknest';

  // In production, ensure MONGODB_URI is provided
  if (isProduction && !process.env.MONGODB_URI) {
    console.error('[Database Error] MONGODB_URI environment variable is required in production.');
    process.exit(1);
  }

  try {
    // Cloud databases like MongoDB Atlas require more time for initial TLS/DNS resolution
    const connectionOptions = {
      serverSelectionTimeoutMS: isProduction ? 10000 : 3000,
    };

    await mongoose.connect(uri, connectionOptions);
    console.log(`[Database] Successfully connected to MongoDB: ${sanitizeUri(uri)}`);
  } catch (error) {
    console.error(`[Database] Connection failed: ${error.message}`);

    // Production policy: Never silently fallback to in-memory DB in production.
    // Cloud instances must persist data to MongoDB Atlas.
    if (isProduction) {
      console.error('[Database Error] Production application requires a valid MongoDB Atlas connection.');
      console.error('[Database Error] Please verify MONGODB_URI and MongoDB Atlas Network Access IP whitelist (0.0.0.0/0).');
      process.exit(1);
    }

    // Development/Lab policy: Fallback to embedded MongoDB Memory Server for offline demonstration
    console.warn('[Database] Local MongoDB not detected. Starting embedded MongoDB Memory Server for local development/demo...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      
      await mongoose.connect(memUri);
      console.log(`[Database] Connected to embedded MongoDB at: ${memUri}`);
      console.log('[Database] Ready for local development and laboratory demonstration.');
    } catch (memError) {
      console.error('[Database] Failed to initialize embedded MongoDB:', memError.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
    console.log('[Database] Disconnected from MongoDB.');
  } catch (err) {
    console.error('[Database] Error while disconnecting:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
