import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { getApiUrl } from '../config/api';
import './Substitution.css';

const Substitution = ({ selectedVendors, onComplete }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [decisions, setDecisions] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubstitutions();
  }, [selectedVendors]);

  const fetchSubstitutions = async () => {
    try {
      const res = await fetch(getApiUrl('/api/substitutions/suggest'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedVendors })
      });
      const data = await res.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Failed to fetch substitutions:', error);
    }
  };

  const handleDecision = (id, approved) => {
    setDecisions({ ...decisions, [id]: approved });
  };

  const handleProceed = () => {
    const approved = suggestions.filter(s => decisions[s.id] === true);
    onComplete(approved);
    navigate('/create-po');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Substitution Suggestions</h1>
        <p>Review AI-recommended alternatives to optimize cost and availability</p>
      </div>

      {suggestions.length === 0 ? (
        <div className="empty-state">
          <p>No substitution suggestions available</p>
          <button className="btn-primary" onClick={handleProceed}>
            Skip to Create PO
          </button>
        </div>
      ) : (
        <>
          <div className="substitution-list">
            {suggestions.map((sub) => (
              <div key={sub.id} className="substitution-card">
                <div className="sub-comparison">
                  <div className="sub-item original">
                    <span className="label">Original</span>
                    <h4>{sub.originalItem}</h4>
                    <div className="sub-meta">
                      <span>₹{sub.originalPrice}</span>
                      <span>{sub.originalLeadTime} days</span>
                    </div>
                  </div>
                  <div className="arrow">→</div>
                  <div className="sub-item suggested">
                    <span className="label">Suggested</span>
                    <h4>{sub.suggestedItem}</h4>
                    <div className="sub-meta">
                      <span>₹{sub.suggestedPrice}</span>
                      <span>{sub.suggestedLeadTime} days</span>
                    </div>
                    <div className="savings">
                      Save ₹{sub.originalPrice - sub.suggestedPrice}
                    </div>
                  </div>
                </div>
                <div className="sub-actions">
                  <button 
                    className={`btn-action approve ${decisions[sub.id] === true ? 'active' : ''}`}
                    onClick={() => handleDecision(sub.id, true)}
                  >
                    <Check size={18} />
                    Approve
                  </button>
                  <button 
                    className={`btn-action reject ${decisions[sub.id] === false ? 'active' : ''}`}
                    onClick={() => handleDecision(sub.id, false)}
                  >
                    <X size={18} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-primary btn-large" onClick={handleProceed}>
            Proceed to Create PO
          </button>
        </>
      )}
    </div>
  );
};

export default Substitution;
