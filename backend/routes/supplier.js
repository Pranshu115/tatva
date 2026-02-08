import express from 'express';
import { authenticateToken } from './auth.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = express.Router();

// Get all products for a supplier
router.get('/products', authenticateToken, async (req, res) => {
  try {
    const products = await Product.find({ supplier: req.userId });
    res.json({ 
      status: 'success',
      products 
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error' 
    });
  }
});

// Add new product
router.post('/products', authenticateToken, async (req, res) => {
  try {
    const productData = {
      ...req.body,
      supplier: req.userId
    };
    
    const newProduct = await Product.create(productData);
    
    res.status(201).json({ 
      status: 'success',
      message: 'Product added successfully',
      product: newProduct 
    });
  } catch (error) {
    console.error('Add product error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation Error',
        errors
      });
    }
    
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error' 
    });
  }
});

// Update product
router.put('/products/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, supplier: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Product not found' 
      });
    }
    
    res.json({ 
      status: 'success',
      message: 'Product updated successfully',
      product 
    });
  } catch (error) {
    console.error('Update product error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation Error',
        errors
      });
    }
    
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error' 
    });
  }
});

// Delete product
router.delete('/products/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ 
      _id: req.params.id, 
      supplier: req.userId 
    });
    
    if (!product) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Product not found' 
      });
    }
    
    res.json({ 
      status: 'success',
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error' 
    });
  }
});

// Get supplier orders
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ supplier: req.userId })
      .sort({ createdAt: -1 });
    
    res.json({ 
      status: 'success',
      orders 
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error' 
    });
  }
});

// Update order status
router.patch('/orders/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const order = await Order.findOne({ 
      _id: req.params.id, 
      supplier: req.userId 
    });
    
    if (!order) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Order not found' 
      });
    }
    
    order.addStatusHistory(status, req.userId, notes);
    await order.save();
    
    res.json({ 
      status: 'success',
      message: 'Order status updated successfully',
      order 
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error' 
    });
  }
});

export { router as supplierRouter };