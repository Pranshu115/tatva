import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ServiceProviderDashboard from './pages/ServiceProviderDashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BOQNormalize from './pages/BOQNormalize';
import VendorSelect from './pages/VendorSelect';
import Substitution from './pages/Substitution';
import CreatePO from './pages/CreatePO';

function App() {
  const [normalizedItems, setNormalizedItems] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState({});
  const [substitutions, setSubstitutions] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    resetWorkflow();
  };

  // Reset state when starting over
  const resetWorkflow = () => {
    setNormalizedItems([]);
    setSelectedVendors({});
    setSubstitutions([]);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '1.2rem' }}>Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/boq-normalize" replace /> : 
            <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/signup" 
          element={
            isAuthenticated ? 
            <Navigate to="/boq-normalize" replace /> : 
            <Signup onLogin={handleLogin} />
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route 
            index 
            element={
              user?.userType === 'admin' ?
              <Navigate to="/admin-dashboard" replace /> :
              user?.userType === 'service_provider' ? 
              <Navigate to="/dashboard" replace /> : 
              user?.userType === 'supplier' ?
              <Navigate to="/supplier-dashboard" replace /> :
              <Navigate to="/boq-normalize" replace />
            } 
          />
          <Route 
            path="admin-dashboard" 
            element={<AdminDashboard user={user} />} 
          />
          <Route 
            path="dashboard" 
            element={<ServiceProviderDashboard user={user} />} 
          />
          <Route 
            path="supplier-dashboard" 
            element={<SupplierDashboard user={user} />} 
          />
          <Route 
            path="profile" 
            element={<Profile user={user} />} 
          />
          <Route 
            path="boq-normalize" 
            element={<BOQNormalize onComplete={setNormalizedItems} />} 
          />
          <Route 
            path="supplier-select" 
            element={<VendorSelect items={normalizedItems} onComplete={setSelectedVendors} />} 
          />
          <Route 
            path="substitution" 
            element={<Substitution selectedVendors={selectedVendors} onComplete={setSubstitutions} />} 
          />
          <Route 
            path="create-po" 
            element={<CreatePO selectedVendors={selectedVendors} substitutions={substitutions} />} 
          />
        </Route>
        
        {/* Redirect to login if not authenticated */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
