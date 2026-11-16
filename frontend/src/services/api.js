/**
 * API Service Layer
 * 
 * WHAT IT DOES:
 * Centralizes all network requests made from the React frontend to the Express backend.
 * 
 * WHY IT IS NEEDED:
 * Keeps components clean, decoupled, and reusable. Instead of writing fetch logic
 * in every component, components simply call `api.getBooks()` or `api.createOrder()`.
 * 
 * HOW IT WORKS:
 * Uses the browser's native `fetch()` API with async/await. It sends JSON HTTP requests
 * and parses JSON HTTP responses.
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for common error handling and headers
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // =====================
  // DASHBOARD & ANALYTICS
  // =====================
  getDashboardStats: async () => {
    return await request('/stats/dashboard');
  },

  // =====================
  // BOOK MANAGEMENT (CRUD)
  // =====================
  getBooks: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.stockStatus && params.stockStatus !== 'all') query.append('stockStatus', params.stockStatus);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return await request(`/books${queryString}`);
  },

  getBookById: async (id) => {
    return await request(`/books/${id}`);
  },

  createBook: async (bookData) => {
    return await request('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  },

  updateBook: async (id, bookData) => {
    return await request(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
  },

  deleteBook: async (id) => {
    return await request(`/books/${id}`, {
      method: 'DELETE',
    });
  },

  // =====================
  // INVENTORY MANAGEMENT
  // =====================
  updateStock: async (id, quantity) => {
    return await request(`/books/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  },

  // =====================
  // ORDER MANAGEMENT
  // =====================
  getOrders: async () => {
    return await request('/orders');
  },

  createOrder: async (orderData) => {
    return await request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // =====================
  // DEMO RESET
  // =====================
  resetDemoData: async () => {
    return await request('/seed/reset', {
      method: 'POST',
    });
  },
};
