import express from 'express';
import { authenticateToken } from './auth.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import BOQ from '../models/BOQ.js';
import Order from '../models/Order.js';

const router = express.Router();

// Service Provider Dashboard
router.get('/service-provider', authenticateToken, async (req, res) => {
  try {
    // Get user's BOQs
    const boqs = await BOQ.find({ serviceProvider: req.userId }).sort({ createdAt: -1 });
    
    // Get user's orders (as service provider)
    const orders = await Order.find({ serviceProvider: req.userId })
      .sort({ createdAt: -1 });

    // Calculate stats
    const stats = {
      totalBOQs: boqs.length,
      activePOs: orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length,
      totalSpent: orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + o.totalAmount, 0),
      pendingApprovals: orders.filter(o => o.status === 'pending').length
    };

    // Format recent BOQs
    const recentBOQs = boqs.slice(0, 5).map(boq => ({
      id: boq._id,
      name: boq.name,
      itemCount: boq.itemCount,
      createdAt: formatDate(boq.createdAt),
      status: boq.status
    }));

    // Format recent POs (orders)
    const recentPOs = orders.slice(0, 5).map(order => ({
      id: order.orderNumber || order._id,
      vendor: 'Supplier', // Since we're not populating, use generic name
      amount: order.totalAmount,
      status: order.status
    }));

    res.json({
      status: 'success',
      stats,
      recentBOQs,
      recentPOs
    });
  } catch (error) {
    console.error('Service provider dashboard error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error' 
    });
  }
});

// Supplier Dashboard
router.get('/supplier', authenticateToken, async (req, res) => {
  try {
    // Get supplier's products
    const products = await Product.find({ supplier: req.userId });
    
    // Get supplier's orders
    const orders = await Order.find({ supplier: req.userId })
      .sort({ createdAt: -1 });

    // Calculate stats
    const stats = {
      totalProducts: products.length,
      activeOrders: orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length,
      totalRevenue: orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + o.totalAmount, 0),
      pendingQuotes: orders.filter(o => o.status === 'pending').length
    };

    // Format products for response
    const formattedProducts = products.slice(0, 10).map(product => ({
      id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      unit: product.unit,
      stock: product.stock,
      description: product.description
    }));

    // Format recent orders
    const formattedOrders = orders.slice(0, 5).map(order => ({
      id: order.orderNumber || order._id,
      customer: 'Service Provider', // Since we're not populating, use generic name
      amount: order.totalAmount,
      status: order.status
    }));

    res.json({
      status: 'success',
      stats,
      products: formattedProducts,
      orders: formattedOrders
    });
  } catch (error) {
    console.error('Supplier dashboard error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error' 
    });
  }
});

// Helper function to format dates
function formatDate(date) {
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  return date.toLocaleDateString();
}

export { router as dashboardRouter };