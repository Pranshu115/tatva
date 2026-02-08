import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Plus,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const ServiceProviderDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalBOQs: 0,
    activePOs: 0,
    totalSpent: 0,
    pendingApprovals: 0
  });
  const [recentBOQs, setRecentBOQs] = useState([]);
  const [recentPOs, setRecentPOs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/service-provider', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setStats(data.stats);
      setRecentBOQs(data.recentBOQs);
      setRecentPOs(data.recentPOs);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's what's happening with your procurement activities</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => navigate('/boq-normalize')}
        >
          <Plus size={18} />
          New BOQ
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon boq">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalBOQs}</h3>
            <p>Total BOQs</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon po">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.activePOs}</h3>
            <p>Active POs</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon spent">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>₹{stats.totalSpent.toLocaleString()}</h3>
            <p>Total Spent</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.pendingApprovals}</h3>
            <p>Pending Approvals</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Recent BOQs */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent BOQs</h2>
            <button 
              className="btn-secondary"
              onClick={() => navigate('/boq-normalize')}
            >
              View All
            </button>
          </div>
          
          <div className="items-list">
            {recentBOQs.length > 0 ? (
              recentBOQs.map((boq) => (
                <div key={boq.id} className="item-card">
                  <div className="item-info">
                    <h4>{boq.name}</h4>
                    <p>{boq.itemCount} items • Created {boq.createdAt}</p>
                  </div>
                  <div className="item-status">
                    <span className={`status ${boq.status}`}>
                      {boq.status === 'completed' ? <CheckCircle size={16} /> : <Clock size={16} />}
                      {boq.status}
                    </span>
                  </div>
                  <button className="btn-icon">
                    <Eye size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <FileText size={48} />
                <h3>No BOQs yet</h3>
                <p>Create your first BOQ to get started</p>
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/boq-normalize')}
                >
                  Create BOQ
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Purchase Orders */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Purchase Orders</h2>
            <button className="btn-secondary">View All</button>
          </div>
          
          <div className="items-list">
            {recentPOs.length > 0 ? (
              recentPOs.map((po) => (
                <div key={po.id} className="item-card">
                  <div className="item-info">
                    <h4>PO-{po.id}</h4>
                    <p>{po.vendor} • ₹{po.amount.toLocaleString()}</p>
                  </div>
                  <div className="item-status">
                    <span className={`status ${po.status}`}>
                      {po.status === 'delivered' ? <CheckCircle size={16} /> : 
                       po.status === 'pending' ? <Clock size={16} /> : <AlertCircle size={16} />}
                      {po.status}
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
                <h3>No Purchase Orders</h3>
                <p>Your purchase orders will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;