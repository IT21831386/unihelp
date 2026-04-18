import React, { useState, useEffect } from 'react';
import api from '../api';

const PublicNoticesTab = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedNotice, setSelectedNotice] = useState(null);

  const categories = ['All', 'Academic', 'Exam', 'General'];

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notices');
      const today = new Date().toISOString().split('T')[0];

      // Filter: Show everything on the main Notice Board EXCEPT 'Lost Item', 'Found Item', or 'Missing Items' 
      // AND exclude Archived/Expired items
      const baseNotices = res.data.filter(n => 
        n.category !== 'Lost Item' && 
        n.category !== 'Found Item' && 
        n.category !== 'Missing Items' &&
        !n.isArchived && 
        (!n.expiryDate || n.expiryDate >= today)
      );
      setNotices(baseNotices);
    } catch (err) {
      console.error('Failed to fetch notices', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotices = notices.filter(n => {
    if (activeFilter === 'All') return true;
    
    // Date Logic
    const today = new Date().toISOString().split('T')[0];
    const noticeDate = n.date; // assuming YYYY-MM-DD

    if (activeFilter === 'Upcoming') return noticeDate >= today;
    if (activeFilter === 'Past') return noticeDate < today;
    
    // Category Logic
    return n.category === activeFilter;
  });

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Academic': return '#3b82f6'; // blue
      case 'Exam': return '#ef4444'; // red
      case 'General': return '#64748b'; // slate
      case 'Upcoming': return '#f59e0b'; // amber
      case 'Past': return '#94a3b8'; // gray
      default: return '#64748b';
    }
  };

  const today = new Date().toISOString().split('T')[0];
  
  // 1. Filter by category first
  const baseFiltered = notices.filter(n => {
    if (activeFilter === 'All' || activeFilter === 'Upcoming' || activeFilter === 'Past') return true;
    return n.category === activeFilter;
  });

  // 2. Split into Upcoming and Past
  const allUpcoming = baseFiltered.filter(n => n.date >= today);
  const allPast = baseFiltered.filter(n => n.date < today);

  // 3. Define Featured (the most recent upcoming, or the latest past if no upcoming)
  const featured = allUpcoming.length > 0 ? allUpcoming[0] : (allPast.length > 0 ? allPast[0] : null);
  
  // 4. Exclude featured from the lists
  const upcomingList = featured && allUpcoming.includes(featured) ? allUpcoming.filter(n => n._id !== featured._id) : allUpcoming;
  const pastList = featured && allPast.includes(featured) ? allPast.filter(n => n._id !== featured._id) : allPast;

  // 5. Final Display logic based on status filter (Upcoming/Past button)
  const showUpcoming = activeFilter === 'All' || activeFilter === 'Upcoming' || !['Upcoming', 'Past'].includes(activeFilter);
  const showPast = activeFilter === 'All' || activeFilter === 'Past' || !['Upcoming', 'Past'].includes(activeFilter);

  return (
    <div style={{ padding: '1rem 0' }}>
      
      <div className="page-header" style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '900', color: '#1e293b', letterSpacing: '-0.5px' }}>Notice Board</h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Latest updates and academic announcements.</p>
      </div>

      {/* Filter Bar */}
      <div style={{ 
        display: 'flex', 
        gap: '0.8rem', 
        marginBottom: '4rem', 
        flexWrap: 'wrap',
        padding: '0.5rem',
        background: '#f1f5f9',
        borderRadius: '16px',
        width: 'fit-content'
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem',
              transition: 'all 0.2s',
              backgroundColor: activeFilter === cat ? (cat === 'All' ? '#1e293b' : getCategoryColor(cat)) : 'transparent',
              color: activeFilter === cat ? '#ffffff' : '#64748b',
              boxShadow: activeFilter === cat ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
          <div className="spinner" style={{ width: '50px', height: '50px', borderColor: '#e2e8f0', borderTopColor: '#3b82f6' }}></div>
        </div>
      ) : (
        <>
          {/* Featured Section */}
          {featured && (activeFilter === 'All' || activeFilter === featured.category || (activeFilter === 'Upcoming' && featured.date >= today) || (activeFilter === 'Past' && featured.date < today)) && (
            <div style={{ marginBottom: '5rem' }}>
              <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: '1', minWidth: '300px' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase' }}>{featured.category}</span>
                  <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#0f172a', margin: '0.5rem 0 1.5rem 0', lineHeight: '1.1' }}>
                    {featured.title}
                  </h1>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#64748b', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <strong>Date :</strong> {featured.date}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <strong>Time :</strong> {featured.time || 'All Day'}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <strong>Audience :</strong> {featured.audience}
                    </div>
                  </div>
                  <button onClick={() => setSelectedNotice(featured)} style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#f59e0b', 
                    fontWeight: '800', 
                    fontSize: '1.1rem', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    View more
                  </button>
                </div>
                {featured.attachments && featured.attachments !== 'none' && (
                  <div style={{ flex: '1.2', minWidth: '350px' }}>
                    <img 
                      src={featured.attachments} 
                      alt="Featured" 
                      style={{ width: '100%', borderRadius: '30px', boxShadow: '0 30px 60px rgba(0,0,0,0.15)', objectFit: 'cover', height: '400px' }} 
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upcoming Section */}
          {showUpcoming && upcomingList.length > 0 && (
            <div style={{ marginBottom: '5rem' }}>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#1e293b', marginBottom: '2.5rem' }}>Upcoming Notices</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2.5rem' }}>
                {upcomingList.map(n => (
                  <NoticeCard key={n._id} notice={n} color={getCategoryColor(n.category)} onView={setSelectedNotice} />
                ))}
              </div>
            </div>
          )}

          {/* Past Section */}
          {showPast && pastList.length > 0 && (
            <div style={{ marginBottom: '5rem' }}>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#1e293b', marginBottom: '2.5rem' }}>Past Notices</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2.5rem' }}>
                {pastList.map(n => (
                  <NoticeCard key={n._id} notice={n} color={getCategoryColor(n.category)} onView={setSelectedNotice} />
                ))}
              </div>
            </div>
          )}

          {filteredNotices.length === 0 && (
            <div style={{ textAlign: 'center', padding: '6rem 2rem', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #cbd5e1' }}>
              <h3 style={{ color: '#64748b' }}>No notices found matching your selection.</h3>
            </div>
          )}
        </>
      )}

      {selectedNotice && (
        <div className="modal-overlay" onClick={() => setSelectedNotice(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: '2.5rem', borderRadius: '24px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ 
                  color: getCategoryColor(selectedNotice.category), 
                  fontSize: '0.8rem', 
                  fontWeight: '800', 
                  textTransform: 'uppercase',
                  padding: '4px 12px',
                  backgroundColor: `${getCategoryColor(selectedNotice.category)}15`,
                  borderRadius: '20px'
                }}>
                  {selectedNotice.category}
                </span>
                <h2 style={{ marginTop: '1rem', fontSize: '1.8rem', fontWeight: '900', color: '#1e293b' }}>{selectedNotice.title}</h2>
              </div>
              <button onClick={() => setSelectedNotice(null)} style={{ background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: '#64748b', position: 'absolute', top: '20px', right: '20px' }}>&times;</button>
            </div>
            
            {selectedNotice.attachments && selectedNotice.attachments !== 'none' && (
              <img src={selectedNotice.attachments} alt="Notice" style={{ width: '100%', borderRadius: '16px', marginBottom: '1.5rem', maxHeight: '300px', objectFit: 'cover' }} />
            )}
            
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>
              {selectedNotice.description}
            </p>
            
            <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#64748b' }}>
              <div><strong>Date:</strong> {selectedNotice.date}</div>
              {selectedNotice.time && <div><strong>Time:</strong> {selectedNotice.time}</div>}
              <div><strong>Audience:</strong> {selectedNotice.audience}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal Card Component for consistency
const NoticeCard = ({ notice, color, onView }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {notice.attachments && notice.attachments !== 'none' && (
      <img src={notice.attachments} alt="Item" style={{ width: '100%', height: '220px', borderRadius: '20px', objectFit: 'cover' }} />
    )}
    <div>
      <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>{notice.audience}</span>
      <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1e293b', margin: '0.4rem 0' }}>{notice.title}</h3>
      <button onClick={() => onView(notice)} style={{ 
        background: 'none', 
        border: 'none', 
        color: '#f59e0b', 
        fontWeight: '800', 
        fontSize: '0.9rem', 
        cursor: 'pointer',
        padding: 0
      }}>
        View more
      </button>
    </div>
  </div>
);

export default PublicNoticesTab;
