/**
 * OrderModal Component
 * 
 * WHAT IT DOES:
 * Allows the administrator to create a new customer order.
 * 
 * WHY IT IS NEEDED:
 * Fulfills the Core Order Management requirements:
 * 1. Customer information input (name, email, phone).
 * 2. Book selection dropdown showing unit price & live available stock.
 * 3. Quantity input that prevents ordering more than available stock.
 * 4. Automatic calculation of total order price in real time.
 * 
 * HOW IT WORKS:
 * Watches the selected book and quantity using `useState`.
 * Formula: `totalPrice = quantity * selectedBook.price`.
 */

import React, { useState, useEffect } from 'react';

export default function OrderModal({ isOpen, onClose, onPlaceOrder, books }) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  // Find currently selected book object
  const selectedBook = books.find((b) => b._id === selectedBookId) || null;

  // Live total price calculation
  const unitPrice = selectedBook ? selectedBook.price : 0;
  const totalPrice = selectedBook && quantity > 0 ? (quantity * unitPrice).toFixed(2) : '0.00';
  const availableStock = selectedBook ? selectedBook.quantity : 0;

  // Reset modal state when opening
  useEffect(() => {
    if (isOpen) {
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setError('');
      // Set default selected book to first in-stock book if available
      const firstInStock = books.find((b) => b.quantity > 0);
      setSelectedBookId(firstInStock ? firstInStock._id : books[0]?._id || '');
      setQuantity(1);
    }
  }, [isOpen, books]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim()) {
      setError('Please provide the customer name.');
      return;
    }

    if (!selectedBook) {
      setError('Please select a book from the list.');
      return;
    }

    const orderQty = parseInt(quantity, 10);
    if (isNaN(orderQty) || orderQty <= 0) {
      setError('Order quantity must be at least 1.');
      return;
    }

    // Client-side stock check validation
    if (orderQty > availableStock) {
      setError(`Cannot place order! Requested ${orderQty} units, but only ${availableStock} in stock.`);
      return;
    }

    onPlaceOrder({
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      bookId: selectedBook._id,
      quantity: orderQty,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create Customer Order</h3>
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
                  padding: '10px 12px',
                  borderRadius: '6px',
                  marginBottom: '14px',
                  fontSize: '0.84rem',
                  border: '1px solid #fecaca',
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="customerName">Customer Full Name *</label>
              <input
                id="customerName"
                type="text"
                className="form-control"
                placeholder="e.g., Jane Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customerEmail">Customer Email</label>
                <input
                  id="customerEmail"
                  type="email"
                  className="form-control"
                  placeholder="jane@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="customerPhone">Phone Number</label>
                <input
                  id="customerPhone"
                  type="tel"
                  className="form-control"
                  placeholder="+91 98765 43210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bookSelect">Select Book *</label>
              <select
                id="bookSelect"
                className="form-control"
                value={selectedBookId}
                onChange={(e) => {
                  setSelectedBookId(e.target.value);
                  setQuantity(1);
                  setError('');
                }}
                required
              >
                {books.map((b) => (
                  <option key={b._id} value={b._id} disabled={b.quantity <= 0}>
                    {b.title} — ${b.price.toFixed(2)} ({b.quantity <= 0 ? 'OUT OF STOCK' : `${b.quantity} in stock`})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Order Quantity *</label>
              <input
                id="quantity"
                type="number"
                min="1"
                max={availableStock > 0 ? availableStock : 1}
                className="form-control"
                value={quantity}
                disabled={availableStock <= 0}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
              <div className="form-help-text">
                Available in stock: <strong>{availableStock}</strong> unit(s)
              </div>
            </div>

            {/* Live Automated Price Calculation Box */}
            <div className="calc-box">
              <div className="calc-row">
                <span>Unit Price:</span>
                <span>${unitPrice.toFixed(2)}</span>
              </div>
              <div className="calc-row">
                <span>Quantity:</span>
                <span>&times; {quantity || 0}</span>
              </div>
              <div className="calc-row total">
                <span>Calculated Total:</span>
                <span>${totalPrice}</span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={availableStock <= 0 || parseInt(quantity, 10) > availableStock}
            >
              Complete Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
