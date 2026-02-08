import { useState, useEffect } from 'react';
import { 
  Users, 
  Building, 
  ShoppingCart, 
  TrendingUp, 
  Eye, 
  Search, 
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Package,
  RefreshCw,
  X,
  DollarSign,
  Box,
  Tag,
  Edit2,
  Check,
  Ban,
  Save
} from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    serviceProviders: 0,
    suppliers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    activeBOQs: 0,
    totalProducts: 0,
    totalInventoryValue: 0
  });
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  const [serviceProviderData, setServiceProviderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Product modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      
      console.log('Admin Dashboard Response:', result);
      
      if (result.status === 'success') {
        const data = result.data;
        console.log('Admin Dashboard Data:', data);
        console.log('Supplier Data:', data.supplierData);
        
        setStats(data.stats);
        setUsers(data.users);
        setTransactions(data.transactions);
        setSupplierData(data.supplierData || []);
        setServiceProviderData(data.serviceProviderData || []);
        setProducts(data.products || []);
        setBOQs(data.boqs || []);
      } else {
        console.error('Failed to fetch admin data:', result.message);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductUpdate = () => {
    fetchAdminData();
    setSelectedProduct(null);
    setSelectedSupplier(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || user.userType === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner" />
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Monitor and manage platform activities • Real-time data</p>
        </div>
        <div className="admin-actions">
          <button 
            className="btn-refresh" 
            onClick={fetchAdminData}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            Refresh Data
          </button>
          <div className="admin-user-info">
            <span>Welcome, {user?.name}</span>
            <div className="admin-badge">Admin</div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon users">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon providers">
            <Building size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.serviceProviders}</h3>
            <p>Service Providers</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon suppliers">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.suppliers}</h3>
            <p>Suppliers</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon transactions">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalTransactions}</h3>
            <p>Total Transactions</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon revenue">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
            <p>Platform Revenue</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon boqs">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.activeBOQs}</h3>
            <p>Active BOQs</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon products">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon inventory">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>₹{stats.totalInventoryValue?.toLocaleString()}</h3>
            <p>Inventory Value</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={16} />
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={16} />
          Users
        </button>
        <button 
          className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          <ShoppingCart size={16} />
          Transactions
        </button>
        <button 
          className={`tab ${activeTab === 'suppliers' ? 'active' : ''}`}
          onClick={() => setActiveTab('suppliers')}
        >
          <Package size={16} />
          Suppliers
        </button>
        <button 
          className={`tab ${activeTab === 'providers' ? 'active' : ''}`}
          onClick={() => setActiveTab('providers')}
        >
          <Building size={16} />
          Service Providers
        </button>
      </div>

      {/* Tab Content */}
      <div className="admin-content">
        {activeTab === 'overview' && (
          <OverviewTab stats={stats} />
        )}
        
        {activeTab === 'users' && (
          <UsersTab 
            users={filteredUsers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
          />
        )}
        
        {activeTab === 'transactions' && (
          <TransactionsTab transactions={transactions} />
        )}
        
        {activeTab === 'suppliers' && (
          <SuppliersTab 
            supplierData={supplierData}
            onProductClick={(product, supplier) => {
              setSelectedProduct(product);
              setSelectedSupplier(supplier);
            }}
          />
        )}
        
        {activeTab === 'providers' && (
          <ServiceProvidersTab serviceProviderData={serviceProviderData} />
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          supplier={selectedSupplier}
          onClose={() => {
            setSelectedProduct(null);
            setSelectedSupplier(null);
          }}
          onUpdate={handleProductUpdate}
        />
      )}
    </div>
  );
};

// Product Detail Modal Component
const ProductDetailModal = ({ product, supplier, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...product });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedProduct)
      });

      if (response.ok) {
        alert('Product updated successfully!');
        setIsEditing(false);
        if (onUpdate) onUpdate();
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this product?')) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/products/${product.id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Product approved successfully!');
        if (onUpdate) onUpdate();
      } else {
        alert('Failed to approve product');
      }
    } catch (error) {
      console.error('Error approving product:', error);
      alert('Error approving product');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/products/${product.id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        alert('Product rejected');
        if (onUpdate) onUpdate();
      } else {
        alert('Failed to reject product');
      }
    } catch (error) {
      console.error('Error rejecting product:', error);
      alert('Error rejecting product');
    } finally {
      setLoading(false);
    }
  };

  const currentProduct = isEditing ? editedProduct : product;
  
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": currentProduct.name,
    "description": currentProduct.description || "Construction material for building projects",
    "sku": `PROD-${String(currentProduct.id).padStart(6, '0')}`,
    "category": currentProduct.category,
    "brand": {
      "@type": "Brand",
      "name": supplier?.company || supplier?.name || "TatvaDirect Supplier"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": currentProduct.price.toString(),
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": currentProduct.price,
        "priceCurrency": "INR",
        "unitText": currentProduct.unit
      },
      "itemCondition": "https://schema.org/NewCondition",
      "availability": currentProduct.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": supplier?.company || supplier?.name || "TatvaDirect Supplier"
      }
    }
  };

  const statusInfo = {
    approved: { color: '#059669', text: 'Approved' },
    pending: { color: '#d97706', text: 'Pending Approval' },
    rejected: { color: '#dc2626', text: 'Rejected' }
  };

  const status = statusInfo[product.status] || statusInfo.pending;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <div className="modal-title-section">
              <Package size={28} color="#4f46e5" />
              {isEditing ? (
                <input
                  type="text"
                  value={editedProduct.name}
                  onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                  className="modal-title-input"
                />
              ) : (
                <h2 className="modal-title">{product.name}</h2>
              )}
            </div>
            <div className="modal-badges">
              <span className="category-badge-modal">{currentProduct.category}</span>
              <span className={`status-badge-modal status-${product.status}`}>
                {status.text}
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="modal-actions">
            {!isEditing ? (
              <>
                <button onClick={() => setIsEditing(true)} className="btn-modal btn-edit-modal">
                  <Edit2 size={16} />
                  Edit
                </button>
                
                {product.status !== 'approved' && (
                  <button onClick={handleApprove} disabled={loading} className="btn-modal btn-approve-modal">
                    <Check size={16} />
                    Approve
                  </button>
                )}
                
                {product.status !== 'rejected' && (
                  <button onClick={handleReject} disabled={loading} className="btn-modal btn-reject-modal">
                    <Ban size={16} />
                    Reject
                  </button>
                )}
              </>
            ) : (
              <>
                <button onClick={handleSave} disabled={loading} className="btn-modal btn-save-modal">
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setEditedProduct({ ...product });
                  }} 
                  disabled={loading}
                  className="btn-modal btn-cancel-modal"
                >
                  <X size={16} />
                  Cancel
                </button>
              </>
            )}
            
            <button onClick={onClose} disabled={loading} className="btn-close-modal">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="modal-body">
          {/* Product Details Grid */}
          <div className="detail-cards-grid">
            {isEditing ? (
              <>
                <div className="detail-card-editable">
                  <div className="detail-icon" style={{ background: '#05966915' }}>
                    <DollarSign size={20} color="#059669" />
                  </div>
                  <div className="detail-content-editable">
                    <label>Price</label>
                    <input
                      type="number"
                      value={editedProduct.price}
                      onChange={(e) => setEditedProduct({ ...editedProduct, price: parseFloat(e.target.value) || 0 })}
                      className="detail-input"
                    />
                    <span className="detail-subtitle">per {editedProduct.unit}</span>
                  </div>
                </div>
                
                <div className="detail-card-editable">
                  <div className="detail-icon" style={{ background: '#4f46e515' }}>
                    <Box size={20} color="#4f46e5" />
                  </div>
                  <div className="detail-content-editable">
                    <label>Stock</label>
                    <input
                      type="number"
                      value={editedProduct.stock}
                      onChange={(e) => setEditedProduct({ ...editedProduct, stock: parseInt(e.target.value) || 0 })}
                      className="detail-input"
                    />
                    <span className="detail-subtitle">{editedProduct.unit}</span>
                  </div>
                </div>
                
                <div className="detail-card-editable">
                  <div className="detail-icon" style={{ background: '#d9770615' }}>
                    <Tag size={20} color="#d97706" />
                  </div>
                  <div className="detail-content-editable">
                    <label>Category</label>
                    <select
                      value={editedProduct.category}
                      onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
                      className="detail-select"
                    >
                      <option value="steel">Steel</option>
                      <option value="cement">Cement</option>
                      <option value="aggregates">Aggregates</option>
                      <option value="masonry">Masonry</option>
                      <option value="other">Other</option>
                    </select>
                    <label style={{ marginTop: '0.75rem' }}>Unit</label>
                    <input
                      type="text"
                      value={editedProduct.unit}
                      onChange={(e) => setEditedProduct({ ...editedProduct, unit: e.target.value })}
                      className="detail-input"
                      style={{ marginTop: '0.25rem' }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="detail-card">
                  <div className="detail-icon" style={{ background: '#05966915' }}>
                    <DollarSign size={20} color="#059669" />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Price</span>
                    <span className="detail-value">₹{currentProduct.price.toLocaleString()}</span>
                    <span className="detail-subtitle">per {currentProduct.unit}</span>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-icon" style={{ background: '#4f46e515' }}>
                    <Box size={20} color="#4f46e5" />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Stock Available</span>
                    <span className="detail-value">{currentProduct.stock.toLocaleString()}</span>
                    <span className="detail-subtitle">{currentProduct.unit}</span>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-icon" style={{ background: '#d9770615' }}>
                    <Tag size={20} color="#d97706" />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">SKU</span>
                    <span className="detail-value">PROD-{String(currentProduct.id).padStart(6, '0')}</span>
                    <span className="detail-subtitle">Product Code</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <div className="description-section">
            <h3>Description</h3>
            {isEditing ? (
              <textarea
                value={editedProduct.description || ''}
                onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                className="description-textarea"
                placeholder="Enter product description..."
              />
            ) : (
              <p>{currentProduct.description || 'No description available'}</p>
            )}
          </div>

          {/* Supplier Information */}
          {supplier && (
            <div className="supplier-section">
              <h3>Supplier Information</h3>
              <div className="supplier-info-card">
                <div className="supplier-avatar-modal">
                  {(supplier.name || 'S').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="supplier-name-modal">{supplier.name}</div>
                  <div className="supplier-company-modal">{supplier.company || supplier.email}</div>
                </div>
              </div>
            </div>
          )}

          {/* Schema.org JSON-LD */}
          <div className="schema-section">
            <div className="schema-header">
              <h3>Schema.org Structured Data</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(productSchema, null, 2));
                  alert('Schema copied to clipboard!');
                }}
                className="btn-copy-schema"
              >
                Copy JSON
              </button>
            </div>
            <pre className="schema-code">
              <code>{JSON.stringify(productSchema, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

// Other tab components remain the same...
const OverviewTab = ({ stats }) => (
  <div className="overview-content">
    <div className="overview-cards">
      <div className="overview-card">
        <h3>Platform Growth</h3>
        <div className="growth-stats">
          <div className="growth-item">
            <span className="growth-label">New Users (This Month)</span>
            <span className="growth-value">+{Math.floor(stats.totalUsers * 0.15)}</span>
          </div>
          <div className="growth-item">
            <span className="growth-label">Revenue Growth</span>
            <span className="growth-value positive">+12.5%</span>
          </div>
          <div className="growth-item">
            <span className="growth-label">Active Transactions</span>
            <span className="growth-value">₹{(stats.totalRevenue * 0.3).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="overview-card">
        <h3>User Distribution</h3>
        <div className="user-distribution">
          <div className="distribution-item">
            <div className="distribution-bar">
              <div 
                className="bar-fill providers" 
                style={{ width: `${(stats.serviceProviders / stats.totalUsers) * 100}%` }}
              />
            </div>
            <span>Service Providers ({stats.serviceProviders})</span>
          </div>
          <div className="distribution-item">
            <div className="distribution-bar">
              <div 
                className="bar-fill suppliers" 
                style={{ width: `${(stats.suppliers / stats.totalUsers) * 100}%` }}
              />
            </div>
            <span>Suppliers ({stats.suppliers})</span>
          </div>
          <div className="distribution-item">
            <div className="distribution-bar">
              <div 
                className="bar-fill others" 
                style={{ width: `${((stats.totalUsers - stats.serviceProviders - stats.suppliers) / stats.totalUsers) * 100}%` }}
              />
            </div>
            <span>Others ({stats.totalUsers - stats.serviceProviders - stats.suppliers})</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const UsersTab = ({ users, searchTerm, setSearchTerm, filterType, setFilterType }) => (
  <div className="users-content">
    <div className="users-controls">
      <div className="search-box">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
        <option value="all">All Users</option>
        <option value="service_provider">Service Providers</option>
        <option value="supplier">Suppliers</option>
        <option value="">No Role Selected</option>
      </select>
    </div>

    <div className="users-table">
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Type</th>
            <th>Company</th>
            <th>Joined</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="user-info">
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
              </td>
              <td>
                <span className={`user-type-badge ${user.userType || 'none'}`}>
                  {user.userType === 'service_provider' ? '🏢 Service Provider' :
                   user.userType === 'supplier' ? '🚛 Supplier' : 
                   user.userType === 'admin' ? '🔐 Admin' : '👤 No Role'}
                </span>
              </td>
              <td>{user.company}</td>
              <td>{user.joinedDate}</td>
              <td>
                <span className={`status-badge ${user.status}`}>
                  {user.status === 'active' ? <CheckCircle size={14} /> : <Clock size={14} />}
                  {user.status}
                </span>
              </td>
              <td>
                <button className="btn-icon" title="View Details">
                  <Eye size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TransactionsTab = ({ transactions }) => (
  <div className="transactions-content">
    <div className="transactions-table">
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Service Provider</th>
            <th>Supplier</th>
            <th>Products</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>
                <span className="transaction-id">#{transaction.id}</span>
              </td>
              <td>{transaction.serviceProvider}</td>
              <td>{transaction.supplier}</td>
              <td>
                <div className="transaction-products">
                  <span className="product-names">{transaction.products}</span>
                  {transaction.productCount > 0 && (
                    <span className="product-count-badge">
                      {transaction.productCount} items
                    </span>
                  )}
                </div>
              </td>
              <td className="amount">₹{transaction.amount.toLocaleString()}</td>
              <td>{transaction.date}</td>
              <td>
                <span className={`status-badge ${transaction.status}`}>
                  {transaction.status === 'completed' || transaction.status === 'delivered' ? <CheckCircle size={14} /> : 
                   transaction.status === 'pending' ? <Clock size={14} /> : <AlertTriangle size={14} />}
                  {transaction.status}
                </span>
              </td>
              <td>
                <button className="btn-icon">
                  <Eye size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SuppliersTab = ({ supplierData, onProductClick }) => {
  const [expandedSuppliers, setExpandedSuppliers] = useState({});

  const toggleSupplier = (supplierId) => {
    setExpandedSuppliers(prev => ({
      ...prev,
      [supplierId]: !prev[supplierId]
    }));
  };

  return (
    <div className="suppliers-content">
      {!supplierData || supplierData.length === 0 ? (
        <div className="empty-state">
          <Package size={48} />
          <p>No suppliers found</p>
        </div>
      ) : (
        <div className="suppliers-list">
          {supplierData.map((supplier, index) => {
            const supplierId = supplier.id || index;
            const isExpanded = expandedSuppliers[supplierId];
            const productCount = supplier.products?.length || 0;
            
            return (
              <div key={supplierId} className="supplier-card">
                <div 
                  className="supplier-header"
                  onClick={() => toggleSupplier(supplierId)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="supplier-info">
                    <div className="supplier-avatar">
                      {(supplier.name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div className="supplier-details">
                      <div className="supplier-name">{supplier.name}</div>
                      <div className="supplier-company">{supplier.company}</div>
                      <div className="supplier-meta">
                        {productCount} product{productCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="expand-icon">
                    {isExpanded ? '▼' : '▶'}
                  </div>
                </div>
                
                {isExpanded && supplier.products && supplier.products.length > 0 && (
                  <div className="supplier-products">
                    {supplier.products.map((product) => (
                      <div 
                        key={product.id} 
                        className="product-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          onProductClick(product, supplier);
                        }}
                      >
                        <div className="product-item-main">
                          <span className="product-name">{product.name}</span>
                          <span className="product-category">{product.category}</span>
                        </div>
                        <div className="product-item-details">
                          <span className="product-price">₹{product.price.toLocaleString()}/{product.unit}</span>
                          <span className={`product-status-badge status-${product.status || 'pending'}`}>
                            {product.status || 'pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {isExpanded && (!supplier.products || supplier.products.length === 0) && (
                  <div className="supplier-products-empty">
                    <p>No products available</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ServiceProvidersTab = ({ serviceProviderData }) => (
  <div className="service-providers-content">
    {!serviceProviderData || serviceProviderData.length === 0 ? (
      <div className="empty-state">
        <Building size={48} />
        <p>No service providers found</p>
      </div>
    ) : (
      <div className="providers-list">
        {serviceProviderData.map((provider) => (
          <div key={provider.id} className="provider-card">
            <div className="provider-avatar">
              {(provider.name || 'SP').charAt(0).toUpperCase()}
            </div>
            <div className="provider-info">
              <div className="provider-name">{provider.name}</div>
              <div className="provider-company">{provider.company}</div>
              <div className="provider-status">
                <span className={`status-badge ${provider.status || 'active'}`}>
                  {provider.status || 'Active'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default AdminDashboard;