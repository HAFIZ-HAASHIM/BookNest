/**
 * Book Controller
 * 
 * WHAT IT DOES:
 * Handles all business logic and CRUD (Create, Read, Update, Delete) operations
 * for books in the store.
 * 
 * WHY IT IS NEEDED:
 * Separating controller logic from route declarations follows the MVC
 * (Model-View-Controller) architectural pattern, making the code modular,
 * easy to maintain, and simple to explain during viva.
 * 
 * HOW IT WORKS:
 * Receives incoming HTTP requests (req), interacts with the Mongoose `Book` model,
 * and sends formatted JSON HTTP responses (res).
 */

const Book = require('../models/Book');

// @desc    Get all books (with optional search and category filter)
// @route   GET /api/books
exports.getBooks = async (req, res) => {
  try {
    const { search, category, stockStatus } = req.query;
    let query = {};

    // Search filter: matches title or author case-insensitively
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { author: searchRegex }];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Stock status filter
    if (stockStatus === 'out-of-stock') {
      query.quantity = { $lte: 0 };
    } else if (stockStatus === 'low-stock') {
      query.quantity = { $gt: 0, $lte: 5 };
    } else if (stockStatus === 'in-stock') {
      query.quantity = { $gt: 0 };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve books from database',
      error: error.message,
    });
  }
};

// @desc    Get a single book by ID
// @route   GET /api/books/:id
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found with the provided ID',
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching book',
      error: error.message,
    });
  }
};

// @desc    Add a new book
// @route   POST /api/books
exports.createBook = async (req, res) => {
  try {
    const { title, author, category, price, quantity } = req.body;

    // Basic Input Validation
    if (!title || !author || price === undefined || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, author, price, and quantity',
      });
    }

    if (Number(price) < 0 || Number(quantity) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price and Quantity cannot be negative numbers',
      });
    }

    const newBook = await Book.create({
      title: title.trim(),
      author: author.trim(),
      category: category ? category.trim() : 'General',
      price: Number(price),
      quantity: Number(quantity),
    });

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: newBook,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to add book',
      error: error.message,
    });
  }
};

// @desc    Update book details
// @route   PUT /api/books/:id
exports.updateBook = async (req, res) => {
  try {
    const { title, author, category, price, quantity } = req.body;

    let book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found to update',
      });
    }

    if (price !== undefined && Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative',
      });
    }

    if (quantity !== undefined && Number(quantity) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity cannot be negative',
      });
    }

    book.title = title !== undefined ? title.trim() : book.title;
    book.author = author !== undefined ? author.trim() : book.author;
    book.category = category !== undefined ? category.trim() : book.category;
    book.price = price !== undefined ? Number(price) : book.price;
    book.quantity = quantity !== undefined ? Number(quantity) : book.quantity;

    const updatedBook = await book.save();

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update book',
      error: error.message,
    });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found to delete',
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete book',
      error: error.message,
    });
  }
};

// @desc    Update stock quantity directly (Inventory feature)
// @route   PATCH /api/books/:id/stock
exports.updateStock = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity === undefined || Number(quantity) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid non-negative quantity is required',
      });
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { quantity: Number(quantity) },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: book,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update stock',
      error: error.message,
    });
  }
};
