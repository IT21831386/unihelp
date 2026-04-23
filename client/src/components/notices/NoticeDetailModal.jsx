import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { X, Calendar, Clock, Users, MapPin } from 'lucide-react';

const NoticeDetailModal = () => {
  const { selectedNotice, setSelectedNotice } = useNotification();

  if (!selectedNotice) return null;

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Academic': return '#3b82f6';
      case 'Events': return '#10b981';
      case 'Exam': return '#ef4444';
      case 'Lost Item': return '#ef4444';
      case 'Found Item': return '#10b981';
      case 'General': return '#64748b';
      default: return '#64748b';
    }
  };

  const color = getCategoryColor(selectedNotice.category);

  return (
    <div className="modal-overlay global-notice-overlay" onClick={() => setSelectedNotice(null)}>
      <div className="modal-content notice-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="category-tag" style={{ backgroundColor: `${color}15`, color: color }}>
            {selectedNotice.category}
          </div>
          <button className="close-top-btn" onClick={() => setSelectedNotice(null)}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <h2 className="notice-modal-title">{selectedNotice.title}</h2>
          
          {selectedNotice.attachments && selectedNotice.attachments !== 'none' && (
            <div className="notice-modal-image-wrap">
              <img src={selectedNotice.attachments} alt="Notice" />
            </div>
          )}

          <div className="notice-modal-desc">
            {selectedNotice.description}
          </div>

          <div className="notice-modal-metadata">
            <div className="meta-item">
              <Calendar size={18} />
              <span><strong>Date:</strong> {selectedNotice.date}</span>
            </div>
            {selectedNotice.time && (
              <div className="meta-item">
                <Clock size={18} />
                <span><strong>Time:</strong> {selectedNotice.time}</span>
              </div>
            )}
            {selectedNotice.location && (
                <div className="meta-item">
                  <MapPin size={18} />
                  <span><strong>Location:</strong> {selectedNotice.location}</span>
                </div>
            )}
            <div className="meta-item">
              <Users size={18} />
              <span><strong>Audience:</strong> {selectedNotice.audience || 'All Students'}</span>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
            <button className="done-btn" onClick={() => setSelectedNotice(null)}>DONE</button>
        </div>
      </div>

      <style>{`
        .global-notice-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 11000;
          padding: 2rem;
          animation: modalFadeIn 0.3s ease-out;
        }

        .notice-detail-modal {
          background: #ffffff;
          width: 100%;
          max-width: 650px;
          border-radius: 32px;
          padding: 0;
          box-shadow: 0 40px 100px rgba(0,0,0,0.25);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          animation: modalScaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-header {
          padding: 2rem 2.5rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .category-tag {
          padding: 0.5rem 1.25rem;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .close-top-btn {
          background: #f1f5f9;
          border: none;
          color: #64748b;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .close-top-btn:hover { background: #e2e8f0; color: #1e293b; transform: rotate(90deg); }

        .modal-body {
          padding: 1rem 2.5rem 2.5rem;
          overflow-y: auto;
          flex: 1;
        }

        .notice-modal-title {
          font-size: 2.2rem;
          font-weight: 900;
          line-height: 1.2;
          color: #1e293b;
          margin-bottom: 2rem;
        }

        .notice-modal-image-wrap {
          width: 100%;
          height: 350px;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .notice-modal-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .notice-modal-desc {
          font-size: 1.15rem;
          line-height: 1.7;
          color: #475569;
          margin-bottom: 2.5rem;
          white-space: pre-wrap;
        }

        .notice-modal-metadata {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          border: 1px solid #e2e8f0;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #64748b;
          font-size: 1rem;
        }

        .meta-item strong { color: #1e293b; }

        .modal-footer {
            padding: 1.5rem 2.5rem;
            border-top: 1px solid #f1f5f9;
            display: flex;
            justify-content: flex-end;
        }

        .done-btn {
            background: #1e293b;
            color: #fff;
            border: none;
            padding: 0.8rem 2.5rem;
            border-radius: 100px;
            font-weight: 800;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s;
        }

        .done-btn:hover { background: #000; transform: translateY(-2px); }

        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalScaleIn { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }

        @media (max-width: 768px) {
          .notice-modal-metadata { grid-template-columns: 1fr; }
          .notice-modal-title { font-size: 1.8rem; }
        }
      `}</style>
    </div>
  );
};

export default NoticeDetailModal;
