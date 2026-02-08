import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Clock } from 'lucide-react';
import { getApiUrl } from '../config/api';
import './VendorSelect.css';

const VendorSelect = ({ items, onComplete }) => {
  const [itemVendors, setItemVendors] = useState({});
  const [selections, setSelections] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length > 0) {
      fetchVendors();
    }
  }, [items]);

  const fetchVendors = async () => {
    try {
      const res = await fetch(getApiUrl('/api/vendors/rank'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      const data = await res.json();
      setItemVendors(data.itemVendors);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    }
  };

  const handleSelect = (itemId, vendorId) => {
    setSelections({ ...selections, [itemId]: vendorId });
  };

  const handleProceed = () => {
    onComplete(selections);
    navigate('/substitution');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Supplier Selection</h1>
        <p>Choose the best vendor for each item</p>
      </div>

      <div className="vendor-list">
        {items.map((item) => (
          <div key={item.id} className="vendor-section">
            <h3 className="item-title">{item.normalizedName}</h3>
            <div className="vendor-options">
              {(itemVendors[item.id] || []).map((vendor) => (
                <div 
                  key={vendor.id}
                  className={`vendor-card ${selections[item.id] === vendor.id ? 'selected' : ''}`}
                  onClick={() => handleSelect(item.id, vendor.id)}
                >
                  <div className="vendor-name">{vendor.name}</div>
                  <div className="vendor-details">
                    <div className="detail">
                      <TrendingUp size={16} />
                      <span>₹{vendor.price}</span>
                    </div>
                    <div className="detail">
                      <Clock size={16} />
                      <span>{vendor.leadTime} days</span>
                    </div>
                  </div>
                  {vendor.rank === 1 && <span className="badge">Recommended</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button 
        className="btn-primary btn-large" 
        onClick={handleProceed}
        disabled={Object.keys(selections).length !== items.length}
      >
        Continue to Substitutions
      </button>
    </div>
  );
};

export default VendorSelect;
