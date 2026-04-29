import React from 'react';
import { useNavigate } from 'react-router-dom';

const NoticeHero = ({ onBrowseNotices, onViewEvents }) => {
  const navigate = useNavigate();

  const handleBrowseNotices = () => {
    if (onBrowseNotices) {
      onBrowseNotices();
    } else {
      navigate('/special-notices');
    }
  };

  const handleViewEvents = () => {
    if (onViewEvents) {
      onViewEvents();
    } else {
      navigate('/events');
    }
  };

  return (
    <section className="notice-hero">
      <div 
        className="notice-hero-bg" 
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2072&auto=format&fit=crop')` }}
      ></div>
      <div className="notice-hero-overlay"></div>
      
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="notice-hero-content">
          <h1 className="notice-hero-title">
            Stay Connected with <span>Campus Life</span>
          </h1>
          <p className="notice-hero-subtitle">
            Your central hub for university events, club updates, and official special notices.
          </p>
          <div className="notice-hero-actions">
            <button onClick={handleBrowseNotices} className="btn-notice btn-primary-notice">
              <i className="fa-solid fa-bullhorn" style={{marginRight: '8px'}}></i>
              Browse Notices
            </button>
            <button onClick={handleViewEvents} className="btn-notice btn-glass-notice">
              <i className="fa-solid fa-calendar-days" style={{marginRight: '8px'}}></i>
              View Events
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .notice-hero {
          position: relative;
          min-height: 45vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
          padding: 80px 5% 40px;
          border-radius: 0 0 50px 50px;
          margin-bottom: 40px;
        }

        .notice-hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-size: cover;
          background-position: center;
          z-index: 0;
          filter: brightness(0.8);
        }

        .notice-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(27, 20, 100, 0.8) 0%, rgba(15, 15, 20, 0.6) 100%);
          z-index: 1;
        }

        .notice-hero-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: fadeUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .notice-hero-title {
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          line-height: 1.2;
          color: #ffffff;
          margin-bottom: 1.2rem;
          font-weight: 800;
          letter-spacing: -1px;
          text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .notice-hero-title span {
          background: linear-gradient(135deg, #FF6B35 0%, #ff855a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .notice-hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2.2rem;
          max-width: 650px;
          line-height: 1.6;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .notice-hero-actions {
          display: flex;
          gap: 1.2rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-notice {
          padding: 14px 32px;
          border-radius: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-primary-notice {
          background: linear-gradient(135deg, #FF6B35 0%, #ff855a 100%);
          color: white;
          box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
        }

        .btn-primary-notice:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 25px rgba(255, 107, 53, 0.4);
        }

        .btn-glass-notice {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          backdrop-filter: blur(10px);
        }

        .btn-glass-notice:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-3px);
          border-color: rgba(255, 255, 255, 0.4);
        }

        @media (max-width: 768px) {
          .notice-hero {
            min-height: 40vh;
            padding: 100px 5% 40px;
          }
        }
      `}</style>
    </section>
  );
};

export default NoticeHero;
