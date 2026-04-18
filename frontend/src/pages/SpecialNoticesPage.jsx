import React from 'react';
import PublicNoticesTab from './PublicNoticesTab';
import { Link } from 'react-router-dom';

const SpecialNoticesPage = () => {
  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem', minHeight: '60vh' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <Link to="/notices" style={{ color: 'var(--text-muted)' }}>Notices</Link> 
          <span>&gt;</span> 
          <span style={{ color: 'var(--text-light)', fontWeight: '500' }}>Special Notices</span>
        </div>
      </div>
      <PublicNoticesTab />
    </div>
  );
};

export default SpecialNoticesPage;
