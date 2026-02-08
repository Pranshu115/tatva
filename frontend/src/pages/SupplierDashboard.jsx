import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  AlertTriangle,
  Eye,
  Save,
  X,
  TrendingUp,
  ShoppingCart,
  Clock,
  CheckCircle
} from 'lucide-react';
import { getApiUrl } from '../config/api';
import './Dashboard.css';

const SupplierDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeOrders: 0,
    totalRevenue: 0,
    pendingQuotes: 0
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(getApiUrl('/api/dashboard/supplier'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setStats(data.stats);
      setProducts(data.products);
      setOrders(data.orders);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(getApiUrl('/api/supplier/products'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      const data = await response.json();
      setProducts([...products, data.product]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}!</h1>
          <p>Manage your products and track incoming orders</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon products">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.activeOrders}</h3>
            <p>Active Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon quotes">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.pendingQuotes}</h3>
            <p>Pending Quotes</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Products Management */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Product Catalog</h2>
            <div className="section-controls">
              <div className="search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="steel">Steel & Metal</option>
                <option value="cement">Cement & Concrete</option>
                <option value="aggregates">Aggregates</option>
                <option value="masonry">Masonry</option>
              </select>
            </div>
          </div>
          
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="product-category">{product.category}</p>
                    <p className="product-price">₹{product.price} per {product.unit}</p>
                    <p className="product-stock">Stock: {product.stock} {product.unit}</p>
                  </div>
                  <div className="product-actions">
                    <button 
                      className="btn-icon"
                      onClick={() => setEditingItem(product)}
                    >
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Package size={48} />
                <h3>No products found</h3>
                <p>Add products to your catalog to start receiving orders</p>
                <button 
                  className="btn-primary"
                  onClick={() => setShowAddModal(true)}
                >
                  Add Product
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <button className="btn-secondary">View All</button>
          </div>
          
          <div className="items-list">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="item-card">
                  <div className="item-info">
                    <h4>Order #{order.id}</h4>
                    <p>{order.customer} • ₹{order.amount.toLocaleString()}</p>
                  </div>
                  <div className="item-status">
                    <span className={`status ${order.status}`}>
                      {order.status === 'delivered' ? <CheckCircle size={16} /> : 
                       order.status === 'pending' ? <Clock size={16} /> : <AlertTriangle size={16} />}
                      {order.status}
                    </span>
                  </div>
                  <button className="btn-icon">
                    <Eye size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <ShoppingCart size={48} />
                <h3>No orders yet</h3>
                <p>Orders from service providers will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <ProductModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddProduct}
        />
      )}

      {/* Edit Product Modal */}
      {editingItem && (
        <ProductModal
          product={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(data) => {
            // Handle update
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

const ProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || 'steel',
    price: product?.price || '',
    unit: product?.unit || 'kg',
    stock: product?.stock || '',
    description: product?.description || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="steel">Steel & Metal</option>
                <option value="cement">Cement & Concrete</option>
                <option value="aggregates">Aggregates</option>
                <option value="masonry">Masonry</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
              >
                <option value="kg">Kilogram</option>
                <option value="ton">Ton</option>
                <option value="bag">Bag</option>
                <option value="cft">Cubic Feet</option>
                <option value="nos">Numbers</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group span-2">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
              />
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Save size={16} />
              {product ? 'Update' : 'Add'} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierDashboard;