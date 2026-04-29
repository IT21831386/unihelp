import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCards = () => {
  const cards = [
    {
      id: 'events',
      title: 'Events',
      desc: 'Clubs & Societies',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop',
      link: '/events',
    },
    {
      id: 'notices',
      title: 'Special Notices',
      desc: 'Important Announcements',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2923216?q=80&w=2069&auto=format&fit=crop',
      link: '/special-notices',
      featured: true
    },
    {
      id: 'missing',
      title: 'Missing Items',
      desc: 'Lost & Found',
      image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1974&auto=format&fit=crop',
      link: '/lost-found',
    }
  ];

  return (
    <div className="cards-section">
      <div className="cards-container">
        {cards.map((c, i) => (
          <Link
            to={c.link}
            key={i}
            className={`custom-card ${c.featured ? 'featured' : ''}`}
          >
            <div className="card-image-wrap">
              <img src={c.image} alt={c.title} loading="lazy" />
              {c.featured && <div className="card-badge">Pinned</div>}
            </div>
            <div className="card-body">
              <h3>{c.title}</h3>
              {c.desc && <p>{c.desc}</p>}
              <div className="card-explore">
                Explore <i className="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .cards-section {
          padding: 80px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: transparent;
        }

        .cards-container {
          display: flex;
          align-items: stretch;
          justify-content: center;
          gap: 35px; 
          max-width: 1200px;
          width: 100%;
        }

        .custom-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 32px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
          width: 320px;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        
        .custom-card:hover {
          transform: translateY(-15px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1);
          border-color: #FF6B35;
          background: rgba(255, 255, 255, 0.95);
        }

        .custom-card.featured {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(255, 107, 53, 0.4);
          box-shadow: 0 25px 50px rgba(255, 107, 53, 0.15);
          transform: scale(1.05);
        }
        
        .custom-card.featured:hover {
          transform: scale(1.05) translateY(-15px);
        }

        .card-image-wrap {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          width: 100%;
          height: 200px;
          background: #f1f5f9; /* Fallback color */
        }

        .card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.8s ease;
        }

        .custom-card:hover .card-image-wrap img {
          transform: scale(1.15);
        }

        .card-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: #FF6B35;
          color: white;
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          box-shadow: 0 5px 15px rgba(255, 107, 53, 0.3);
        }

        .card-body {
          text-align: center;
          display: flex;
          flex-direction: column;
          padding: 24px 10px 15px;
          flex-grow: 1;
        }

        .card-body h3 {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          color: #1e1b4b;
          letter-spacing: -0.5px;
        }

        .card-body p {
          font-size: 14px;
          color: #64748b;
          margin: 8px 0 20px;
          font-weight: 500;
        }

        .card-explore {
          margin-top: auto;
          font-size: 14px;
          font-weight: 700;
          color: #FF6B35;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding-top: 15px;
          border-top: 1px solid rgba(0,0,0,0.05);
        }

        .custom-card:hover .card-explore {
          gap: 12px;
        }

        @media (max-width: 1024px) {
          .cards-container {
            flex-direction: column;
            gap: 30px;
            align-items: center;
          }
          .custom-card {
            width: 100%;
            max-width: 400px;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryCards;
