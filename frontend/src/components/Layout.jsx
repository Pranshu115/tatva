import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FileText, Users, RefreshCw, ShoppingCart, User, LogOut, ChevronDown, BarChart3 } from 'lucide-react';
import tatvaLogo from '../images/tatva_d.png';
import './Layout.css';

const Layout = ({ user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const steps = [
    ...(user?.userType === 'admin' ? [{
      path: '/admin-dashboard', 
      label: 'Admin Dashboard', 
      icon: BarChart3 
    }] : user?.userType === 'service_provider' || user?.userType === 'supplier' ? [{
      path: user?.userType === 'service_provider' ? '/dashboard' : '/supplier-dashboard', 
      label: 'Dashboard', 
      icon: BarChart3 
    }] : []),
    ...(user?.userType !== 'admin' ? [
      { path: '/boq-normalize', label: 'BOQ Normalize', icon: FileText },
      { path: '/supplier-select', label: 'Supplier Select', icon: Users },
      { path: '/substitution', label: 'Substitution', icon: RefreshCw },
      { path: '/create-po', label: 'Create PO', icon: ShoppingCart }
    ] : [])
  ];

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="logo">
          <img src={tatvaLogo} alt="Tatva Direct" className="logo-image" />
        </div>
        <div className="nav-steps">
          {steps.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} to={path} className="nav-step">
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
        
        {/* User Profile Section */}
        <div className="user-section">
          <div 
            className="user-profile"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-company">
                {user?.userType === 'admin' ? '🔐 Admin' :
                 user?.userType === 'service_provider' ? '🏢 Service Provider' : 
                 user?.userType === 'supplier' ? '🚛 Supplier' : 
                 '👤 User'} • {user?.company}
              </div>
            </div>
            <ChevronDown size={16} className={`chevron ${showUserMenu ? 'rotated' : ''}`} />
          </div>
          
          {showUserMenu && (
            <div className="user-menu">
              <NavLink 
                to="/profile" 
                className="user-menu-item"
                onClick={() => setShowUserMenu(false)}
              >
                <User size={16} />
                <span>Profile</span>
              </NavLink>
              <button className="user-menu-item" onClick={onLogout}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
