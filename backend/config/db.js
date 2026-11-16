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
 * 1. Attempts to connect to the standard MongoDB URI (e.g., mongodb://127.0.0.1:27017/booknest).
 * 2. If a local MongoDB server is not running (common on college lab computers),
 *    it gracefully launches an embedded in-memory MongoDB server so the project
 *    runs immediately without complex setup or crashes during a viva demonstration.
 */

const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/booknest';

  try {
    // Attempt connecting to the configured MongoDB instance with a 3-second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] Successfully connected to MongoDB: ${uri}`);
  } catch (error) {
    console.warn(`[Database] Could not connect to local MongoDB (${error.message}).`);
    console.log('[Database] Starting embedded MongoDB Memory Server for seamless demonstration...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      
      await mongoose.connect(memUri);
      console.log(`[Database] Connected to embedded MongoDB at: ${memUri}`);
      console.log('[Database] Ready for viva and laboratory demonstration.');
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
