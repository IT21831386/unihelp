import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="footer__logo-icon">U</span>
              UNIHELP
            </Link>
            <p className="footer__brand-text">
              Every support you need for your university life in one place. Connect, discover, and thrive with UniHelp.
            </p>
            <div className="footer__socials">
              <a href="#" className="footer__social-link" aria-label="Twitter">𝕏</a>
              <a href="#" className="footer__social-link" aria-label="Facebook">f</a>
              <a href="#" className="footer__social-link" aria-label="Instagram">◎</a>
            </div>
          </div>

          {/* About */}
          <div className="footer__column">
            <h4>About</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/privacy">GDPR / Other</Link></li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="footer__column">
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/notices">Notices</Link></li>
              <li><Link to="/marketplace">Marketplace</Link></li>
              <li><Link to="/bookings">Bookings</Link></li>
              <li><Link to="/boarding">Find a Boarding</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div className="footer__column">
            <h4>Help</h4>
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Register</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} UniHelp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
