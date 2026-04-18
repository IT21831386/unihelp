import React from 'react';
import { Calendar, Clock, Users, Edit, Trash2 } from 'lucide-react';

const NoticeCard = ({ notice, onEdit, onDelete }) => {
  const getBadgeClass = (category) => {
    switch (category) {
      case 'Events': return 'badge-events';
      case 'Special Notices': return 'badge-special';
      case 'Missing Items': return 'badge-missing';
      default: return 'badge-special';
    }
  };

  return (
    <div className="card notice-card">
      <span className={`notice-badge ${getBadgeClass(notice.category)}`}>
        {notice.category}
      </span>
      <h3>{notice.title}</h3>
      
      <div className="notice-meta">
        <div className="notice-meta-item">
          <Calendar size={16} /> {notice.date}
        </div>
        <div className="notice-meta-item">
          <Clock size={16} /> {notice.time}
        </div>
      </div>
      
      <div className="notice-meta-item" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        <Users size={16} /> Audience: {notice.audience}
      </div>

      <p style={{ color: 'var(--text-light)', marginBottom: '1rem', flex: 1 }}>
        {notice.description}
      </p>

      {notice.attachments && (
        <a href={notice.attachments} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 500, marginBottom: '1rem', display: 'inline-block' }}>
          View Attachment
        </a>
      )}

      <div className="notice-actions">
        <button onClick={() => onEdit(notice)} className="btn btn-outline" style={{ flex: 1, padding: '0.5rem' }}>
          <Edit size={18} /> Edit
        </button>
        <button onClick={() => onDelete(notice._id)} className="btn btn-danger" style={{ flex: 1, padding: '0.5rem' }}>
          <Trash2 size={18} /> Delete
        </button>
      </div>
    </div>
  );
};

export default NoticeCard;
