/**
 * Inventory Management Page
 * 
 * WHAT IT DOES:
 * Dedicated view to monitor stock levels, adjust inventory quantities,
 * and track out-of-stock or low-stock items.
 * 
 * WHY IT IS NEEDED:
 * Fulfills Feature 3 (INVENTORY MANAGEMENT):
 * - Display available stock
 * - Update book quantities
 * - Show out-of-stock books
 * 
 * HOW IT WORKS:
 * Fetches books with stock status filters, allows 1-click + / - adjustments
 * or full custom quantity edits using `api.updateStock()`.
 */

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Inventory({ onOpenStockModal, refreshTrigger, showToast }) {
  const [books, setBooks] = useState([]);
  const [stockStatus, setStockStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const res = await api.getBooks({ stockStatus });
      if (res.success) {
        setBooks(res.data);
      }
    } catch (err) {
      showToast('Error loading inventory data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [stockStatus, refreshTrigger]);

  // Quick increment/decrement handler
  const handleQuickAdjust = async (book, delta) => {
    const updatedQty = Math.max(0, book.quantity + delta);
    try {
      const res = await api.updateStock(book._id, updatedQty);
      if (res.success) {
        showToast(`Stock for "${book.title}" updated to ${updatedQty}`, 'success');
        loadInventory();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update stock', 'error');
    }
  };

  // Inventory stats summary
  const totalUnits = books.reduce((acc, b) => acc + (b.quantity || 0), 0);
  const outOfStockCount = books.filter((b) => b.quantity <= 0).length;
  const lowStockCount = books.filter((b) => b.quantity > 0 && b.quantity <= 5).length;

  return (
    <div>
      {/* Stock summary mini-cards */}
      <div className="stats-grid" style={{ marginBottom: '20px' }}>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total Inventory Units</h3>
            <div className="stat-value">{totalUnits}</div>
            <div className="stat-subtext">Across {books.length} title(s) listed</div>
          </div>
          <div className="stat-icon-wrapper icon-blue">📦</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Low Stock Alerts</h3>
            <div className="stat-value" style={{ color: '#d97706' }}>
              {lowStockCount}
            </div>
            <div className="stat-subtext">5 or fewer units remaining</div>
          </div>
          <div className="stat-icon-wrapper icon-amber">⚠️</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Out of Stock</h3>
            <div className="stat-value" style={{ color: '#dc2626' }}>
              {outOfStockCount}
            </div>
            <div className="stat-subtext">Requires immediate restocking</div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
            🚫
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="toolbar">
        <div className="filters-group">
          <button
            className={`btn ${stockStatus === 'all' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setStockStatus('all')}
          >
            All Inventory
          </button>
          <button
            className={`btn ${stockStatus === 'in-stock' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setStockStatus('in-stock')}
          >
            In Stock
          </button>
          <button
            className={`btn ${stockStatus === 'low-stock' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setStockStatus('low-stock')}
          >
            Low Stock (&le; 5)
          </button>
          <button
            className={`btn ${stockStatus === 'out-of-stock' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setStockStatus('out-of-stock')}
          >
            Out of Stock (0)
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">📦 Stock Inventory Table</span>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading inventory status...</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="table-responsive desktop-only-view">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Category</th>
                    <th>Unit Price</th>
                    <th>Available Quantity</th>
                    <th>Inventory Status</th>
                    <th style={{ textAlign: 'right' }}>Quick Adjust</th>
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
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>by {book.author}</div>
                          </td>
                          <td>
                            <span className="badge badge-category">{book.category}</span>
                          </td>
                          <td style={{ fontWeight: 500 }}>${book.price.toFixed(2)}</td>
                          <td>
                            <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                              {book.quantity}
                            </span>{' '}
                            units
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
                                title="Decrease quantity by 1"
                                disabled={book.quantity <= 0}
                                onClick={() => handleQuickAdjust(book, -1)}
                              >
                                - 1
                              </button>
                              <button
                                className="btn btn-outline btn-sm"
                                title="Increase quantity by 1"
                                onClick={() => handleQuickAdjust(book, 1)}
                              >
                                + 1
                              </button>
                              <button
                                className="btn btn-outline btn-sm"
                                title="Increase quantity by 5"
                                onClick={() => handleQuickAdjust(book, 5)}
                              >
                                + 5
                              </button>
                            </div>
                          </td>
                          <td>
                            <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => onOpenStockModal(book)}
                              >
                                Update Stock
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        <div className="empty-icon">📦</div>
                        <p>No books match this inventory filter.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="mobile-only-cards-view">
              {books.length > 0 ? (
                books.map((book) => {
                  const isOutOfStock = book.quantity <= 0;
                  const isLowStock = book.quantity > 0 && book.quantity <= 5;

                  return (
                    <div key={book._id} className="mobile-card mobile-inventory-card">
                      <div className="mobile-card-header">
                        <div>
                          <div className="mobile-card-title">{book.title}</div>
                          <div className="mobile-card-subtitle">by {book.author}</div>
                        </div>
                        <div>
                          {isOutOfStock ? (
                            <span className="badge badge-out-of-stock">Out of Stock</span>
                          ) : isLowStock ? (
                            <span className="badge badge-low-stock">Low Stock</span>
                          ) : (
                            <span className="badge badge-in-stock">In Stock</span>
                          )}
                        </div>
                      </div>

                      <div className="mobile-card-body">
                        <div className="mobile-card-info-row">
                          <span className="info-label">Category:</span>
                          <span className="badge badge-category">{book.category}</span>
                        </div>
                        <div className="mobile-card-info-row">
                          <span className="info-label">Unit Price:</span>
                          <span className="info-value" style={{ fontWeight: 600 }}>${book.price.toFixed(2)}</span>
                        </div>
                        <div className="mobile-card-info-row">
                          <span className="info-label">In Stock:</span>
                          <span className="info-value" style={{ fontWeight: 700, fontSize: '1rem', color: isOutOfStock ? '#dc2626' : isLowStock ? '#d97706' : '#16a34a' }}>
                            {book.quantity} units
                          </span>
                        </div>
                      </div>

                      <div className="mobile-card-actions">
                        <div className="mobile-adjust-group">
                          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Adjust:</span>
                          <div className="mobile-btn-pill-group">
                            <button
                              className="btn btn-outline btn-sm"
                              disabled={book.quantity <= 0}
                              onClick={() => handleQuickAdjust(book, -1)}
                            >
                              -1
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => handleQuickAdjust(book, 1)}
                            >
                              +1
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => handleQuickAdjust(book, 5)}
                            >
                              +5
                            </button>
                          </div>
                        </div>
                        <button
                          className="btn btn-primary btn-sm mobile-action-btn"
                          onClick={() => onOpenStockModal(book)}
                        >
                          Update Stock
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <p>No books match this inventory filter.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
