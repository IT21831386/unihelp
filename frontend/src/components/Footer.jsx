import React from 'react';
import { Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container" style={{ maxWidth: '1400px' }}>
        <div className="footer-grid">
          <div style={{ paddingRight: '2rem' }}>
            <div className="navbar-brand" style={{ marginBottom: '1.5rem', color: '#fff' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2v20M2 12h20M12 12L4 4M12 12l8-8M12 12l-8 8M12 12l8 8" opacity="0.5"></path>
              </svg>
              <span style={{ color: '#fff', fontStyle: 'italic' }}>UNIHELP</span>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem', marginBottom: '2rem', maxWidth: '250px' }}>
              This is a supportive website for all our university students.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="#"><Twitter size={16} /></a>
              <a href="#"><Facebook size={16} /></a>
              <a href="#"><Instagram size={16} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="footer-title">Address</h4>
            <div style={{ color: 'var(--footer-text)', marginBottom: '1.5rem', lineHeight: 1.8 }}>
              Malabe,<br />Sri Lanka
            </div>
            <h4 className="footer-title" style={{ marginTop: '1.5rem' }}>Contact</h4>
            <div style={{ color: 'var(--footer-text)', lineHeight: 1.8 }}>
              +9477 123-4567<br />
              support@sliit.com
            </div>
          </div>
          
          <div>
            <h4 className="footer-title">Navigation</h4>
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '1rem' }}><a href="#">Home</a></li>
              <li style={{ marginBottom: '1rem' }}><a href="#">Notices</a></li>
              <li style={{ marginBottom: '1rem' }}><a href="#">Market place</a></li>
              <li style={{ marginBottom: '1rem' }}><a href="#">Bookings</a></li>
              <li style={{ marginBottom: '1rem' }}><a href="#">Find a boarding</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="footer-title">Help</h4>
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '1rem' }}><a href="#">Support</a></li>
              <li style={{ marginBottom: '1rem' }}><a href="#">How it Works</a></li>
              <li style={{ marginBottom: '1rem' }}><a href="#">Terms & Condition</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2026 UniHelp. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
