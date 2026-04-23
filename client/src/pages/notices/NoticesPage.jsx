import React from 'react';
import { Link } from 'react-router-dom';
import NoticeHero from '../../components/notices/NoticeHero';
import CategoryCards from '../../components/notices/CategoryCards';
import { Lock } from 'lucide-react';

const NoticesPage = () => {
  return (
    <div className="notices-page-wrapper">
      <NoticeHero />
      <div className="container">
        <CategoryCards />
        
        <div className="admin-access-section">
          <div className="admin-badge-container">
            <span className="management-label">System Management</span>
            <Link to="/dashboard" className="btn-admin-access">
              <Lock size={16} />
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        .notices-page-wrapper {
          min-height: 100vh;
          background: #fdfdfd;
        }
        .admin-access-section {
          padding: 4rem 0 6rem;
          display: flex;
          justify-content: center;
        }
        .admin-badge-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .management-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .btn-admin-access {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.75rem;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 100px;
          color: #475569;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .btn-admin-access:hover {
          background: #1e293b;
          color: #fff;
          border-color: #1e293b;
          transform: translateY(-3px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default NoticesPage;
