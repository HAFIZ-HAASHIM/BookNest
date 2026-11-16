/**
 * Stats & Analytics Controller
 * 
 * WHAT IT DOES:
 * Aggregates statistics for the Admin Dashboard and Sales Summary.
 * 
 * WHY IT IS NEEDED:
 * The administrator dashboard requires real-time overview metrics:
 * 1. Total number of books in catalog.
 * 2. Total stock across all titles.
 * 3. Total orders placed.
 * 4. Total revenue/sales earned.
 * 5. Out-of-stock and low-stock count for inventory alerts.
 * 
 * HOW IT WORKS:
 * Uses Mongoose aggregation pipelines and queries to compute real-time
 * mathematical sums directly from MongoDB collections.
 */

const Book = require('../models/Book');
const Order = require('../models/Order');

// @desc    Get dashboard metrics & summary
// @route   GET /api/stats/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Total number of book titles
    const totalBooks = await Book.countDocuments();

    // 2. Total available stock across all books
    const stockAggregation = await Book.aggregate([
      {
        $group: {
          _id: null,
          totalStock: { $sum: '$quantity' },
        },
      },
    ]);
    const totalStock = stockAggregation.length > 0 ? stockAggregation[0].totalStock : 0;

    // 3. Out-of-stock and low-stock count (quantity <= 5)
    const outOfStockCount = await Book.countDocuments({ quantity: { $lte: 0 } });
    const lowStockCount = await Book.countDocuments({ quantity: { $gt: 0, $lte: 5 } });

    // 4. Total orders count
    const totalOrders = await Order.countDocuments();

    // 5. Total sales revenue
    const salesAggregation = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const totalSales = salesAggregation.length > 0 ? salesAggregation[0].totalSales : 0;

    // 6. Recent 5 orders for dashboard table
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    // 7. Category distribution
    const categoryStats = await Book.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          stock: { $sum: '$quantity' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBooks,
        totalStock,
        totalOrders,
        totalSales: parseFloat(totalSales.toFixed(2)),
        outOfStockCount,
        lowStockCount,
        recentOrders,
        categoryStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to compute dashboard metrics',
      error: error.message,
    });
  }
};
