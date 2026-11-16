/**
 * Navbar / Header Component
 * 
 * WHAT IT DOES:
 * Displays section headings, mobile hamburger trigger, and top quick actions
 * (e.g., Reset Demo, Add Book, Place Order).
 */

import React from 'react';

const titles = {
  dashboard: {
    title: 'Dashboard',
    fullTitle: 'Administrator Dashboard',
    desc: 'Real-time overview of catalog, stock, customer orders, and revenue.',
  },
  books: {
    title: 'Books',
    fullTitle: 'Book Management',
    desc: 'Add, view, edit, search, and delete books in the catalog.',
  },
  inventory: {
    title: 'Inventory',
    fullTitle: 'Inventory Management',
    desc: 'Monitor stock levels, identify out-of-stock titles, and adjust quantities.',
  },
  orders: {
    title: 'Orders',
    fullTitle: 'Customer Orders',
    desc: 'Create customer orders with automatic price calculation & stock reduction.',
  },
  sales: {
    title: 'Sales',
    fullTitle: 'Sales Summary & Analytics',
    desc: 'Financial breakdown of sales, orders, and category revenue performance.',
  },
};

export default function Navbar({
  activeTab,
  onResetDemo,
  onOpenAddBook,
  onOpenNewOrder,
  onToggleMobileNav,
}) {
  const current = titles[activeTab] || titles.dashboard;

  return (
    <header className="header">
      <div className="header-left">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={onToggleMobileNav}
          aria-label="Toggle Navigation Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="page-title">
          <h2>
            <span className="desktop-title">{current.fullTitle}</span>
            <span className="mobile-title">{current.title}</span>
          </h2>
          <p className="page-desc">{current.desc}</p>
        </div>
      </div>

      <div className="header-actions">
        {/* Quick action buttons depending on active section */}
        {activeTab === 'books' && (
          <button className="btn btn-primary btn-sm-mobile" onClick={onOpenAddBook}>
            + Add Book
          </button>
        )}

        {activeTab === 'orders' && (
          <button className="btn btn-primary btn-sm-mobile" onClick={onOpenNewOrder}>
            + New Order
          </button>
        )}

        {/* Global Demo Reset Button */}
        <button
          className="btn btn-outline btn-sm-mobile"
          title="Reset database with sample demo records"
          onClick={onResetDemo}
        >
          <span className="reset-icon">🔄</span>
          <span className="reset-text">Reset Demo</span>
        </button>
      </div>
    </header>
  );
}
