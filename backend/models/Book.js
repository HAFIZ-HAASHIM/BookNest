/**
 * Book Model
 * 
 * WHAT IT DOES:
 * Defines the MongoDB schema and model for books in the BookNest catalog.
 * 
 * WHY IT IS NEEDED:
 * MongoDB is schema-less by default. Mongoose enforces strict schema rules,
 * data types, default values, and validations before saving data to the database.
 * 
 * HOW IT WORKS:
 * Defines fields: title, author, category, price, quantity, and timestamps.
 * When Mongoose compiles this schema into a model, it automatically creates
 * and maps to the 'books' collection in MongoDB.
 */

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'General',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

// Virtual property to easily determine if the book is in stock
bookSchema.virtual('inStock').get(function () {
  return this.quantity > 0;
});

// Configure JSON serialization to include virtual properties
bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
