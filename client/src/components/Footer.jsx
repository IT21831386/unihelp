import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Footer.css';

function Footer() {
  const [emailInput, setEmailInput] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      toast.error('Please enter a valid student email address');
      return;
    }
    toast.success('🎉 Subscribed to UniHelp Campus Digest!');
    setEmailInput('');
  };

  return (
    <footer className="modern-footer">
      <div className="footer__glow" />
      <div className="container">
        
        {/* Top Newsletter & Community Banner */}
        <div className="footer__top-banner">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-6">
              <div className="footer__top-text">
                <span className="footer__pulse-badge">
                  <span className="footer__live-dot" />
                  SLIIT Campus Community
                </span>
                <h3 className="footer__top-title">Stay in the Loop with UniHelp Digest</h3>
                <p className="footer__top-desc">Get the freshest boardings, exam notices, and student internship alerts delivered straight to your inbox.</p>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <form onSubmit={handleSubscribe} className="footer__subscribe-form">
                <div className="footer__subscribe-box">
                  <i className="bi bi-envelope-at-fill footer__sub-icon" />
                  <input
                    type="email"
                    placeholder="Enter your student email (e.g. it21...@my.sliit.lk)"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="footer__sub-input"
                  />
                  <button type="submit" className="footer__sub-btn">
                    <span>Subscribe</span>
                    <i className="bi bi-arrow-right" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="footer__grid">
          {/* Brand Column */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <div className="footer__logo-icon">U</div>
              <div className="footer__logo-text">
                <strong>UNIHELP</strong>
                <span>STUDENT PORTAL</span>
              </div>
            </Link>
            <p className="footer__brand-text">
              The premier all-in-one student companion ecosystem for Sri Lankan university undergraduates. Connecting students with safe accommodations, study spaces, campus marketplace, and careers.
            </p>
            <div className="footer__socials">
              <a href="#" className="footer__social-link" aria-label="Discord Community" title="Discord Community">
                <i className="bi bi-discord" />
              </a>
              <a href="#" className="footer__social-link" aria-label="GitHub" title="GitHub Repository">
                <i className="bi bi-github" />
              </a>
              <a href="#" className="footer__social-link" aria-label="Instagram" title="Instagram">
                <i className="bi bi-instagram" />
              </a>
              <a href="#" className="footer__social-link" aria-label="LinkedIn" title="LinkedIn">
                <i className="bi bi-linkedin" />
              </a>
              <a href="#" className="footer__social-link" aria-label="WhatsApp Community" title="WhatsApp Community">
                <i className="bi bi-whatsapp" />
              </a>
            </div>
          </div>

          {/* Portals */}
          <div className="footer__column">
            <h4>Campus Portals</h4>
            <ul>
              <li><Link to="/boarding"><i className="bi bi-chevron-right me-1" />Find Boarding</Link></li>
              <li><Link to="/bookings"><i className="bi bi-chevron-right me-1" />Seat Bookings</Link></li>
              <li><Link to="/marketplace"><i className="bi bi-chevron-right me-1" />Marketplace</Link></li>
              <li><Link to="/careers"><i className="bi bi-chevron-right me-1" />Student Careers</Link></li>
              <li><Link to="/notices"><i className="bi bi-chevron-right me-1" />Campus Notices</Link></li>
            </ul>
          </div>

          {/* Student Hub */}
          <div className="footer__column">
            <h4>Student Hub</h4>
            <ul>
              <li><Link to="/dashboard"><i className="bi bi-chevron-right me-1" />Personal Dashboard</Link></li>
              <li><Link to="/dashboard?tab=bookings"><i className="bi bi-chevron-right me-1" />My QR Passes</Link></li>
              <li><Link to="/notices"><i className="bi bi-chevron-right me-1" />Lost &amp; Found</Link></li>
              <li><Link to="/notices"><i className="bi bi-chevron-right me-1" />Club Events</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="footer__column">
            <h4>Security &amp; Trust</h4>
            <ul>
              <li><Link to="/login"><i className="bi bi-chevron-right me-1" />Student Verification</Link></li>
              <li><Link to="/contact"><i className="bi bi-chevron-right me-1" />Help Desk &amp; Support</Link></li>
              <li><Link to="/privacy"><i className="bi bi-chevron-right me-1" />Privacy Guidelines</Link></li>
              <li><Link to="/terms"><i className="bi bi-chevron-right me-1" />Community Terms</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <div className="footer__bottom-line" />
          <div className="footer__bottom-content">
            <div className="d-flex align-items-center gap-2">
              <span className="footer__status-badge">
                <span className="footer__status-dot" />
                All Systems Operational
              </span>
              <p className="mb-0">© {new Date().getFullYear()} UniHelp Platform. Crafted with ❤️ for university students.</p>
            </div>
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

