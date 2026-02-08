import express from 'express';
import { authenticateToken } from './auth.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import BOQ from '../models/BOQ.js';
import Order from '../models/Order.js';

const router = express.Router();

// Admin credentials (in production, use environment variables)
const ADMIN_CREDENTIALS = {
  email: 'admin@tatvadirect.com',
  password: 'TatvaAdmin@2024'
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user && (user.email === ADMIN_CREDENTIALS.email || user.userType === 'admin')) {
      next();
    } else {
      res.status(403).json({ 
        status: 'error',
        message: 'Access denied. Admin privileges required.' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Error checking admin privileges' 
    });
  }
};

// Generate comprehensive admin data
const generateAdminData = async () => {
  try {
    // Get all users
    const allUsers = await User.find().select('-password');
    const serviceProviders = allUsers.filter(u => u.userType === 'service_provider');
    const suppliers = allUsers.filter(u => u.userType === 'supplier');

    // Get all products without populating
    const products = await Product.find();
    
    // Get all BOQs without populating
    const boqs = await BOQ.find();
    
    // Get all orders without populating
    const orders = await Order.find();

    // Generate supplier data with their products and orders
    const supplierData = await Promise.all(suppliers.map(async (supplier) => {
      const supplierProducts = products.filter(p => 
        p.supplier && p.supplier.toString() === supplier._id.toString()
      );
      const supplierOrders = orders.filter(o => 
        o.supplier && o.supplier.toString() === supplier._id.toString()
      );
      const totalInventoryValue = supplierProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
      const totalRevenue = supplierOrders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + o.totalAmount, 0);
      
      return {
        ...supplier.toObject(),
        products: supplierProducts,
        orders: supplierOrders,
        totalProducts: supplierProducts.length,
        totalInventoryValue: totalInventoryValue,
        totalRevenue: totalRevenue,
        activeOrders: supplierOrders.filter(o => o.status !== 'delivered').length,
        categories: [...new Set(supplierProducts.map(p => p.category))]
      };
    }));

    // Generate service provider data with their BOQs and orders
    const serviceProviderData = await Promise.all(serviceProviders.map(async (sp) => {
      const spBOQs = boqs.filter(boq => 
        boq.serviceProvider && boq.serviceProvider.toString() === sp._id.toString()
      );
      const spOrders = orders.filter(o => 
        o.serviceProvider && o.serviceProvider.toString() === sp._id.toString()
      );
      const totalBOQValue = spBOQs.reduce((sum, boq) => sum + (boq.totalValue || 0), 0);
      const totalSpent = spOrders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + o.totalAmount, 0);
      
      return {
        ...sp.toObject(),
        boqs: spBOQs,
        orders: spOrders,
        totalBOQs: spBOQs.length,
        totalBOQValue: totalBOQValue,
        totalSpent: totalSpent,
        activeOrders: spOrders.filter(o => o.status !== 'delivered').length,
        activeBOQs: spBOQs.filter(boq => boq.status !== 'completed').length
      };
    }));

    // Generate transactions from actual orders
    const transactions = orders.map(order => ({
      id: order.orderNumber || order._id,
      type: 'order',
      serviceProvider: 'Service Provider', // Generic name since not populated
      supplier: 'Supplier', // Generic name since not populated
      amount: order.totalAmount,
      date: order.createdAt.toISOString().split('T')[0],
      status: order.status
    }));

    // Sort transactions by date (newest first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate total revenue (sum of completed transactions)
    const totalRevenue = transactions
      .filter(t => t.status === 'delivered')
      .reduce((sum, t) => sum + t.amount, 0);

    // Generate user list with proper formatting
    const userList = allUsers.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      company: user.company || 'Individual',
      userType: user.userType || 'general',
      joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown',
      status: user.isActive ? 'active' : 'inactive'
    }));

    return {
      stats: {
        totalUsers: allUsers.length,
        serviceProviders: serviceProviders.length,
        suppliers: suppliers.length,
        totalTransactions: transactions.length,
        totalRevenue: totalRevenue,
        activeBOQs: boqs.filter(boq => boq.status !== 'completed').length,
        totalProducts: products.length,
        totalInventoryValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
        activeOrders: orders.filter(o => o.status !== 'delivered').length,
        totalBOQs: boqs.length
      },
      users: userList,
      transactions: transactions.slice(0, 20),
      supplierData: supplierData,
      serviceProviderData: serviceProviderData,
      products: products,
      boqs: boqs,
      orders: orders
    };
  } catch (error) {
    console.error('Error generating admin data:', error);
    throw error;
  }
};

// Admin dashboard data
router.get('/dashboard', authenticateToken, isAdmin, async (req, res) => {
  try {
    const adminData = await generateAdminData();
    res.json({
      status: 'success',
      data: adminData
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error' 
    });
  }
});

// Get all users (admin only)
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const userList = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      company: user.company || 'Individual',
      userType: user.userType || 'general',
      joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown',
      status: user.isActive ? 'active' : 'inactive'
    }));
    
    res.json({ 
      status: 'success',
      users: userList 
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error' 
    });
  }
});

// Get user details (admin only)
router.get('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        status: 'error',
        message: 'User not found' 
      });
    }
    
    res.json({ 
      status: 'success',
      user 
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error' 
    });
  }
});

// Get all transactions (admin only)
router.get('/transactions', authenticateToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });

    const transactions = orders.map(order => ({
      id: order.orderNumber || order._id,
      type: 'order',
      serviceProvider: 'Service Provider', // Generic name since not populated
      supplier: 'Supplier', // Generic name since not populated
      amount: order.totalAmount,
      date: order.createdAt.toISOString().split('T')[0],
      status: order.status
    }));
    
    res.json({ 
      status: 'success',
      transactions 
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error' 
    });
  }
});

// Update user status (admin only)
router.put('/users/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const isActive = status === 'active';
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, select: '-password' }
    );
    
    if (!user) {
      return res.status(404).json({ 
        status: 'error',
        message: 'User not found' 
      });
    }
    
    res.json({ 
      status: 'success',
      message: 'User status updated successfully',
      user 
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error' 
    });
  }
});

export { router as adminRouter, ADMIN_CREDENTIALS };