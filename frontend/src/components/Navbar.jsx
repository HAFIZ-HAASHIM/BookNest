/**
 * Navbar / Header Component
 * 
 * WHAT IT DOES:
 * Displays the current section heading, subtitle, and top quick actions like
 * reseeding demo data or quick refresh.
 * 
 * WHY IT IS NEEDED:
 * Provides clear context to the user/evaluator on where they are in the application,
 * and gives a one-click button to reset sample data during a viva demonstration.
 */

import React from 'react';

const titles = {
  dashboard: {
    title: 'Administrator Dashboard',
    desc: 'Real-time overview of catalog, stock, customer orders, and revenue.',
  },
  books: {
    title: 'Book Management',
    desc: 'Add, view, edit, search, and delete books in the catalog.',
  },
  inventory: {
    title: 'Inventory Management',
    desc: 'Monitor stock levels, identify out-of-stock titles, and adjust quantities.',
  },
  orders: {
    title: 'Customer Orders',
    desc: 'Create new customer orders with automatic price calculation & stock reduction.',
  },
  sales: {
    title: 'Sales Summary & Analytics',
    desc: 'Financial breakdown of sales, orders, and category revenue performance.',
  },
};

export default function Navbar({ activeTab, onResetDemo, onOpenAddBook, onOpenNewOrder }) {
  const current = titles[activeTab] || titles.dashboard;

  return (
    <header className="header">
      <div className="page-title">
        <h2>{current.title}</h2>
        <p>{current.desc}</p>
      </div>

      <div className="header-actions">
        {/* Quick action buttons depending on context */}
        {activeTab === 'books' && (
          <button className="btn btn-primary" onClick={onOpenAddBook}>
            + Add New Book
          </button>
        )}

        {activeTab === 'orders' && (
          <button className="btn btn-primary" onClick={onOpenNewOrder}>
            + Place New Order
          </button>
        )}

        {/* Global Demo Reset Button */}
        <button
          className="btn btn-outline"
          title="Reset database with sample demo records"
          onClick={onResetDemo}
        >
          🔄 Reset Demo Data
        </button>
      </div>
    </header>
  );
}
