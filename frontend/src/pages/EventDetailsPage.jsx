import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const EventDetailsPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/notices/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error('Failed to fetch event details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }}></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Event not found</h2>
        <Link to="/events" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem', maxWidth: '900px', margin: '0 auto' }}>
      <div className="breadcrumb" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <Link to="/events" style={{ color: 'var(--text-muted)' }}>Events</Link>
          <span>&gt;</span>
          <span style={{ color: 'var(--text-light)', fontWeight: '500' }}>{event.title || 'Event Details'}</span>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <img 
          src={event.attachments || '/card_events.png'} 
          alt={event.title || 'Event Image'} 
          style={{ width: '100%', height: '400px', objectFit: 'cover' }} 
        />
        <div style={{ padding: '3rem' }}>
          <span style={{ display: 'inline-block', padding: '0.4rem 1rem', background: '#f8fafc', color: '#64748b', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            {event.audience || 'All Students'}
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', color: '#1e293b' }}>
            {event.title}
          </h1>
          
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Date</p>
              <p style={{ fontWeight: '600', color: '#334155' }}>{event.date || 'Not specified'}</p>
            </div>
            <div>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Time</p>
              <p style={{ fontWeight: '600', color: '#334155' }}>{event.time || 'Not specified'}</p>
            </div>
            {event.location && (
              <div>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Location</p>
                <p style={{ fontWeight: '600', color: '#334155' }}>{event.location}</p>
              </div>
            )}
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', color: '#1e293b' }}>About the Event</h3>
            <p style={{ color: '#475569', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
              {event.description || 'No description available for this event.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
