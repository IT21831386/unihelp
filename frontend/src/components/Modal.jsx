import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Modal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <AlertTriangle size={48} color="var(--danger)" style={{ marginBottom: '1rem', display: 'inline-block' }} />
          <h3>{title}</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{message}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" onClick={onClose} style={{ flex: 1 }} disabled={isLoading}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} style={{ flex: 1, display: 'flex', justifyContent: 'center' }} disabled={isLoading}>
            {isLoading ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
