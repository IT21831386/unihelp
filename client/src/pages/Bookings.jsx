import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Bookings.css';

const defaultCategoryMeta = [
  {
    id: 'canteen',
    label: 'Canteen',
    description: 'Casual tables, booths & dining area for study breaks and discussions.',
    image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop',
    icon: '☕',
    tag: 'Casual & Dining',
    facilities: ['Food & Beverages', 'Casual Discussion', 'Group Seating', 'AC Lounge']
  },
  {
    id: 'study-area',
    label: 'Study Area',
    description: 'Dedicated collaborative desks, group study tables and whiteboard zones.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop',
    icon: '💡',
    tag: 'Most Popular',
    facilities: ['Silent Study', 'Power Outlets', 'High-Speed WiFi', 'Individual Desks', 'Whiteboards']
  },
  {
    id: 'library',
    label: 'Library',
    description: 'Deep focus study pods, research terminals and whisper-quiet environment.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=400&fit=crop',
    icon: '📚',
    tag: 'Quiet Zone',
    facilities: ['Ultra Quiet Pods', 'Research Terminals', 'Power Sockets', 'Air Conditioned', 'Ergonomic Chairs']
  },
];

const facilityFilterOptions = [
  'All',
  'Power Outlets',
  'High-Speed WiFi',
  'Silent Study',
  'Group Seating',
  'Air Conditioned',
  'Whiteboards'
];

function Bookings() {
  const [selectedFacility, setSelectedFacility] = useState('All');
  const [searchDate, setSearchDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [searchTime, setSearchTime] = useState(() => {
    const h = new Date().getHours();
    return h < 8 ? '08:00' : h > 21 ? '21:00' : `${String(h).padStart(2, '0')}:00`;
  });
  const [statsData, setStatsData] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const query = new URLSearchParams({ date: searchDate, time: searchTime }).toString();
        const res = await fetch(`http://localhost:5000/api/bookings/stats?${query}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.stats) {
            setStatsData(data.stats);
            return;
          }
        }
        
        // Resilient Fallback: compute stats from areas and bookings
        const [areasRes, bookingsRes] = await Promise.all([
          fetch('http://localhost:5000/api/areas'),
          fetch(`http://localhost:5000/api/bookings?date=${searchDate}`)
        ]);

        if (areasRes.ok && bookingsRes.ok) {
          const areas = await areasRes.json();
          const bookings = await bookingsRes.json();
          const activeBookings = Array.isArray(bookings) ? bookings.filter(b => b.status === 'active') : [];
          
          const parts = searchTime.split(':');
          let endH = parseInt(parts[0], 10) + 1;
          if (endH > 22) endH = 22;
          const endTime = `${String(endH).padStart(2, '0')}:${parts[1] || '00'}`;

          const overlapping = activeBookings.filter(b => searchTime < b.endTime && endTime > b.time);

          const computed = (Array.isArray(areas) ? areas : []).map(a => {
            let total = 0;
            const count = (groups) => {
              if (!Array.isArray(groups)) return;
              groups.forEach(g => {
                if (Array.isArray(g.rows)) {
                  g.rows.forEach(r => { if (Array.isArray(r)) total += r.length; });
                }
              });
            };
            if (a.layoutConfig) {
              count(a.layoutConfig.left);
              count(a.layoutConfig.right);
            }
            if (total === 0) total = 18;

            const areaB = overlapping.filter(b => b.area === a.categoryId || b.category === a.categoryId);
            const bookedSet = new Set(areaB.flatMap(b => b.seats || []));
            const booked = bookedSet.size;
            const available = Math.max(0, total - booked);

            return {
              categoryId: a.categoryId,
              label: a.label,
              totalSeats: total,
              bookedCount: booked,
              availableCount: available,
              occupancyPercentage: Math.round((booked / total) * 100)
            };
          });

          if (computed.length > 0) {
            setStatsData(computed);
          }
        }
      } catch (err) {
        console.error('Failed to fetch booking stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [searchDate, searchTime]);

  const getAreaStats = (catId) => {
    return statsData.find(s => s.categoryId === catId) || {
      totalSeats: 18,
      bookedCount: 0,
      availableCount: 18,
      occupancyPercentage: 0,
      facilities: []
    };
  };

  const filteredCategories = defaultCategoryMeta.filter(cat => {
    if (selectedFacility === 'All') return true;
    const stats = getAreaStats(cat.id);
    const combinedFacilities = [...(cat.facilities || []), ...(stats.facilities || [])];
    return combinedFacilities.some(f => f.toLowerCase().includes(selectedFacility.toLowerCase()));
  });

  return (
    <div className="bookings-page-bg">
      {/* Aurora glow layer */}
      <div className="bk-bg-aurora" aria-hidden="true">
        <div className="bk-aurora-blob bk-aurora-blob-1" />
        <div className="bk-aurora-blob bk-aurora-blob-2" />
        <div className="bk-aurora-blob bk-aurora-blob-3" />
      </div>

      {/* Film grain layer */}
      <div className="bk-bg-grain" aria-hidden="true" />

      <Navbar />

      {/* Page Hero Header */}
      <div className="bookings-page-title container">
        <span className="bk-hero-badge">⚡ Real-Time Seat & Space Booking</span>
        <h1>Reserve Your Campus Space in Seconds</h1>
        <p>Choose from campus study spots, quiet library pods, or group canteen tables.</p>
        
        {/* Quick Search & Time Filter Bar */}
        <div className="bk-search-filter-bar">
          <div className="bk-filter-item">
            <span className="bk-filter-icon">📅</span>
            <div className="bk-filter-content">
              <label>Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>
          </div>

          <div className="bk-filter-divider" />

          <div className="bk-filter-item">
            <span className="bk-filter-icon">⏰</span>
            <div className="bk-filter-content">
              <label>Start Time</label>
              <input
                type="time"
                value={searchTime}
                onChange={(e) => setSearchTime(e.target.value)}
              />
            </div>
          </div>

          <div className="bk-filter-divider" />

          <div className="bk-filter-item flex-grow">
            <span className="bk-filter-icon">✨</span>
            <div className="bk-filter-content">
              <label>Amenity Filter</label>
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
              >
                {facilityFilterOptions.map(f => (
                  <option key={f} value={f}>{f === 'All' ? 'All Amenities' : f}</option>
                ))}
              </select>
            </div>
          </div>

          <Link
            to="/dashboard?tab=bookings"
            className="bk-my-bookings-btn"
          >
            📋 My Bookings
          </Link>
        </div>
      </div>

      {/* Live Capacity Quick Banner */}
      <section className="container">
        <div className="bk-live-metrics-strip">
          <div className="bk-metric-header">
            <div className="bk-live-pulse-wrapper">
              <span className="bk-live-pulse-dot"></span>
              <strong>Live Campus Space Occupancy</strong>
            </div>
            <span className="bk-metric-time">Viewing: {searchDate} at {searchTime}</span>
          </div>

          <div className="bk-metrics-grid">
            {defaultCategoryMeta.map(cat => {
              const stats = getAreaStats(cat.id);
              const isHigh = stats.occupancyPercentage >= 75;
              const isMed = stats.occupancyPercentage >= 40 && stats.occupancyPercentage < 75;
              const statusColor = isHigh ? '#ef4444' : isMed ? '#f59e0b' : '#10b981';

              return (
                <div key={cat.id} className="bk-metric-item">
                  <div className="bk-metric-item-top">
                    <span className="bk-metric-name">{cat.icon} {cat.label}</span>
                    <span className="bk-metric-status" style={{ color: statusColor, background: `${statusColor}18` }}>
                      {loadingStats ? 'Checking...' : `${stats.availableCount} free / ${stats.totalSeats} seats`}
                    </span>
                  </div>
                  <div className="bk-capacity-bar-track">
                    <div
                      className="bk-capacity-bar-fill"
                      style={{
                        width: `${loadingStats ? 20 : Math.max(5, stats.occupancyPercentage)}%`,
                        background: statusColor
                      }}
                    />
                  </div>
                  <div className="bk-metric-item-bottom">
                    <span>{stats.occupancyPercentage}% Occupied</span>
                    <span>{stats.availableCount > 0 ? '🟢 Spots Open' : '🔴 Full'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking Categories Section */}
      <section className="bookings-section">
        <div className="container">
          <div className="bk-cards-section-header">
            <div>
              <h2 className="bk-section-title">Available Areas</h2>
              <p className="bk-section-subtitle">Select an area below to view seat layout and reserve your spot</p>
            </div>
            <Link to="/dashboard?tab=bookings" className="bk-view-all-link">
              View Confirmation History &rarr;
            </Link>
          </div>

          <div className="bookings-cards-modern">
            {filteredCategories.map((category) => {
              const stats = getAreaStats(category.id);
              const isFull = stats.availableCount === 0;

              return (
                <div key={category.id} className="bk-card-modern">
                  <div className="bk-card-media">
                    <img
                      src={category.image}
                      alt={category.label}
                      className="bk-card-image"
                    />
                    <span className="bk-card-badge">{category.tag}</span>
                    <div className="bk-card-availability-badge">
                      {isFull ? (
                        <span className="badge-full">🔴 Fully Booked</span>
                      ) : (
                        <span className="badge-open">🟢 {stats.availableCount} Seats Available</span>
                      )}
                    </div>
                  </div>

                  <div className="bk-card-body">
                    <div className="bk-card-title-row">
                      <h3 className="bk-card-title">{category.icon} {category.label}</h3>
                    </div>
                    <p className="bk-card-desc">{category.description}</p>

                    {/* Facility Tags */}
                    <div className="bk-facility-tags">
                      {category.facilities.slice(0, 3).map((f, i) => (
                        <span key={i} className="bk-facility-tag">✓ {f}</span>
                      ))}
                    </div>

                    {/* Footer Action */}
                    <div className="bk-card-footer">
                      <div className="bk-card-seat-stats">
                        <strong>{stats.totalSeats} Total Seats</strong>
                        <span>08:00 AM – 10:00 PM</span>
                      </div>
                      <Link
                        to={`/bookings/${category.id}`}
                        className="bk-reserve-btn"
                      >
                        Select Seats &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="bk-no-results">
              <span style={{ fontSize: '3rem' }}>🔍</span>
              <h3>No areas matched "{selectedFacility}"</h3>
              <p>Try selecting "All" amenities to view all available study zones.</p>
              <button
                onClick={() => setSelectedFacility('All')}
                className="bk-reset-filter-btn"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="container bk-highlights-section">
        <div className="bk-highlight-card">
          <div className="bk-hl-icon">⚡</div>
          <h4>Instant Confirmation</h4>
          <p>Real-time seat reservation with instant Digital QR Pass generation.</p>
        </div>
        <div className="bk-highlight-card">
          <div className="bk-hl-icon">👥</div>
          <h4>Group Study Ready</h4>
          <p>Auto-locate adjacent seats together for project teams and discussions.</p>
        </div>
        <div className="bk-highlight-card">
          <div className="bk-hl-icon">📅</div>
          <h4>Calendar Integration</h4>
          <p>1-Click export to Google Calendar, Apple Calendar, and Outlook.</p>
        </div>
        <div className="bk-highlight-card">
          <div className="bk-hl-icon">🛡️</div>
          <h4>Verified Access</h4>
          <p>Guaranteed spot reserved exclusively for student ID and university email.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Bookings;

