/**
 * Orders Management Page
 * 
 * WHAT IT DOES:
 * Displays all past customer orders and provides the interface to place new orders.
 * 
 * WHY IT IS NEEDED:
 * Fulfills Feature 4 (ORDER MANAGEMENT):
 * - Create a simple customer order
 * - Select a book and quantity
 * - Calculate total price automatically
 * - Save order details in MongoDB
 * - Automatically reduce book stock after a successful order
 * - Display all customer orders
 * 
 * HOW IT WORKS:
 * Retrieves order history via `api.getOrders()` and triggers the order creation
 * workflow with validation.
 */

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Orders({ onOpenNewOrder, refreshTrigger, showToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getOrders();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      showToast('Error loading customer orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [refreshTrigger]);

  // Aggregate order stats
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.totalPrice || 0), 0);
  const totalItemsSold = orders.reduce((sum, ord) => sum + (ord.quantity || 0), 0);

  return (
    <div>
      {/* Mini Metric Cards */}
      <div className="stats-grid" style={{ marginBottom: '20px' }}>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total Orders</h3>
            <div className="stat-value">{totalOrdersCount}</div>
            <div className="stat-subtext">Processed transactions</div>
          </div>
          <div className="stat-icon-wrapper icon-purple">🛒</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Books Sold</h3>
            <div className="stat-value">{totalItemsSold}</div>
            <div className="stat-subtext">Total individual copies sold</div>
          </div>
          <div className="stat-icon-wrapper icon-green">📚</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Orders Revenue</h3>
            <div className="stat-value" style={{ color: '#2563eb' }}>
              ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="stat-subtext">Cumulative order earnings</div>
          </div>
          <div className="stat-icon-wrapper icon-blue">💰</div>
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            🛒 Customer Orders History ({orders.length} {orders.length === 1 ? 'Order' : 'Orders'})
          </span>
          <button className="btn btn-primary" onClick={onOpenNewOrder}>
            + Place New Order
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading customer order history...</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="table-responsive desktop-only-view">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date & Time</th>
                    <th>Customer Name</th>
                    <th>Contact</th>
                    <th>Book Purchased</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => {
                      const formattedDate = new Date(order.createdAt).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      return (
                        <tr key={order._id}>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#64748b' }}>
                            #{order._id.slice(-6).toUpperCase()}
                          </td>
                          <td style={{ fontSize: '0.82rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                            {formattedDate}
                          </td>
                          <td style={{ fontWeight: 600 }}>{order.customerName}</td>
                          <td style={{ fontSize: '0.82rem', color: '#475569' }}>
                            {order.customerEmail || order.customerPhone || '—'}
                          </td>
                          <td>
                            <div style={{ fontWeight: 500 }}>{order.bookTitle}</div>
                          </td>
                          <td style={{ fontWeight: 600 }}>{order.quantity}</td>
                          <td>${order.unitPrice.toFixed(2)}</td>
                          <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                            ${order.totalPrice.toFixed(2)}
                          </td>
                          <td>
                            <span className="badge badge-order-completed">
                              {order.status || 'Completed'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" className="empty-state">
                        <div className="empty-icon">🛒</div>
                        <p>No customer orders recorded yet.</p>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ marginTop: '12px' }}
                          onClick={onOpenNewOrder}
                        >
                          Create First Order
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Order Cards View */}
            <div className="mobile-only-cards-view">
              {orders.length > 0 ? (
                orders.map((order) => {
                  const formattedDate = new Date(order.createdAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div key={order._id} className="mobile-order-card">
                      <div className="mobile-order-header">
                        <div>
                          <span className="mobile-order-id">#{order._id.slice(-6).toUpperCase()}</span>
                          <span className="mobile-order-date">{formattedDate}</span>
                        </div>
                        <span className="badge badge-order-completed">{order.status || 'Completed'}</span>
                      </div>
                      
                      <div className="mobile-order-customer-info">
                        <div className="mobile-order-customer-name">{order.customerName}</div>
                        {(order.customerEmail || order.customerPhone) && (
                          <div className="mobile-order-contact">{order.customerEmail || order.customerPhone}</div>
                        )}
                      </div>

                      <div className="mobile-order-book-title">
                        📖 {order.bookTitle}
                      </div>

                      <div className="mobile-order-pricing-row">
                        <span className="mobile-order-qty-pill">
                          {order.quantity} {order.quantity === 1 ? 'copy' : 'copies'} &times; ${order.unitPrice.toFixed(2)}
                        </span>
                        <span className="mobile-order-total-price">
                          ${order.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🛒</div>
                  <p>No customer orders recorded yet.</p>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: '12px' }}
                    onClick={onOpenNewOrder}
                  >
                    Create First Order
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
