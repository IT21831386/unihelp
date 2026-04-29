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
              <img src={c.image} alt={c.title} />
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
          padding: 60px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: transparent;
        }

        .cards-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 30px; 
        }

        .custom-card {
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 24px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          width: 280px;
          height: 280px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }
        
        .custom-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          border-color: #FF6B35;
          background: #ffffff;
        }

        .custom-card.featured {
          width: 320px;
          height: 320px;
          z-index: 2;
          background: #ffffff;
          border-color: rgba(255, 107, 53, 0.3);
          box-shadow: 0 15px 45px rgba(255, 107, 53, 0.15);
        }

        .card-image-wrap {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          width: 100%;
        }

        .custom-card .card-image-wrap {
          height: 160px;
        }

        .custom-card.featured .card-image-wrap {
          height: 200px;
        }

        .card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .custom-card:hover .card-image-wrap img {
          transform: scale(1.1);
        }

        .card-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #FF6B35;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-body {
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          padding-top: 15px;
        }

        .card-body h3 {
          font-size: 1.3rem;
          font-weight: 800;
          margin: 0;
          color: #1e293b;
        }

        .card-body p {
          font-size: 0.9rem;
          color: #64748b;
          margin: 6px 0 0;
          font-weight: 500;
        }

        .card-explore {
          margin-top: auto;
          font-size: 0.85rem;
          font-weight: 700;
          color: #FF6B35;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .custom-card:hover .card-explore {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 900px) {
          .cards-container {
            flex-direction: column;
            gap: 2rem;
          }
          .custom-card, .custom-card.featured {
            width: 100%;
            max-width: 320px;
            height: auto;
            min-height: 280px;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryCards;
