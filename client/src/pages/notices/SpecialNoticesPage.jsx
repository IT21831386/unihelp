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
      const today = new Date().toISOString().split('T')[0];

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
    <div className="special-notices-page">
      <Navbar />
      
      <div className="container notice-container">
        <div className="breadcrumb">
          <Link to="/notices">Notices</Link>
          <span>/</span>
          <span className="current">Special Notices</span>
        </div>

        <div className="page-header">
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
                backgroundColor: activeFilter === cat ? (cat === 'All' ? '#1e293b' : getCategoryColor(cat)) : 'transparent',
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
        .special-notices-page {
          background: #fdfdfd;
          min-height: 100vh;
        }
        .notice-container {
          padding-top: 100px;
          padding-bottom: 80px;
        }
        .breadcrumb {
          display: flex;
          gap: 10px;
          color: #94a3b8;
          font-size: 0.9rem;
          margin-bottom: 30px;
        }
        .breadcrumb a { color: #94a3b8; text-decoration: none; }
        .breadcrumb .current { color: #1e293b; font-weight: 600; }
        
        .page-header h2 { font-size: 2.5rem; font-weight: 900; color: #1e293b; margin-bottom: 10px; }
        .page-header p { color: #64748b; font-size: 1.1rem; margin-bottom: 40px; }

        .filter-bar {
          display: flex;
          gap: 10px;
          margin-bottom: 50px;
          background: #f1f5f9;
          padding: 8px;
          border-radius: 16px;
          width: fit-content;
        }
        .filter-bar button {
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-bar button.active { color: white; }

        .featured-notice {
          display: flex;
          gap: 50px;
          margin-bottom: 80px;
          align-items: center;
          background: white;
          padding: 40px;
          border-radius: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .featured-content { flex: 1; }
        .featured-cat { font-weight: 800; text-transform: uppercase; font-size: 0.9rem; }
        .featured-content h1 { font-size: 3rem; font-weight: 900; color: #1e293b; margin: 15px 0 25px; line-height: 1.1; }
        .featured-meta { margin-bottom: 30px; color: #64748b; }
        .view-more-btn {
          background: #1e293b;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 100px;
          font-weight: 700;
          cursor: pointer;
        }
        .featured-image { flex: 1; }
        .featured-image img { width: 100%; border-radius: 20px; height: 350px; object-fit: cover; }

        .notice-section { margin-bottom: 60px; }
        .notice-section h3 { font-size: 1.8rem; font-weight: 800; color: #1e293b; margin-bottom: 30px; }
        .notice-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; }
        .notice-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.03);
          cursor: pointer;
          transition: transform 0.3s;
          border: 1px solid #f1f5f9;
        }
        .notice-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
        .notice-card img { width: 100%; height: 200px; object-fit: cover; }
        .card-info { padding: 20px; }
        .card-cat { font-weight: 800; text-transform: uppercase; font-size: 0.75rem; }
        .card-info h4 { font-size: 1.2rem; font-weight: 700; margin: 10px 0; color: #1e293b; }
        .card-info p { color: #94a3b8; font-size: 0.9rem; }

        .loader { padding: 50px; text-align: center; color: #64748b; font-weight: 600; }
      `}</style>
    </div>
  );
};

export default SpecialNoticesPage;
