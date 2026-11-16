/**
 * StockModal Component
 * 
 * WHAT IT DOES:
 * Provides a dedicated modal to quickly update the stock quantity of a specific book.
 * 
 * WHY IT IS NEEDED:
 * Fulfills the Inventory Management requirement: "Update book quantities" and
 * "Manage out-of-stock books" directly with clear feedback.
 */

import React, { useState, useEffect } from 'react';

export default function StockModal({ isOpen, onClose, onUpdateStock, book }) {
  const [newQuantity, setNewQuantity] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (book) {
      setNewQuantity(book.quantity !== undefined ? book.quantity : 0);
      setError('');
    }
  }, [book, isOpen]);

  if (!isOpen || !book) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty < 0) {
      setError('Please enter a valid non-negative stock quantity.');
      return;
    }
    onUpdateStock(book._id, qty);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Update Inventory Stock</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ color: '#dc2626', marginBottom: '12px', fontSize: '0.84rem' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{book.title}</div>
              <div style={{ color: '#64748b', fontSize: '0.82rem' }}>by {book.author}</div>
            </div>

            <div className="form-group">
              <label htmlFor="stockQty">New Stock Quantity *</label>
              <input
                id="stockQty"
                type="number"
                min="0"
                step="1"
                className="form-control"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                required
              />
              <div className="form-help-text">
                Current stock: <strong>{book.quantity}</strong> units. Set to 0 to mark as Out of Stock.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setNewQuantity((prev) => Math.max(0, parseInt(prev || 0, 10) - 1))}
              >
                - 1
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setNewQuantity((prev) => parseInt(prev || 0, 10) + 1)}
              >
                + 1
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setNewQuantity((prev) => parseInt(prev || 0, 10) + 5)}
              >
                + 5
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setNewQuantity((prev) => parseInt(prev || 0, 10) + 10)}
              >
                + 10
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setNewQuantity(0)}
              >
                Set Out of Stock
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Quantity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
