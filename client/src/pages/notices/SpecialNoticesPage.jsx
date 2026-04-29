import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const SpecialNoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const { setSelectedNotice } = useNotification();

  const categories = ['All', 'Academic', 'Exam', 'General'];

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/notices');
      
      // Filter: Show everything on the main Notice Board EXCEPT 'Lost Item', 'Found Item'
      const baseNotices = res.data.filter(n => 
        n.category !== 'Lost Item' && 
        n.category !== 'Found Item'
      );
      setNotices(baseNotices);
    } catch (err) {
      console.error('Failed to fetch notices', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Academic': return '#3b82f6';
      case 'Exam': return '#ef4444';
      case 'General': return '#64748b';
      default: return '#64748b';
    }
  };

  const today = new Date().toISOString().split('T')[0];
  
  const baseFiltered = notices.filter(n => {
    if (activeFilter === 'All') return true;
    return n.category === activeFilter;
  });

  const allUpcoming = baseFiltered.filter(n => n.date >= today);
  const allPast = baseFiltered.filter(n => n.date < today);

  const featured = allUpcoming.length > 0 ? allUpcoming[0] : (allPast.length > 0 ? allPast[0] : null);
  
  const upcomingList = featured && allUpcoming.includes(featured) ? allUpcoming.filter(n => n._id !== featured._id) : allUpcoming;
  const pastList = featured && allPast.includes(featured) ? allPast.filter(n => n._id !== featured._id) : allPast;

  return (
    <div className="sn-page-wrapper">
      {/* Dynamic Background System */}
      <div className="bg-images sn-bg-images" aria-hidden="true" />
      <div className="bg-overlay" aria-hidden="true" />
      <div className="bg-aurora" aria-hidden="true">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>
      <div className="bg-grain" aria-hidden="true" />
      
      <Navbar />
      
      <div className="container notice-container">
        <div className="sn-breadcrumb">
          <Link to="/notices">Notices</Link>
          <span className="sn-sep">/</span>
          <span className="sn-current">Special Notices</span>
        </div>

        <div className="sn-header">
          <h2>Notice Board</h2>
          <p>Latest updates and academic announcements from the university.</p>
        </div>

        <div className="filter-bar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={activeFilter === cat ? 'active' : ''}
              style={{
                backgroundColor: activeFilter === cat ? (cat === 'All' ? '#1e1b4b' : getCategoryColor(cat)) : 'transparent',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loader">Loading notices...</div>
        ) : (
          <>
            {featured && (
              <div className="featured-notice">
                <div className="featured-content">
                  <span className="featured-cat" style={{ color: getCategoryColor(featured.category) }}>{featured.category}</span>
                  <h1>{featured.title}</h1>
                  <div className="featured-meta">
                    <p><strong>Date:</strong> {featured.date}</p>
                    <p><strong>Audience:</strong> {featured.audience}</p>
                  </div>
                  <button onClick={() => setSelectedNotice(featured)} className="view-more-btn">View full details</button>
                </div>
                {featured.attachments && (
                  <div className="featured-image">
                    <img src={featured.attachments} alt="Notice" />
                  </div>
                )}
              </div>
            )}

            {upcomingList.length > 0 && (
              <section className="notice-section">
                <h3>Upcoming Notices</h3>
                <div className="notice-grid">
                  {upcomingList.map(n => (
                    <div key={n._id} className="notice-card" onClick={() => setSelectedNotice(n)}>
                      {n.attachments && <img src={n.attachments} alt="" />}
                      <div className="card-info">
                        <span className="card-cat" style={{ color: getCategoryColor(n.category) }}>{n.category}</span>
                        <h4>{n.title}</h4>
                        <p>{n.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {pastList.length > 0 && (
              <section className="notice-section">
                <h3>Past Notices</h3>
                <div className="notice-grid">
                  {pastList.map(n => (
                    <div key={n._id} className="notice-card" onClick={() => setSelectedNotice(n)}>
                      <div className="card-info">
                        <span className="card-cat" style={{ color: getCategoryColor(n.category) }}>{n.category}</span>
                        <h4>{n.title}</h4>
                        <p>{n.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <Footer />

      <style>{`
        .sn-page-wrapper {
          position: relative;
          min-height: 100vh;
          background: transparent;
        }

        .sn-bg-images {
          animation: noticeBgCrossfade 30s infinite;
        }

        @keyframes noticeBgCrossfade {
          0%, 18%  { background-image: url('https://images.unsplash.com/photo-1521791136064-7986c2923216?q=80&w=2069&auto=format&fit=crop'); }
          20%, 38% { background-image: url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop'); }
          40%, 58% { background-image: url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973&auto=format&fit=crop'); }
          60%, 78% { background-image: url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop'); }
          80%, 98% { background-image: url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop'); }
          100%     { background-image: url('https://images.unsplash.com/photo-1521791136064-7986c2923216?q=80&w=2069&auto=format&fit=crop'); }
        }

        .notice-container {
          position: relative;
          z-index: 5;
          padding-top: 120px;
          padding-bottom: 80px;
        }

        .sn-breadcrumb {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 30px;
          font-size: 14px;
          color: rgba(255,255,255,0.7);
        }

        .sn-breadcrumb a {
          color: white;
          text-decoration: none;
          font-weight: 600;
        }

        .sn-header {
          margin-bottom: 50px;
          text-align: center;
        }

        .sn-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 700;
          color: white;
          margin-bottom: 10px;
          letter-spacing: -1px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        .sn-header p {
          color: rgba(255,255,255,0.8);
          font-size: 17px;
          max-width: 600px;
          margin: 0 auto;
        }

        .filter-bar {
          display: flex;
          gap: 10px;
          margin-bottom: 50px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          padding: 8px;
          border-radius: 20px;
          width: fit-content;
          margin-left: auto;
          margin-right: auto;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .filter-bar button {
          border: none;
          padding: 10px 24px;
          border-radius: 14px;
          font-weight: 700;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          background: transparent;
        }

        .filter-bar button.active {
          color: white;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .featured-notice {
          display: flex;
          gap: 50px;
          margin-bottom: 80px;
          align-items: center;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          padding: 50px;
          border-radius: 40px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.06);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .featured-content { flex: 1; }
        .featured-cat { font-weight: 800; text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; }
        
        .featured-content h1 {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 700;
          color: #1e1b4b;
          margin: 15px 0 25px;
          line-height: 1.1;
          letter-spacing: -1px;
        }

        .featured-meta { margin-bottom: 35px; color: #64748b; font-size: 16px; }
        .featured-meta p { margin-bottom: 8px; }
        
        .view-more-btn {
          background: #1e1b4b;
          color: white;
          border: none;
          padding: 16px 40px;
          border-radius: 100px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 20px rgba(27, 20, 100, 0.2);
        }

        .view-more-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(27, 20, 100, 0.3);
        }

        .featured-image { flex: 1; height: 400px; }
        .featured-image img { width: 100%; border-radius: 30px; height: 100%; object-fit: cover; }

        .notice-section { margin-bottom: 80px; }
        .notice-section h3 {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: white;
          margin-bottom: 35px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .notice-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 35px; }
        
        .notice-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0,0,0,0.03);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .notice-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.1);
          border-color: #FF6B35;
        }

        .notice-card img { width: 100%; height: 220px; object-fit: cover; transition: transform 0.6s ease; }
        .notice-card:hover img { transform: scale(1.1); }
        
        .card-info { padding: 30px; }
        .card-cat { font-weight: 800; text-transform: uppercase; font-size: 10px; letter-spacing: 0.1em; }
        .card-info h4 { font-size: 20px; font-weight: 700; margin: 12px 0; color: #1e1b4b; line-height: 1.3; }
        .card-info p { color: #94a3b8; font-size: 14px; font-weight: 500; }

        @media (max-width: 968px) {
          .featured-notice { flex-direction: column; padding: 30px; }
          .featured-image { width: 100%; height: 300px; }
          .featured-content h1 { font-size: 36px; }
        }

        .loader { padding: 50px; text-align: center; color: white; font-weight: 600; }
      `}</style>
    </div>
  );
};

export default SpecialNoticesPage;
