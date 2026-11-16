/**
 * BookModal Component
 * 
 * WHAT IT DOES:
 * Provides a clean modal form for adding a new book or editing an existing book.
 * 
 * WHY IT IS NEEDED:
 * Fulfills the CRUD requirement: allows admins to input or update title, author,
 * category, price, and stock quantity without page reloads.
 * 
 * HOW IT WORKS:
 * Uses React state (`formData`) controlled components. Validates inputs before
 * passing the object up to the parent via `onSave`.
 */

import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  'Fiction',
  'Technology',
  'Science',
  'Business',
  'Self-Help',
  'Literature',
  'History',
  'General',
];

export default function BookModal({ isOpen, onClose, onSave, bookToEdit }) {
  const isEditing = Boolean(bookToEdit);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Fiction',
    price: '',
    quantity: '',
  });

  const [error, setError] = useState('');

  // Pre-fill form if editing an existing book
  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title || '',
        author: bookToEdit.author || '',
        category: bookToEdit.category || 'Fiction',
        price: bookToEdit.price !== undefined ? bookToEdit.price : '',
        quantity: bookToEdit.quantity !== undefined ? bookToEdit.quantity : '',
      });
    } else {
      setFormData({
        title: '',
        author: '',
        category: 'Fiction',
        price: '',
        quantity: '',
      });
    }
    setError('');
  }, [bookToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.title.trim() || !formData.author.trim()) {
      setError('Title and Author are required fields.');
      return;
    }

    const priceNum = parseFloat(formData.price);
    const qtyNum = parseInt(formData.quantity, 10);

    if (isNaN(priceNum) || priceNum < 0) {
      setError('Please enter a valid non-negative price.');
      return;
    }

    if (isNaN(qtyNum) || qtyNum < 0) {
      setError('Please enter a valid non-negative quantity.');
      return;
    }

    onSave({
      title: formData.title.trim(),
      author: formData.author.trim(),
      category: formData.category,
      price: priceNum,
      quantity: qtyNum,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditing ? 'Edit Book Details' : 'Add New Book to Catalog'}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  color: '#dc2626',
                  backgroundColor: '#fef2f2',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  marginBottom: '14px',
                  fontSize: '0.84rem',
                }}
              >
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="title">Book Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-control"
                placeholder="e.g., Clean Code"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Author Name *</label>
              <input
                id="author"
                name="author"
                type="text"
                className="form-control"
                placeholder="e.g., Robert C. Martin"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category / Genre *</label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price ($) *</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
                  placeholder="29.99"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Stock Quantity *</label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  step="1"
                  className="form-control"
                  placeholder="10"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Save Changes' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
