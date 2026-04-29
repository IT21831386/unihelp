import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="footer__logo-icon">U</span>
              UNIHELP
            </Link>
            <p className="footer__brand-text">
              Providing students with the ultimate toolkit for university life. Connect, discover, and thrive in your academic journey.
            </p>
            <div className="footer__socials">
              <a href="#" className="footer__social-link" aria-label="Twitter">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="#" className="footer__social-link" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="footer__social-link" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* About */}
          <div className="footer__column">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog">Student Blog</Link></li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="footer__column">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/notices">Latest Notices</Link></li>
              <li><Link to="/marketplace">Marketplace</Link></li>
              <li><Link to="/bookings">Seat Bookings</Link></li>
              <li><Link to="/boarding">Find Boarding</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div className="footer__column">
            <h4>Support</h4>
            <ul>
              <li><Link to="/login">My Account</Link></li>
              <li><Link to="/signup">Join Community</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__bottom-line" />
          <div className="footer__bottom-content">
            <p>© {new Date().getFullYear()} UniHelp. Built with ❤️ for students.</p>
            <div className="footer__bottom-links">
              <Link to="/cookies">Cookies</Link>
              <Link to="/security">Security</Link>
              <Link to="/sitemap">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
