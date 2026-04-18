import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const PublicEventsTab = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notices');
      const todayStr = new Date().toISOString().split('T')[0];
      
      // Filter for general Events and exclude Archived/Expired
      const filteredEvents = res.data.filter(n => 
        n.category === 'Events' &&
        !n.isArchived &&
        (!n.expiryDate || n.expiryDate >= todayStr)
      );
      setEvents(filteredEvents); 
    } catch (err) {
      console.error('Failed to fetch events', err);
    } finally {
      setLoading(false);
    }
  };

  const recentEvent = events.length > 0 ? events[0] : null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter(evt => {
    if (!evt.date) return true; // default to upcoming if no date
    return new Date(evt.date) >= today;
  });

  const pastEvents = events.filter(evt => {
    if (!evt.date) return false;
    return new Date(evt.date) < today;
  });

  const renderEventGrid = (eventsList) => (
    <div className="events-grid" style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
      gap: '2rem',
      marginBottom: '3rem'
    }}>
      {eventsList.map((evt, index) => (
        <div key={evt._id || index} className="event-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '100%', height: '180px', marginBottom: '1rem', overflow: 'hidden' }}>
            <img 
              src={evt.attachments || evt.image || '/card_events.png'} 
              alt="Event" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} 
            />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            {evt.audience || 'Club events'}
          </span>
          <h4 style={{ fontSize: '1rem', fontWeight: '700', lineHeight: '1.4', marginBottom: '0.75rem', color: '#111' }}>
            {evt.title && evt.title.length > 70 ? evt.title.substring(0, 70) + '...' : evt.title}
          </h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', alignItems: 'center' }}>
            <Link to={`/events/${evt._id}`} style={{ color: '#f97316', fontWeight: '800', fontSize: '0.9rem', textDecoration: 'none' }}>
              View more
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="events-page container" style={{ padding: '2rem 1.5rem 5rem' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <Link to="/notices" style={{ color: 'var(--text-muted)' }}>Notices</Link> 
          <span>&gt;</span> 
          <span style={{ color: 'var(--text-light)', fontWeight: '500' }}>Events</span>
        </div>
      </div>

      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: '800' }}>Recents</h1>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }}></div>
        </div>
      ) : (
        <>
          {recentEvent ? (
            <div className="recent-event-block" style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              gap: '3rem', 
              marginBottom: '4rem',
              alignItems: 'center'
            }}>
              <div className="recent-text-content" style={{ flex: '1' }}>
                <p style={{ color: '#888', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                  {recentEvent.audience || "Drama clubs's 40th anniversary"}
                </p>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '1.5rem', color: '#333' }}>
                  {recentEvent.title || "Come and enjoy the evening at our open theatre. A joyful night is awaiting for you to spread the laughter."}
                </h2>
                <div style={{ color: '#666', fontSize: '1.1rem', fontWeight: '600', lineHeight: '1.8', marginBottom: '2rem' }}>
                  <p>Date : {recentEvent.date}</p>
                  <p>Time : {recentEvent.time}</p>
                  <p>Entrance free</p>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <Link to={`/events/${recentEvent._id}`} style={{ color: '#f97316', fontWeight: '800', fontSize: '1.1rem', textDecoration: 'none' }}>
                    View more
                  </Link>
                </div>
              </div>
              <div className="recent-image-content" style={{ flex: '1.2' }}>
                <img 
                  src={recentEvent.attachments || '/card_events.png'} 
                  alt={recentEvent.title} 
                  style={{ width: '100%', borderRadius: '24px', objectFit: 'cover', height: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} 
                />
              </div>
            </div>
          ) : (
            <div className="recent-event-block" style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              gap: '3rem', 
              marginBottom: '4rem',
              alignItems: 'center'
            }}>
              <div className="recent-text-content" style={{ flex: '1' }}>
                <p style={{ color: '#888', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                  Drama clubs's 40th anniversary
                </p>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '1.5rem', color: '#333' }}>
                  Come and enjoy the evening at our open theatre. A joyful night is awaiting for you to spread the laughter.
                </h2>
                <div style={{ color: '#666', fontSize: '1.1rem', fontWeight: '600', lineHeight: '1.8', marginBottom: '2rem' }}>
                  <p>Date : 20th April 2026</p>
                  <p>Time : 6.00PM onwards</p>
                  <p>Entrance free</p>
                </div>
                <Link to={`#`} style={{ color: '#f97316', fontWeight: '800', fontSize: '1.1rem', textDecoration: 'none' }}>
                  View more
                </Link>
              </div>
              <div className="recent-image-content" style={{ flex: '1.2' }}>
                <img 
                  src="/card_events.png" 
                  alt="Recent Event" 
                  style={{ width: '100%', borderRadius: '24px', objectFit: 'cover', height: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} 
                />
              </div>
            </div>
          )}

          {upcomingEvents.length > 0 && (
            <>
              <div className="events-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>Upcoming Events</h2>
              </div>
              {renderEventGrid(upcomingEvents)}
            </>
          )}

          {pastEvents.length > 0 && (
            <>
              <div className="events-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', marginTop: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, color: '#64748b' }}>Past Events</h2>
              </div>
              {renderEventGrid(pastEvents)}
            </>
          )}

          {upcomingEvents.length === 0 && pastEvents.length === 0 && events.length > 0 && (
            // Fallback just in case everything was displayed in recentEvent and none left, or something
            <div></div>
          )}
        </>
      )}
    </div>
  );
};

export default PublicEventsTab;
