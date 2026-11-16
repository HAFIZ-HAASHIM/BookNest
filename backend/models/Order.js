/**
 * Order Model
 * 
 * WHAT IT DOES:
 * Defines the MongoDB schema and model for customer purchase orders.
 * 
 * WHY IT IS NEEDED:
 * Records every transaction in the bookstore, keeping track of which customer
 * purchased which book, how many units, and the total cost.
 * 
 * HOW IT WORKS:
 * References the Book model via ObjectId (relational style referencing in MongoDB)
 * and also snapshots bookTitle and unitPrice at the time of purchase.
 */

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      default: '',
    },
    customerPhone: {
      type: String,
      trim: true,
      default: '',
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book reference is required'],
    },
    bookTitle: {
      type: String,
      required: [true, 'Book title snapshot is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Order quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative'],
    },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'Cancelled'],
      default: 'Completed',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
