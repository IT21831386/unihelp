import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCards = () => {
  const cards = [
    {
      id: 'events',
      title: 'Events',
      desc: 'Clubs & Societies',
      image: '/card_events.png',
      link: '/events',
      hoverColor: '#f97316'
    },
    {
      id: 'notices',
      title: 'Special Notices',
      desc: 'Important Announcements',
      image: '/card_notices.png',
      link: '/special-notices',
      hoverColor: '#3b82f6'
    },
    {
      id: 'missing',
      title: 'Missing Items',
      desc: 'Lost & Found Campus Items',
      image: '/card_missing.png',
      link: '/lost-found',
      hoverColor: '#f59e0b'
    }
  ];

  return (
    <div className="cards-section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>Explore Categories</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Find exactly what you are looking for.</p>
        </div>
        <div className="grid">
          {cards.map((c, i) => (
            <Link 
              to={c.link} 
              key={i} 
              className="card category-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = c.hoverColor;
                e.currentTarget.style.borderWidth = '2px';
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = `0 20px 40px ${c.hoverColor}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.borderWidth = '1px';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
              style={{
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
               }}
            >
              <div className="card-image-wrap">
                <img src={c.image} alt={c.title} />
              </div>
              <h3>{c.title}</h3>
              {c.desc && <p>{c.desc}</p>}
            </Link>
          ))}
        </div>
        
        {/* Pagination Dots */}
        <div className="pagination-dots" style={{ marginTop: '3rem' }}>
          <div className="dot"></div>
          <div className="dot active"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCards;
