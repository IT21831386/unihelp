import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { X, Bell, ExternalLink } from 'lucide-react';

const NotificationToast = () => {
  const { newNotice, closeNotification, setSelectedNotice } = useNotification();

  if (!newNotice) return null;

  const handleView = () => {
    setSelectedNotice(newNotice);
    closeNotification();
  };

  return (
    <div className="notification-toast-overlay">
      <div className="notification-toast">
        <div className="toast-icon">
          <Bell size={20} />
          <span className="ping-effect"></span>
        </div>
        <div className="toast-content">
          <p className="toast-label">New {newNotice.category} Posted!</p>
          <h4 className="toast-title">{newNotice.title}</h4>
        </div>
        <div className="toast-actions">
          <button className="toast-view-btn" onClick={handleView}>
            VIEW <ExternalLink size={14} style={{ marginLeft: '4px' }} />
          </button>
          <button className="toast-close-btn" onClick={closeNotification}>
            <X size={18} />
          </button>
        </div>
      </div>
      <style>{`
        .notification-toast-overlay {
          position: fixed;
          top: 6rem;
          right: 2rem;
          z-index: 10000;
          animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .notification-toast {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.05);
          padding: 1rem;
          border-radius: 20px;
          box-shadow: 0 15px 45px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 320px;
          max-width: 400px;
        }

        .toast-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%);
          color: #fff;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .ping-effect {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 14px;
          border: 2px solid #ff7e5f;
          animation: ping 2s infinite;
        }

        .toast-content {
          flex: 1;
        }

        .toast-label {
          font-size: 0.7rem;
          font-weight: 800;
          color: #ff7e5f;
          text-transform: uppercase;
          margin-bottom: 2px;
          letter-spacing: 0.5px;
        }

        .toast-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          line-height: 1.4;
        }

        .toast-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .toast-view-btn {
          background: #1e293b;
          color: #fff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }

        .toast-view-btn:hover {
          transform: translateY(-2px);
          background: #000;
        }

        .toast-close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .toast-close-btn:hover {
          color: #ef4444;
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes ping {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default NotificationToast;
