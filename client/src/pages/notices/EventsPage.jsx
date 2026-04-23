import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedNotice } = useNotification();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/notices?category=Events');
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="events-page">
      <Navbar />
      
      <div className="container event-container">
        <div className="breadcrumb">
          <Link to="/notices">Notices</Link>
          <span>/</span>
          <span className="current">Events</span>
        </div>

        <div className="page-header">
          <h2>University Events</h2>
          <p>Clubs, societies, and campus-wide events happening this semester.</p>
        </div>

        {loading ? (
          <div className="loader">Loading events...</div>
        ) : (
          <div className="event-grid">
            {events.length > 0 ? events.map(event => (
              <div key={event._id} className="event-card" onClick={() => setSelectedNotice(event)}>
                <div className="event-image">
                  <img src={event.attachments || '/assets/images/special-notices.png'} alt={event.title} />
                  <div className="event-date-badge">
                    <span className="day">{event.date?.split('-')[2] || event.date?.split(' ')[0]}</span>
                    <span className="month">{event.date?.split('-')[1] || event.date?.split(' ')[1]}</span>
                  </div>
                </div>
                <div className="event-content">
                  <span className="event-tag">Clubs & Societies</span>
                  <h3>{event.title}</h3>
                  <div className="event-meta">
                    <span>📍 {event.location || 'Campus'}</span>
                    <span>⏰ {event.time || 'TBA'}</span>
                  </div>
                  <button className="interest-btn">Interested</button>
                </div>
              </div>
            )) : (
              <div className="empty-state">No upcoming events found.</div>
            )}
          </div>
        )}
      </div>

      <Footer />

      <style>{`
        .events-page { background: #fdfdfd; min-height: 100vh; }
        .event-container { padding-top: 100px; padding-bottom: 80px; }
        .breadcrumb { display: flex; gap: 10px; color: #94a3b8; font-size: 0.9rem; margin-bottom: 30px; }
        .breadcrumb a { color: #94a3b8; text-decoration: none; }
        .breadcrumb .current { color: #1e293b; font-weight: 600; }

        .page-header h2 { font-size: 2.5rem; font-weight: 900; color: #1e293b; margin-bottom: 10px; }
        .page-header p { color: #64748b; font-size: 1.1rem; margin-bottom: 40px; }

        .event-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }
        .event-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          transition: all 0.3s;
          border: 1px solid #f1f5f9;
          cursor: pointer;
        }
        .event-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); border-color: #10b981; }
        
        .event-image { position: relative; height: 200px; }
        .event-image img { width: 100%; height: 100%; object-fit: cover; }
        .event-date-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: white;
          padding: 8px 12px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .event-date-badge .day { font-size: 1.2rem; font-weight: 900; color: #1e293b; }
        .event-date-badge .month { font-size: 0.7rem; font-weight: 800; color: #10b981; text-transform: uppercase; }

        .event-content { padding: 25px; }
        .event-tag { font-size: 0.75rem; font-weight: 800; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px; }
        .event-content h3 { font-size: 1.4rem; font-weight: 800; color: #1e293b; margin: 10px 0 15px; line-height: 1.3; }
        .event-meta { display: flex; flex-direction: column; gap: 8px; color: #64748b; font-size: 0.95rem; margin-bottom: 25px; }
        
        .interest-btn {
          width: 100%;
          padding: 12px;
          background: #f1f5f9;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        .interest-btn:hover { background: #10b981; color: white; }

        .loader { padding: 50px; text-align: center; color: #64748b; }
        .empty-state { grid-column: 1/-1; padding: 100px; text-align: center; color: #94a3b8; font-size: 1.2rem; }
      `}</style>
    </div>
  );
};

export default EventsPage;
