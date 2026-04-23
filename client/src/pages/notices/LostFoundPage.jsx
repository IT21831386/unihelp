import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const LostFoundPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedNotice } = useNotification();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/notices');
      // Filter for Lost & Found categories
      const lostFound = res.data.filter(n => 
        n.category === 'Lost Item' || n.category === 'Found Item' || n.category === 'Missing Items'
      );
      setItems(lostFound);
    } catch (err) {
      console.error('Failed to fetch items', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lost-found-page">
      <Navbar />
      
      <div className="container item-container">
        <div className="breadcrumb">
          <Link to="/notices">Notices</Link>
          <span>/</span>
          <span className="current">Lost & Found</span>
        </div>

        <div className="page-header">
          <h2>Lost & Found</h2>
          <p>Helping students recover lost belongings across the university campus.</p>
        </div>

        {loading ? (
          <div className="loader">Searching for items...</div>
        ) : (
          <div className="item-grid">
            {items.length > 0 ? items.map(item => (
              <div key={item._id} className="item-card" onClick={() => setSelectedNotice(item)}>
                <div className="item-image">
                  <img src={item.attachments || '/assets/images/special-notices.png'} alt={item.title} />
                  <span className={`status-badge ${item.category.includes('Lost') ? 'lost' : 'found'}`}>
                    {item.category.includes('Lost') ? 'LOST' : 'FOUND'}
                  </span>
                </div>
                <div className="item-info">
                  <h3>{item.title}</h3>
                  <div className="item-meta">
                    <p>📍 {item.location || 'Unknown'}</p>
                    <p>📅 {item.date}</p>
                  </div>
                  <button className="contact-btn">Contact Finder/Owner</button>
                </div>
              </div>
            )) : (
              <div className="empty-state">
                <h3>No missing items reported recently.</h3>
                <p>If you've lost something, check back later or report it to the student union.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />

      <style>{`
        .lost-found-page { background: #fdfdfd; min-height: 100vh; }
        .item-container { padding-top: 100px; padding-bottom: 80px; }
        .breadcrumb { display: flex; gap: 10px; color: #94a3b8; font-size: 0.9rem; margin-bottom: 30px; }
        .breadcrumb a { color: #94a3b8; text-decoration: none; }
        .breadcrumb .current { color: #1e293b; font-weight: 600; }

        .page-header h2 { font-size: 2.5rem; font-weight: 900; color: #1e293b; margin-bottom: 10px; }
        .page-header p { color: #64748b; font-size: 1.1rem; margin-bottom: 40px; }

        .item-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; }
        .item-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          border: 1px solid #f1f5f9;
          cursor: pointer;
          transition: all 0.3s;
        }
        .item-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); }
        
        .item-image { position: relative; height: 180px; }
        .item-image img { width: 100%; height: 100%; object-fit: cover; }
        .status-badge {
          position: absolute;
          bottom: 15px;
          left: 15px;
          padding: 6px 15px;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 900;
          color: white;
        }
        .status-badge.lost { background: #ef4444; }
        .status-badge.found { background: #10b981; }

        .item-info { padding: 20px; }
        .item-info h3 { font-size: 1.25rem; font-weight: 800; color: #1e293b; margin-bottom: 10px; }
        .item-meta { color: #64748b; font-size: 0.9rem; margin-bottom: 20px; }
        .item-meta p { margin: 4px 0; }
        
        .contact-btn {
          width: 100%;
          padding: 10px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        .contact-btn:hover { background: #1e293b; color: white; border-color: #1e293b; }

        .loader { padding: 50px; text-align: center; color: #64748b; }
        .empty-state { grid-column: 1/-1; padding: 100px; text-align: center; color: #94a3b8; }
      `}</style>
    </div>
  );
};

export default LostFoundPage;
