import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCards = () => {
  const cards = [
    {
      id: 'events',
      title: 'Events',
      desc: 'Clubs & Societies',
      image: '/assets/images/special-notices.png', // Fallback to existing image
      link: '/events',
    },
    {
      id: 'notices',
      title: 'Special Notices',
      desc: 'Important Announcements',
      image: '/assets/images/special-notices.png',
      link: '/special-notices',
      featured: true
    },
    {
      id: 'missing',
      title: 'Missing Items',
      desc: 'Lost & Found',
      image: '/assets/images/special-notices.png',
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
            </div>
            <div className="card-body">
              <h3>{c.title}</h3>
              {c.desc && <p>{c.desc}</p>}
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .cards-section {
          padding: 4rem 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: transparent;
        }

        .cards-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px; 
        }

        .custom-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          width: 260px;
          height: 240px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .custom-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
          border-color: #ff7e5f;
        }

        .custom-card.featured {
          width: 300px;
          height: 280px;
          z-index: 2;
          border-color: #ff7e5f;
          box-shadow: 0 15px 35px rgba(255, 126, 95, 0.15);
        }

        .card-image-wrap {
          border-radius: 15px;
          overflow: hidden;
          width: 100%;
        }

        .custom-card .card-image-wrap {
          height: 140px;
        }

        .custom-card.featured .card-image-wrap {
          height: 180px;
        }

        .card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-body {
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          padding-top: 10px;
        }

        .card-body h3 {
          font-size: 1.2rem;
          font-weight: 800;
          margin: 0;
          color: #1e293b;
        }

        .card-body p {
          font-size: 0.85rem;
          color: #64748b;
          margin: 4px 0 0;
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .cards-container {
            flex-direction: column;
            gap: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryCards;
