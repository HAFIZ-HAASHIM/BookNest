/**
 * Order Controller
 * 
 * WHAT IT DOES:
 * Handles order placement, inventory deduction, and customer order history.
 * 
 * WHY IT IS NEEDED:
 * Ensures data integrity during purchasing:
 * 1. Checks if the book exists.
 * 2. Checks if requested quantity is available in stock.
 * 3. Calculates total price on the server side (never trust client price alone).
 * 4. Deducts the ordered quantity from book inventory.
 * 5. Saves the confirmed order record to MongoDB.
 * 
 * HOW IT WORKS:
 * Coordinates operations between the `Book` model and `Order` model.
 */

const Book = require('../models/Book');
const Order = require('../models/Order');

// @desc    Get all orders
// @route   GET /api/orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message,
    });
  }
};

// @desc    Create a new order (with stock validation & stock deduction)
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, bookId, quantity } = req.body;

    // 1. Validate incoming request body
    if (!customerName || !bookId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, book selection, and quantity are required',
      });
    }

    const orderQty = parseInt(quantity, 10);
    if (isNaN(orderQty) || orderQty <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Order quantity must be at least 1',
      });
    }

    // 2. Fetch the target book from the database
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Selected book does not exist in inventory',
      });
    }

    // 3. Stock Availability Check (Core requirement!)
    if (book.quantity < orderQty) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock! Only ${book.quantity} unit(s) available for "${book.title}".`,
      });
    }

    // 4. Calculate total price securely on server side
    const unitPrice = book.price;
    const totalPrice = parseFloat((orderQty * unitPrice).toFixed(2));

    // 5. Deduct stock from the book in inventory
    book.quantity -= orderQty;
    await book.save();

    // 6. Record order in MongoDB
    const order = await Order.create({
      customerName: customerName.trim(),
      customerEmail: customerEmail ? customerEmail.trim() : '',
      customerPhone: customerPhone ? customerPhone.trim() : '',
      book: book._id,
      bookTitle: book.title,
      quantity: orderQty,
      unitPrice: unitPrice,
      totalPrice: totalPrice,
      status: 'Completed',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully and stock updated',
      data: {
        order,
        remainingStock: book.quantity,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process order',
      error: error.message,
    });
  }
};
