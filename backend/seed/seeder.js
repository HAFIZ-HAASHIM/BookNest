/**
 * Database Seeder Script
 * 
 * WHAT IT DOES:
 * Resets and populates the MongoDB database with initial sample books and orders.
 * 
 * HOW TO RUN:
 * In backend folder: `node seed/seeder.js` or `npm run seed`
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../models/Book');
const Order = require('../models/Order');
const { sampleBooks } = require('./seedData');

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/booknest';

  try {
    console.log('[Seeder] Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('[Seeder] Connected successfully.');

    // Clear existing collections
    await Book.deleteMany();
    await Order.deleteMany();
    console.log('[Seeder] Cleared existing books and orders.');

    // Insert sample books
    const createdBooks = await Book.insertMany(sampleBooks);
    console.log(`[Seeder] Inserted ${createdBooks.length} sample books.`);

    // Insert initial realistic sample orders
    const sampleOrders = [
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
      {
        customerName: 'Rohan Verma',
        customerEmail: 'rohan.v@example.com',
        customerPhone: '+91 99887 76655',
        book: createdBooks[2]._id,
        bookTitle: createdBooks[2].title,
        quantity: 3,
        unitPrice: createdBooks[2].price,
        totalPrice: parseFloat((createdBooks[2].price * 3).toFixed(2)),
        status: 'Completed',
      },
    ];

    await Order.insertMany(sampleOrders);
    console.log(`[Seeder] Inserted ${sampleOrders.length} initial sample orders.`);

    console.log('[Seeder] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder] Error during database seeding:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
