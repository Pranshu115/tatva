import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api';
import './BOQNormalize.css';

const BOQNormalize = ({ onComplete }) => {
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    
    setFile(uploadedFile);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const res = await fetch(getApiUrl('/api/boq/normalize'), {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setItems(data.items);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    onComplete(items);
    navigate('/vendor-select');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>BOQ Normalize</h1>
        <p>Upload your Bill of Quantities and map items to normalized catalog</p>
      </div>

      {!file ? (
        <div className="upload-zone">
          <Upload size={48} />
          <h3>Upload BOQ File</h3>
          <p>CSV, Excel, or PDF format</p>
          <label className="btn-primary">
            Choose File
            <input type="file" onChange={handleFileUpload} accept=".csv,.xlsx,.pdf" hidden />
          </label>
        </div>
      ) : (
        <div className="results">
          {loading ? (
            <div className="loading">Processing...</div>
          ) : (
            <>
              <div className="items-grid">
                {items.map((item) => (
                  <div key={item.id} className="item-card">
                    <div className="item-header">
                      <span className="item-raw">{item.rawName}</span>
                      {item.confidence >= 0.8 ? (
                        <CheckCircle size={20} className="icon-success" />
                      ) : (
                        <AlertCircle size={20} className="icon-warning" />
                      )}
                    </div>
                    <div className="item-normalized">
                      <strong>{item.normalizedName}</strong>
                    </div>
                    <div className="item-meta">
                      <span>Qty: {item.quantity}</span>
                      <span className={`confidence ${item.confidence >= 0.8 ? 'high' : 'medium'}`}>
                        {Math.round(item.confidence * 100)}% match
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-primary btn-large" onClick={handleProceed}>
                Proceed to Vendor Selection
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BOQNormalize;
