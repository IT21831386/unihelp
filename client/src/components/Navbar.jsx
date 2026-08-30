import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const navLinks = [
  { label: 'Home', to: '/', icon: 'bi-house-door-fill' },
  { label: 'Notices', to: '/notices', icon: 'bi-bell-fill' },
  { label: 'Marketplace', to: '/marketplace', icon: 'bi-bag-check-fill' },
  { label: 'Seat Bookings', to: '/bookings', icon: 'bi-grid-3x3-gap-fill' },
  { label: 'Find Boarding', to: '/boarding', icon: 'bi-building-fill' },
  { label: 'Careers', to: '/careers', icon: 'bi-briefcase-fill' },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial auth state
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    // Listen for auth changes
    const handleAuthChange = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };
    window.addEventListener('auth-change', handleAuthChange);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsProfileOpen(false);
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
  };

  return (
    <header className={`modern-navbar-wrapper ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="container">
        <nav className="modern-navbar-island">
          
          {/* Brand Logo */}
          <Link to="/" className="navbar__logo">
            <div className="navbar__logo-icon">
              <span>U</span>
            </div>
            <div className="navbar__logo-text">
              <strong>UNIHELP</strong>
              <span className="navbar__logo-tag">CAMPUS</span>
            </div>
          </Link>

          {/* Desktop Navigation Pills */}
          <ul className={`navbar__links ${isMenuOpen ? 'open' : ''}`}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className={`navbar__link ${isActive ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className={`bi ${link.icon} navbar__link-icon`} />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Action & Profile */}
          <div className="navbar__actions">
            {user ? (
              <div className="navbar__profile-container">
                <button 
                  type="button"
                  className="navbar__user-pill-btn" 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="navbar__user-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="navbar__user-name d-none d-md-inline">{user.name?.split(' ')[0]}</span>
                  <i className="bi bi-chevron-down navbar__chevron" />
                </button>
                
                {isProfileOpen && (
                  <div className="navbar__dropdown scale-in-center">
                    <div className="navbar__dropdown-header">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                      <span className="navbar__role-badge">{user.role || 'Student'}</span>
                    </div>
                    <Link to="/dashboard" className="navbar__dropdown-item" onClick={() => setIsProfileOpen(false)}>
                      <i className="bi bi-speedometer2 me-2 text-primary" />
                      Dashboard
                    </Link>
                    <Link to="/dashboard?tab=bookings" className="navbar__dropdown-item" onClick={() => setIsProfileOpen(false)}>
                      <i className="bi bi-calendar-check me-2 text-success" />
                      My Bookings
                    </Link>
                    {(user.role === 'employer' || user.role === 'admin') && (
                      <Link to="/owner/reviews" className="navbar__dropdown-item" onClick={() => setIsProfileOpen(false)}>
                        <i className="bi bi-star me-2 text-warning" />
                        My Reviews
                      </Link>
                    )}
                    <button onClick={handleLogout} className="navbar__dropdown-item logout">
                      <i className="bi bi-box-arrow-right me-2" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="navbar__auth-group d-flex align-items-center gap-2">
                <Link to="/login" className="navbar__login-btn">
                  Log In
                </Link>
                <Link to="/signup" className="navbar__signup-btn">
                  <span>Sign Up</span>
                  <i className="bi bi-arrow-right-short" />
                </Link>
              </div>
            )}
            
            {/* Mobile Hamburger Toggle */}
            <button
              className={`navbar__toggle ${isMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

        </nav>
      </div>
    </header>
  );
}

export default Navbar;

