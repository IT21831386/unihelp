import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const quickPortals = [
  {
    id: 'notices',
    title: 'Notices & Events',
    badge: 'Live Feed',
    icon: 'bi-bell-fill',
    desc: 'Campus news & club events',
    path: '/notices',
    color: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    badge: 'Buy & Sell',
    icon: 'bi-bag-check-fill',
    desc: 'Textbooks, tech & dorm gear',
    path: '/marketplace',
    color: 'linear-gradient(135deg, #ec4899, #f43f5e)'
  },
  {
    id: 'bookings',
    title: 'Seat Bookings',
    badge: 'Instant Pass',
    icon: 'bi-grid-3x3-gap-fill',
    desc: 'Library & study space seats',
    path: '/bookings',
    color: 'linear-gradient(135deg, #5938B6, #3b82f6)'
  },
  {
    id: 'boarding',
    title: 'Find Boarding',
    badge: 'Verified Homes',
    icon: 'bi-house-heart-fill',
    desc: 'Rooms & hostels near campus',
    path: '/boarding',
    color: 'linear-gradient(135deg, #10b981, #059669)'
  },
  {
    id: 'careers',
    title: 'Student Careers',
    badge: 'Hiring Now',
    icon: 'bi-briefcase-fill',
    desc: 'Internships & part-time jobs',
    path: '/careers',
    color: 'linear-gradient(135deg, #f59e0b, #d97706)'
  },
];

function Hero() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (selectedCategory === 'boarding') {
      navigate(`/boarding?q=${encodeURIComponent(query)}`);
    } else if (selectedCategory === 'jobs' || selectedCategory === 'careers') {
      navigate(`/careers?q=${encodeURIComponent(query)}`);
    } else if (selectedCategory === 'marketplace') {
      navigate(`/marketplace?q=${encodeURIComponent(query)}`);
    } else if (selectedCategory === 'bookings') {
      navigate(`/bookings`);
    } else if (selectedCategory === 'notices') {
      navigate(`/notices?q=${encodeURIComponent(query)}`);
    } else {
      // Default smart route
      if (query.toLowerCase().includes('board') || query.toLowerCase().includes('room') || query.toLowerCase().includes('house')) {
        navigate(`/boarding?q=${encodeURIComponent(query)}`);
      } else if (query.toLowerCase().includes('job') || query.toLowerCase().includes('intern')) {
        navigate(`/careers?q=${encodeURIComponent(query)}`);
      } else if (query.toLowerCase().includes('seat') || query.toLowerCase().includes('library') || query.toLowerCase().includes('study')) {
        navigate(`/bookings`);
      } else {
        navigate(`/boarding?q=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero__glow" />
      <div className="container">
        <div className="hero__content">
          
          {/* Live Badge */}
          <div className="hero__badge">
            <span className="hero__badge-dot"></span>
            <span>✨ UniHelp • The All-In-One Campus SuperApp</span>
          </div>

          <h1 className="hero__title">
            Empowering Your <br />
            <span className="hero__title--gradient">Campus Life Journey</span>
          </h1>

          <p className="hero__subtitle">
            From discovering peer-verified boardings and booking library seats with instant QR passes, to campus marketplace deals and student internships — everything in one smart ecosystem.
          </p>
          
          {/* Smart Search Form */}
          <form className="hero__search-container" onSubmit={handleSearch}>
            <div className="hero__search-wrapper">
              <div className="hero__search-category-select">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="hero__cat-dropdown"
                >
                  <option value="all">All Portals</option>
                  <option value="boarding">Boarding Places</option>
                  <option value="bookings">Seat Bookings</option>
                  <option value="marketplace">Marketplace</option>
                  <option value="careers">Student Jobs</option>
                  <option value="notices">Campus Notices</option>
                </select>
              </div>

              <div className="hero__search-divider"></div>

              <i className="bi bi-search search-icon"></i>
              <input 
                type="text" 
                placeholder="Search boardings, library seats, student jobs, textbooks..." 
                className="hero__search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="hero__search-btn">
                <span>Explore</span>
                <i className="bi bi-arrow-right-short fs-5"></i>
              </button>
            </div>

            {/* Quick search suggestion tags */}
            <div className="hero__quick-tags">
              <span className="hero__tag-label">Popular Searches:</span>
              <button type="button" onClick={() => navigate('/boarding?q=Malabe')} className="hero__tag-pill">🏡 Malabe Rooms</button>
              <button type="button" onClick={() => navigate('/bookings')} className="hero__tag-pill">🪑 Library Quiet Zone</button>
              <button type="button" onClick={() => navigate('/careers')} className="hero__tag-pill">💼 Software Internships</button>
              <button type="button" onClick={() => navigate('/marketplace')} className="hero__tag-pill">📚 Calculus Textbooks</button>
            </div>
          </form>

          {/* ── Quick Portals Cards Grid ── */}
          <div className="hero__portals-grid">
            {quickPortals.map((portal) => (
              <div 
                key={portal.id} 
                className="hero__portal-card"
                onClick={() => navigate(portal.path)}
                role="button"
                tabIndex={0}
              >
                <div className="hero__portal-icon-box" style={{ background: portal.color }}>
                  <i className={`bi ${portal.icon}`}></i>
                </div>
                <div className="hero__portal-info">
                  <div className="d-flex align-items-center justify-content-between">
                    <h6 className="hero__portal-title">{portal.title}</h6>
                    <span className="hero__portal-badge">{portal.badge}</span>
                  </div>
                  <p className="hero__portal-desc">{portal.desc}</p>
                </div>
                <div className="hero__portal-arrow">
                  <i className="bi bi-arrow-up-right"></i>
                </div>
              </div>
            ))}
          </div>

          {/* ── Live Stats Bar ── */}
          <div className="hero__stats">
            <div className="stat-item">
              <span className="stat-number">12,500+</span>
              <span className="stat-label">Active Students</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">850+</span>
              <span className="stat-label">Verified Boardings</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Instant Digital Passes</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">4.9 ★</span>
              <span className="stat-label">Student Satisfaction</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;

