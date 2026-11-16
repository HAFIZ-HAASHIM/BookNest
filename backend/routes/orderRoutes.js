/**
 * Order Routes
 * 
 * Maps HTTP methods and URL paths to Order Controller functions.
 * 
 * Endpoints:
 * GET  /api/orders - Fetch all orders
 * POST /api/orders - Create a new customer order and reduce book stock
 */

const express = require('express');
const router = express.Router();
const { getOrders, createOrder } = require('../controllers/orderController');

router.route('/')
  .get(getOrders)
  .post(createOrder);

module.exports = router;
