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
        style={{ backgroundImage: `url('/assets/images/special-notices.png')` }}
      ></div>
      <div className="notice-hero-overlay"></div>
      
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="notice-hero-content">
          <h1 className="notice-hero-title">
            All your university<br/>events, clubs, and<br/>special notices <span>in one<br/>place.</span>
          </h1>
          <p className="notice-hero-subtitle">
            Stay updated with everything happening around campus.<br/>Connect, discover, and never miss an important announcement<br/>again.
          </p>
          <div className="notice-hero-actions">
            <button onClick={handleBrowseNotices} className="btn-notice btn-primary-notice">
              Browse Notices
            </button>
            <button onClick={handleViewEvents} className="btn-notice btn-glass-notice">
              View Events
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .notice-hero {
          position: relative;
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
          padding: 0 5%;
          border-radius: 0 0 40px 40px;
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
          animation: liveZoom 20s linear infinite alternate;
        }

        @keyframes liveZoom {
          0% { transform: scale(1.0); }
          100% { transform: scale(1.15); }
        }

        .notice-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(9, 9, 21, 0.7) 100%);
          z-index: 1;
        }

        .notice-hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: fadeUp 1s ease-out forwards;
        }

        .notice-hero-title {
          font-size: clamp(2.5rem, 5vw, 4.2rem);
          line-height: 1.15;
          color: #ffffff;
          margin-bottom: 1.5rem;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .notice-hero-title span {
          color: #ff7e5f;
        }

        .notice-hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.15rem);
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 2.5rem;
          max-width: 600px;
          line-height: 1.6;
        }

        .notice-hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-notice {
          padding: 1rem 2rem;
          border-radius: 100px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          font-size: 1rem;
        }

        .btn-primary-notice {
          background: #ff7e5f;
          color: white;
        }

        .btn-primary-notice:hover {
          background: #feb47b;
          transform: translateY(-2px);
        }

        .btn-glass-notice {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          backdrop-filter: blur(10px);
        }

        .btn-glass-notice:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
};

export default NoticeHero;
