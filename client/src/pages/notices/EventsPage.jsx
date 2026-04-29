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
    <div className="ev-page-wrapper">
      {/* Dynamic Background System */}
      <div className="bg-images ev-bg-images" aria-hidden="true" />
      <div className="bg-overlay" aria-hidden="true" />
      <div className="bg-aurora" aria-hidden="true">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>
      <div className="bg-grain" aria-hidden="true" />
      
      <Navbar />
      
      <div className="container event-container">
        <div className="ev-breadcrumb">
          <Link to="/notices">Notices</Link>
          <span className="ev-sep">/</span>
          <span className="ev-current">Events</span>
        </div>

        <div className="ev-header">
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
                  <img src={event.attachments || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop'} alt={event.title} />
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
        .ev-page-wrapper {
          position: relative;
          min-height: 100vh;
          background: transparent;
        }

        .ev-bg-images {
          animation: eventBgCrossfade 30s infinite;
        }

        @keyframes eventBgCrossfade {
          0%, 18%  { background-image: url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop'); }
          20%, 38% { background-image: url('https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070&auto=format&fit=crop'); }
          40%, 58% { background-image: url('https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop'); }
          60%, 78% { background-image: url('https://images.unsplash.com/photo-1514525253361-bee8d40d9990?q=80&w=2070&auto=format&fit=crop'); }
          80%, 98% { background-image: url('https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop'); }
          100%     { background-image: url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop'); }
        }

        .event-container {
          position: relative;
          z-index: 5;
          padding-top: 120px;
          padding-bottom: 80px;
        }

        .ev-breadcrumb {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 30px;
          font-size: 14px;
          color: rgba(255,255,255,0.7);
        }

        .ev-breadcrumb a {
          color: white;
          text-decoration: none;
          font-weight: 600;
        }

        .ev-header {
          margin-bottom: 50px;
          text-align: center;
        }

        .ev-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 700;
          color: white;
          margin-bottom: 10px;
          letter-spacing: -1px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        .ev-header p {
          color: rgba(255,255,255,0.8);
          font-size: 17px;
          max-width: 600px;
          margin: 0 auto;
        }

        .event-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 30px;
        }

        .event-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0,0,0,0.04);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(255, 255, 255, 0.5);
          cursor: pointer;
        }

        .event-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.1);
          border-color: #FF6B35;
        }
        
        .event-image {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .event-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .event-card:hover .event-image img {
          transform: scale(1.1);
        }

        .event-date-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background: white;
          padding: 10px 15px;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          z-index: 2;
        }

        .event-date-badge .day {
          font-size: 20px;
          font-weight: 800;
          color: #1e1b4b;
        }

        .event-date-badge .month {
          font-size: 10px;
          font-weight: 800;
          color: #FF6B35;
          text-transform: uppercase;
        }

        .event-content {
          padding: 30px;
        }

        .event-tag {
          font-size: 11px;
          font-weight: 800;
          color: #FF6B35;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
          display: block;
        }

        .event-content h3 {
          font-size: 22px;
          font-weight: 700;
          color: #1e1b4b;
          margin-bottom: 15px;
          line-height: 1.3;
        }

        .event-meta {
          display: flex;
          flex-direction: column;
          gap: 10px;
          color: #64748b;
          font-size: 15px;
          margin-bottom: 25px;
        }
        
        .interest-btn {
          width: 100%;
          padding: 14px;
          background: rgba(0,0,0,0.03);
          border: 1px solid rgba(0,0,0,0.05);
          border-radius: 14px;
          font-weight: 700;
          color: #1e1b4b;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .interest-btn:hover {
          background: #FF6B35;
          color: white;
          border-color: #FF6B35;
          box-shadow: 0 10px 20px rgba(255, 107, 53, 0.2);
        }

        .loader { padding: 50px; text-align: center; color: white; }
        .empty-state { grid-column: 1/-1; padding: 100px; text-align: center; color: white; font-size: 1.2rem; }
      `}</style>
    </div>
  );
};

export default EventsPage;
