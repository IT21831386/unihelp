import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import CategoryCards from '../components/CategoryCards';
import { Lock } from 'lucide-react';

const NoticesPage = () => {
  return (
    <>
      <Hero />
      <CategoryCards />
      
      <div className="container" style={{ padding: '0 1.5rem 4rem 1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', // Center it nicely at the bottom
          marginTop: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Management</span>
            <Link
              to="/admin"
              style={{
                padding: '0.7rem 1.4rem',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '0.95rem',
                transition: 'all 0.3s',
                backgroundColor: 'transparent',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1e293b';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(30, 41, 59, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#1e293b';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Lock size={16} />
              Admin Actions
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoticesPage;
