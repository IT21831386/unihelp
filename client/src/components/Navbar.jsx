import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Notices', to: '/notices' },
  { label: 'Market place', to: '/marketplace' },
  { label: 'Bookings', to: '/bookings' },
  { label: 'Find a boarding', to: '/boarding' },
  { label: 'Job opportunities', to: '/careers' },
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
      setIsScrolled(window.scrollY > 20);
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
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">U</span>
          UNIHELP
        </Link>

        <ul className={`navbar__links ${isMenuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                className={`navbar__link ${location.pathname === link.to ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar__actions">
          <div className="navbar__profile-container">
            <div 
              className="navbar__user-icon" 
              title="Profile"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              {user ? user.name.charAt(0).toUpperCase() : '👤'}
            </div>
            
            {isProfileOpen && (
              <div className="navbar__dropdown">
                {user ? (
                  <>
                    <div className="navbar__dropdown-header">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                      <span className="navbar__role-badge">{user.role}</span>
                    </div>
                    {(user.role === 'employer' || user.role === 'admin') && (
                      <Link to="/owner/reviews" className="navbar__dropdown-item" onClick={() => setIsProfileOpen(false)}>
                        My Reviews
                      </Link>
                    )}
                    <button onClick={handleLogout} className="navbar__dropdown-item logout">
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="navbar__dropdown-item" onClick={() => setIsProfileOpen(false)}>
                      Log In
                    </Link>
                    <Link to="/signup" className="navbar__dropdown-item" onClick={() => setIsProfileOpen(false)}>
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          
          <button
            className="navbar__toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
