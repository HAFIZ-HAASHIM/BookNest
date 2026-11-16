/**
 * Books Management Page
 * 
 * WHAT IT DOES:
 * Provides full CRUD (Create, Read, Update, Delete) management for the bookstore.
 * 
 * WHY IT IS NEEDED:
 * Fulfills Feature 2 (BOOK MANAGEMENT):
 * - Add a new book
 * - Enter book title, author, category, price and quantity
 * - View all books in a table
 * - Edit book details
 * - Delete books
 * - Search books by title or author
 * 
 * HOW IT WORKS:
 * Maintains `books` list state, listens to search and category filter changes,
 * and calls the Express API endpoints via `api.js`.
 */

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const CATEGORIES = [
  'All',
  'Fiction',
  'Technology',
  'Science',
  'Business',
  'Self-Help',
  'Literature',
  'History',
  'General',
];

export default function Books({
  onOpenAddBook,
  onOpenEditBook,
  onOpenStockModal,
  refreshTrigger,
  showToast,
}) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Fetch books from backend
  const loadBooks = async () => {
    try {
      setLoading(true);
      const res = await api.getBooks({ search, category });
      if (res.success) {
        setBooks(res.data);
      }
    } catch (err) {
      showToast('Error loading books from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever search or category changes or global refresh occurs
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadBooks();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, refreshTrigger]);

  // Handle Book Deletion with confirmation
  const handleDelete = async (book) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${book.title}" by ${book.author}?`
    );
    if (!confirmed) return;

    try {
      const res = await api.deleteBook(book._id);
      if (res.success) {
        showToast(`Deleted "${book.title}" successfully`, 'success');
        loadBooks();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete book', 'error');
    }
  };

  return (
    <div>
      {/* Search and Filter Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              &times;
            </button>
          )}
        </div>

        <div className="filters-group">
          <select
            className="select-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          <button className="btn btn-primary" onClick={onOpenAddBook}>
            + Add New Book
          </button>
        </div>
      </div>

      {/* Book Catalog Table Card */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            📚 Book Catalog ({books.length} {books.length === 1 ? 'Book' : 'Books'} found)
          </span>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading book collection...</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="table-responsive desktop-only-view">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Price ($)</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.length > 0 ? (
                    books.map((book) => {
                      const isOutOfStock = book.quantity <= 0;
                      const isLowStock = book.quantity > 0 && book.quantity <= 5;

                      return (
                        <tr key={book._id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{book.title}</div>
                          </td>
                          <td style={{ color: '#475569' }}>{book.author}</td>
                          <td>
                            <span className="badge badge-category">{book.category}</span>
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            ${book.price.toFixed(2)}
                          </td>
                          <td>
                            <span style={{ fontWeight: 600 }}>{book.quantity}</span> units
                          </td>
                          <td>
                            {isOutOfStock ? (
                              <span className="badge badge-out-of-stock">Out of Stock</span>
                            ) : isLowStock ? (
                              <span className="badge badge-low-stock">Low Stock</span>
                            ) : (
                              <span className="badge badge-in-stock">In Stock</span>
                            )}
                          </td>
                          <td>
                            <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                              <button
                                className="btn btn-outline btn-sm"
                                title="Quick stock update"
                                onClick={() => onOpenStockModal(book)}
                              >
                                Stock
                              </button>
                              <button
                                className="btn btn-outline btn-sm"
                                title="Edit book details"
                                onClick={() => onOpenEditBook(book)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                title="Delete book from catalog"
                                onClick={() => handleDelete(book)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        <div className="empty-icon">📖</div>
                        <p>No books found matching your search.</p>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ marginTop: '10px' }}
                          onClick={() => {
                            setSearch('');
                            setCategory('All');
                          }}
                        >
                          Clear Filters
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Book Cards View */}
            <div className="mobile-only-cards-view">
              {books.length > 0 ? (
                books.map((book) => {
                  const isOutOfStock = book.quantity <= 0;
                  const isLowStock = book.quantity > 0 && book.quantity <= 5;

                  return (
                    <div key={book._id} className="mobile-book-card">
                      <div className="mobile-book-header">
                        <div>
                          <div className="mobile-book-title">{book.title}</div>
                          <div className="mobile-book-author">by {book.author}</div>
                        </div>
                        <span className="badge badge-category">{book.category}</span>
                      </div>

                      <div className="mobile-book-meta-row">
                        <span className="mobile-book-price">${book.price.toFixed(2)}</span>
                        <div>
                          <span style={{ fontSize: '0.84rem', marginRight: '6px' }}>Stock: <strong>{book.quantity}</strong></span>
                          {isOutOfStock ? (
                            <span className="badge badge-out-of-stock">Out</span>
                          ) : isLowStock ? (
                            <span className="badge badge-low-stock">Low</span>
                          ) : (
                            <span className="badge badge-in-stock">In Stock</span>
                          )}
                        </div>
                      </div>

                      <div className="mobile-book-actions">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => onOpenStockModal(book)}
                        >
                          📦 Stock
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => onOpenEditBook(book)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(book)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📖</div>
                  <p>No books found matching your search.</p>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: '10px' }}
                    onClick={() => {
                      setSearch('');
                      setCategory('All');
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
