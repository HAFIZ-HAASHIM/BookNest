/**
 * App.jsx - Main Application Component
 * 
 * WHAT IT DOES:
 * Orchestrates navigation, shared state, modal dialogs, and toast notifications.
 * 
 * WHY IT IS NEEDED:
 * Serves as the single root component for React, managing application-wide state
 * using standard React hooks (`useState`, `useEffect`) without needing Redux.
 * 
 * HOW IT WORKS:
 * Switches between views (Dashboard, Books, Inventory, Orders, Sales) based on
 * the `activeTab` state variable, and provides callback handlers to child components.
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Sales from './pages/Sales';
import BookModal from './components/BookModal';
import OrderModal from './components/OrderModal';
import StockModal from './components/StockModal';
import Toast from './components/Toast';
import { api } from './services/api';
import './App.css';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');

  // Shared Book List (for modals and lookups)
  const [availableBooks, setAvailableBooks] = useState([]);

  // Modals Visibility State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [bookForStock, setBookForStock] = useState(null);

  // Global Refresh Trigger (increments when data updates)
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Toast Feedback State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Fetch all books for order dropdowns
  const fetchAllBooks = async () => {
    try {
      const res = await api.getBooks();
      if (res.success) {
        setAvailableBooks(res.data);
      }
    } catch (err) {
      console.warn('Failed to load books for dropdown:', err.message);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, [refreshTrigger]);

  // Modal Handlers
  const handleOpenAddBook = () => {
    setBookToEdit(null);
    setIsBookModalOpen(true);
  };

  const handleOpenEditBook = (book) => {
    setBookToEdit(book);
    setIsBookModalOpen(true);
  };

  const handleOpenNewOrder = () => {
    setIsOrderModalOpen(true);
  };

  const handleOpenStockModal = (book) => {
    setBookForStock(book);
    setIsStockModalOpen(true);
  };

  // Save Book (Add or Edit)
  const handleSaveBook = async (bookData) => {
    try {
      if (bookToEdit) {
        const res = await api.updateBook(bookToEdit._id, bookData);
        if (res.success) {
          showToast(`Book "${bookData.title}" updated successfully!`, 'success');
        }
      } else {
        const res = await api.createBook(bookData);
        if (res.success) {
          showToast(`Book "${bookData.title}" added to catalog!`, 'success');
        }
      }
      setIsBookModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      showToast(err.message || 'Error saving book details', 'error');
    }
  };

  // Place Order (With automatic stock reduction)
  const handlePlaceOrder = async (orderData) => {
    try {
      const res = await api.createOrder(orderData);
      if (res.success) {
        showToast(
          `Order created! ${orderData.quantity} copy sold. Remaining stock: ${res.data.remainingStock}`,
          'success'
        );
        setIsOrderModalOpen(false);
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      showToast(err.message || 'Error processing customer order', 'error');
    }
  };

  // Update Stock Directly
  const handleUpdateStock = async (bookId, newQuantity) => {
    try {
      const res = await api.updateStock(bookId, newQuantity);
      if (res.success) {
        showToast(`Stock updated to ${newQuantity} units`, 'success');
        setIsStockModalOpen(false);
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update stock', 'error');
    }
  };

  // Reset Demo Records
  const handleResetDemo = async () => {
    const confirmReset = window.confirm(
      'Reset database to initial sample books and orders for demonstration?'
    );
    if (!confirmReset) return;

    try {
      const res = await api.resetDemoData();
      if (res.success) {
        showToast('Database reset and re-seeded with demo records!', 'success');
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      showToast(err.message || 'Error resetting demo data', 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar
          activeTab={activeTab}
          onResetDemo={handleResetDemo}
          onOpenAddBook={handleOpenAddBook}
          onOpenNewOrder={handleOpenNewOrder}
        />

        <main className="content-area">
          {activeTab === 'dashboard' && (
            <Dashboard
              setActiveTab={setActiveTab}
              onOpenAddBook={handleOpenAddBook}
              onOpenNewOrder={handleOpenNewOrder}
            />
          )}

          {activeTab === 'books' && (
            <Books
              onOpenAddBook={handleOpenAddBook}
              onOpenEditBook={handleOpenEditBook}
              onOpenStockModal={handleOpenStockModal}
              refreshTrigger={refreshTrigger}
              showToast={showToast}
            />
          )}

          {activeTab === 'inventory' && (
            <Inventory
              onOpenStockModal={handleOpenStockModal}
              refreshTrigger={refreshTrigger}
              showToast={showToast}
            />
          )}

          {activeTab === 'orders' && (
            <Orders
              onOpenNewOrder={handleOpenNewOrder}
              refreshTrigger={refreshTrigger}
              showToast={showToast}
            />
          )}

          {activeTab === 'sales' && (
            <Sales
              refreshTrigger={refreshTrigger}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSave={handleSaveBook}
        bookToEdit={bookToEdit}
      />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onPlaceOrder={handlePlaceOrder}
        books={availableBooks}
      />

      <StockModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        onUpdateStock={handleUpdateStock}
        book={bookForStock}
      />

      {/* Feedback Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
