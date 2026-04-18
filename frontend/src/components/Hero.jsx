import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = ({ onBrowseNotices, onViewEvents }) => {
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
    <section className="hero">
      <div 
        className="hero-bg" 
        style={{ backgroundImage: 'url(/hero-bg.png)' }}
      ></div>
      <div className="hero-overlay"></div>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-content">
          <h1 className="hero-title">
            All your university events, clubs, and special notices <span>in one place.</span>
          </h1>
          <p className="hero-subtitle">
            Stay updated with everything happening around campus. Connect, discover, and never miss an important announcement again.
          </p>
          <div className="hero-actions">
            <button onClick={handleBrowseNotices} className="btn btn-primary btn-large">
              Browse Notices
            </button>
            <button onClick={handleViewEvents} className="btn btn-outline btn-large btn-glass">
              View Events
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
