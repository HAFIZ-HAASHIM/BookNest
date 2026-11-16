/**
 * Book Routes
 * 
 * Maps HTTP methods and URL paths to Book Controller functions.
 * 
 * Endpoints:
 * GET    /api/books        - Fetch all books (with search/filter)
 * GET    /api/books/:id    - Fetch single book
 * POST   /api/books        - Create new book
 * PUT    /api/books/:id    - Update book
 * DELETE /api/books/:id    - Delete book
 * PATCH  /api/books/:id/stock - Quick update book quantity
 */

const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  updateStock,
} = require('../controllers/bookController');

router.route('/')
  .get(getBooks)
  .post(createBook);

router.route('/:id')
  .get(getBookById)
  .put(updateBook)
  .delete(deleteBook);

router.patch('/:id/stock', updateStock);

module.exports = router;
