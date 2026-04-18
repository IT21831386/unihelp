import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Bell, BellDot, Trash2 } from 'lucide-react';
import api from '../api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Notices', path: '/notices' },
    { name: 'Market place', path: '#' },
    { name: 'Bookings', path: '#' },
    { name: 'Find a boarding', path: '#' },
    { name: 'Job opportunities', path: '#' }
  ];

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notices');
      const allNotices = res.data;
      const lastRead = localStorage.getItem('lastReadNotif') || 0;
      
      // Filter for notices newer than last read
      // We use the ID or createdAt if available, otherwise just count
      const newNotices = allNotices.filter(n => {
        // Assume ID is timestamp-based or has createdAt
        const noticeTime = n._id ? parseInt(n._id.substring(0, 8), 16) : Date.now(); 
        // fallback to just checking if any exist that weren't there before
        return !localStorage.getItem(`read_${n._id}`);
      }).slice(0, 5); // Show latest 5

      setNotifications(allNotices.slice(0, 8)); // Keep 8 for history
      const unread = allNotices.filter(n => !localStorage.getItem(`read_${n._id}`)).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Notif fetch error', err);
    }
  };

  const markAllRead = () => {
    notifications.forEach(n => localStorage.setItem(`read_${n._id}`, 'true'));
    setUnreadCount(0);
    setIsNotifOpen(false);
  };

  const handleNotifClick = (id) => {
    localStorage.setItem(`read_${id}`, 'true');
    fetchNotifications();
    setIsNotifOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container" style={{ maxWidth: '1400px' }}>
        <Link to="/" className="navbar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2v20M2 12h20M12 12L4 4M12 12l8-8M12 12l-8 8M12 12l8 8" opacity="0.5"></path>
          </svg>
          <span style={{ fontWeight: 800 }}>UNIHELP</span>
        </Link>
        <ul className={`navbar-nav ${isOpen ? 'open' : ''}`}>
          {links.map((link) => (
            <li key={link.name}>
              <Link 
                to={link.path} 
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          
          {/* Notification Bell */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: '5px' }}
            >
              {unreadCount > 0 ? <BellDot color="#f97316" size={22} className="pulse" /> : <Bell size={22} />}
              {unreadCount > 0 && (
                <span style={{ 
                  position: 'absolute', 
                  top: '-2px', 
                  right: '-2px', 
                  background: '#f97316', 
                  color: '#fff', 
                  borderRadius: '50%', 
                  width: '18px', 
                  height: '18px', 
                  fontSize: '0.65rem', 
                  fontWeight: '800', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '2px solid #fff'
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div style={{ 
                position: 'absolute', 
                top: '45px', 
                right: '-10px', 
                background: '#fff', 
                width: '320px', 
                borderRadius: '16px', 
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)', 
                border: '1px solid #f1f5f9',
                zIndex: 1000,
                overflow: 'hidden',
                animation: 'fadeSlide 0.2s ease-out'
              }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontWeight: '800', fontSize: '0.95rem', color: '#1e293b' }}>Notifications</h4>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#f97316', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>
                      Mark all as read
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                      <p style={{ fontSize: '0.85rem' }}>No new notifications.</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n._id} 
                        onClick={() => handleNotifClick(n._id)}
                        style={{ 
                          padding: '1rem 1.25rem', 
                          borderBottom: '1px solid #f8fafc', 
                          cursor: 'pointer',
                          backgroundColor: localStorage.getItem(`read_${n._id}`) ? 'transparent' : '#fff7ed',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = localStorage.getItem(`read_${n._id}`) ? 'transparent' : '#fff7ed'}
                      >
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                          <span style={{ 
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '50%', 
                            background: '#f97316', 
                            marginTop: '5px',
                            display: localStorage.getItem(`read_${n._id}`) ? 'none' : 'block'
                          }}></span>
                          <div>
                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', lineHeight: '1.4' }}>{n.title}</p>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>{n.date} • {n.category}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div style={{ padding: '0.75rem', textAlign: 'center', background: '#f8fafc' }}>
                  <Link to="/notices" onClick={() => setIsNotifOpen(false)} style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textDecoration: 'none' }}>
                    View all notices
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="profile-icon">
            <User size={18} />
          </div>
          <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <style>{`
        .pulse { animation: bell-pulse 2s infinite; }
        @keyframes bell-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
