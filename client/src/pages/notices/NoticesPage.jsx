import React from 'react';
import { Link } from 'react-router-dom';
import NoticeHero from '../../components/notices/NoticeHero';
import CategoryCards from '../../components/notices/CategoryCards';
import { Lock } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const NoticesPage = () => {
  return (
    <div className="unihelp-page-bg">
      <div className="bg-aurora">
        <div className="aurora-blob aurora-blob-1"></div>
        <div className="aurora-blob aurora-blob-2"></div>
        <div className="aurora-blob aurora-blob-3"></div>
      </div>
      <div className="bg-grain"></div>
      
      <Navbar />
      <div className="notices-content-push">
        <NoticeHero />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
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
      </div>
      <Footer />
      <style>{`
        .unihelp-page-bg {
          min-height: 100vh;
          position: relative;
          background: #ffffff;
          overflow-x: hidden;
        }

        .unihelp-page-bg::before {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 0;
          background-size: cover;
          background-position: center;
          animation: noticeBgCrossfade 30s infinite;
          opacity: 0.45;
        }

        .unihelp-page-bg::after {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            135deg,
            rgba(240, 243, 255, 0.3) 0%,
            rgba(255, 255, 255, 0.2) 100%
          );
        }

        @keyframes noticeBgCrossfade {
          0%, 18%  { background-image: url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2072&auto=format&fit=crop'); }
          20%, 38% { background-image: url('https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop'); }
          40%, 58% { background-image: url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop'); }
          60%, 78% { background-image: url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop'); }
          80%, 98% { background-image: url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop'); }
          100%     { background-image: url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2072&auto=format&fit=crop'); }
        }

        .bg-aurora {
          position: fixed;
          inset: 0;
          z-index: 2;
          filter: blur(100px);
          opacity: 0.6;
          pointer-events: none;
        }

        .aurora-blob {
          position: absolute;
          border-radius: 50%;
          animation: noticeFloat 25s infinite alternate ease-in-out;
        }
        .aurora-blob-1 { width: 60vw; height: 60vw; background: rgba(59, 130, 246, 0.4); top: -10%; left: -10%; }
        .aurora-blob-2 { width: 50vw; height: 50vw; background: rgba(255, 107, 53, 0.35); bottom: -10%; right: -5%; }
        .aurora-blob-3 { width: 40vw; height: 40vw; background: rgba(139, 92, 246, 0.3); top: 30%; left: 40%; }

        @keyframes noticeFloat {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(5%, 10%) scale(1.1); }
        }

        .notices-content-push {
          position: relative;
          z-index: 5;
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
