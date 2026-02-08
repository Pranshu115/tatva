import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import './CreatePO.css';

const CreatePO = ({ selectedVendors, substitutions }) => {
  const [poGroups, setPoGroups] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    groupByVendor();
  }, [selectedVendors, substitutions]);

  const groupByVendor = async () => {
    try {
      const res = await fetch('/api/po/group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedVendors, substitutions })
      });
      const data = await res.json();
      setPoGroups(data.groups);
    } catch (error) {
      console.error('Failed to group POs:', error);
    }
  };

  const handleConfirm = async () => {
    try {
      await fetch('/api/po/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poGroups })
      });
      setConfirmed(true);
    } catch (error) {
      console.error('Failed to create POs:', error);
    }
  };

  if (confirmed) {
    return (
      <div className="page">
        <div className="success-state">
          <Check size={64} className="success-icon" />
          <h2>Purchase Orders Created!</h2>
          <p>All POs have been successfully generated and sent to vendors.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Create Purchase Orders</h1>
        <p>Review and confirm POs grouped by vendor</p>
      </div>

      <div className="po-list">
        {poGroups.map((group) => (
          <div key={group.vendorId} className="po-card">
            <div className="po-header">
              <h3>{group.vendorName}</h3>
              <div className="po-total">₹{group.total}</div>
            </div>
            <table className="po-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {group.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price}</td>
                    <td>₹{item.quantity * item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <button className="btn-primary btn-large" onClick={handleConfirm}>
        Confirm & Create All POs
      </button>
    </div>
  );
};

export default CreatePO;
