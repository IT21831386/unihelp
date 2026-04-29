import React, { useState, useEffect } from 'react';
import './MarketPlace.css';
import Navbar from '../Navbar';
import Footer from '../Footer';
import heroImg1 from '../../images/marketPlaceimg1.jpg';
import heroImg2 from '../../images/marketPlaceimg4.jpg';
import buyImg from '../../images/marketPlaceimg2.jpg';
import sellImg from '../../images/marketPlaceimg3.jpg';

const heroSlides = [heroImg1, heroImg2];

const Marketplace = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [animated, setAnimated]       = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mp-page-wrapper mp-live-bg">
      <Navbar />
      
      {/* ══ LIVE BACKGROUND ELEMENTS ══ */}
      <div className="mp-bg-images"></div>
      <div className="mp-bg-overlay"></div>
      <div className="mp-bg-aurora">
        <div className="mp-aurora-blob mp-aurora-1"></div>
        <div className="mp-aurora-blob mp-aurora-2"></div>
        <div className="mp-aurora-blob mp-aurora-3"></div>
      </div>

      <div className="mp-page">
        {/* ... Hero Section ... */}
        <div className={`mp-hero ${animated ? 'mp-hero--visible' : ''}`}>
          {heroSlides.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="Marketplace hero"
              className={`mp-hero__bg ${activeSlide === i ? 'mp-hero__bg--active' : ''}`}
            />
          ))}
          <div className="mp-hero__dots-grid" />
          <div className="mp-hero__orb-1" />
          <div className="mp-hero__orb-2" />
          <div className="mp-hero__overlay" />
          <div className="mp-hero__topbar">
            <div className="mp-hero__chip">Marketplace</div>
            <div className="mp-hero__dots">
              {heroSlides.map((_, i) => (
                <div
                  key={i}
                  className={`mp-hero__dot ${activeSlide === i ? 'mp-hero__dot--active' : ''}`}
                  onClick={() => setActiveSlide(i)}
                />
              ))}
            </div>
          </div>
          <div className="mp-hero__content">
            <p className="mp-hero__eyebrow">Discover · Trade · Connect</p>
            <h1 className="mp-hero__title">
              Find items that matches your taste or{' '}
              <span>sell anything</span>{' '}
              you have!
            </h1>
          </div>
          <div className="mp-hero__accent-line" />
        </div>

        {/* ... Cards Section ... */}
        <div className="mp-cards-section">
          <div className="mp-section-header">
            <span className="mp-section-label">What would you like to do?</span>
            <div className="mp-section-line" />
          </div>
          <div className="mp-cards-wrapper">
            <div
              className={`mp-card ${animated ? 'mp-card--visible' : ''} ${hoveredCard === 'buy' ? 'mp-card--hovered' : ''}`}
              onClick={() => window.location.href = '/marketplace/buy'}
              onMouseEnter={() => setHoveredCard('buy')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="mp-card__img-wrap">
                <img src={buyImg} alt="Buy Items" className="mp-card__img" />
                <div className="mp-card__img-overlay" />
                <div className="mp-card__icon-ring">
                  <div className="mp-card__icon-inner">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                  </div>
                </div>
                <span className="mp-card__badge">Browse</span>
              </div>
              <div className="mp-card__body">
                <p className="mp-card__micro-tag">Explore</p>
                <h3 className="mp-card__label">Buy Items</h3>
                <p className="mp-card__desc">Discover thousands of curated listings from trusted sellers near you</p>
                <div className="mp-card__footer">
                  <span className="mp-card__cta-text">Shop now</span>
                  <div className="mp-card__cta-btn">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M6 2l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`mp-card ${animated ? 'mp-card--visible' : ''} ${hoveredCard === 'sell' ? 'mp-card--hovered' : ''}`}
              onClick={() => window.location.href = '/marketplace/sell'}
              onMouseEnter={() => setHoveredCard('sell')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="mp-card__img-wrap">
                <img src={sellImg} alt="Sell Items" className="mp-card__img" />
                <div className="mp-card__img-overlay" />
                <div className="mp-card__icon-ring">
                  <div className="mp-card__icon-inner">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M12 7v6M9 10l3-3 3 3"/>
                    </svg>
                  </div>
                </div>
                <span className="mp-card__badge">List</span>
              </div>
              <div className="mp-card__body">
                <p className="mp-card__micro-tag">Earn</p>
                <h3 className="mp-card__label">Sell Items</h3>
                <p className="mp-card__desc">List anything you have and reach thousands of buyers instantly</p>
                <div className="mp-card__footer">
                  <span className="mp-card__cta-text">Start selling</span>
                  <div className="mp-card__cta-btn">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M6 2l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ... Bottom Bar ... */}
        <div className="mp-bottom-bar">
          <div className="mp-dots">
            <div className={`mp-dot ${hoveredCard === null || hoveredCard === 'buy' ? 'mp-dot--active' : ''}`} />
            <div className={`mp-dot ${hoveredCard === 'sell' ? 'mp-dot--active' : ''}`} />
          </div>
          <div className="mp-trust-row">
            <div className="mp-trust-item"><div className="mp-trust-pip" />Trusted</div>
            <div className="mp-trust-item"><div className="mp-trust-pip" />Verified</div>
            <div className="mp-trust-item"><div className="mp-trust-pip" />Secure</div>
          </div>
        </div>
      </div>
      <Footer />

      <style>{`
        .mp-live-bg {
          position: relative;
          min-height: 100vh;
          background: #ffffff;
          overflow-x: hidden;
        }

        .mp-bg-images {
          position: fixed;
          inset: 0;
          z-index: 0;
          background-size: cover;
          background-position: center;
          animation: mpBgCrossfade 30s infinite;
          opacity: 0.35;
        }

        .mp-bg-overlay {
          position: fixed;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            135deg,
            rgba(240, 243, 255, 0.4) 0%,
            rgba(255, 255, 255, 0.3) 100%
          );
        }

        @keyframes mpBgCrossfade {
          0%, 18%  { background-image: url('https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=2070&auto=format&fit=crop'); }
          20%, 38% { background-image: url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop'); }
          40%, 58% { background-image: url('https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070&auto=format&fit=crop'); }
          60%, 78% { background-image: url('https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?q=80&w=1974&auto=format&fit=crop'); }
          80%, 98% { background-image: url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop'); }
          100%     { background-image: url('https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=2070&auto=format&fit=crop'); }
        }

        .mp-bg-aurora {
          position: fixed;
          inset: 0;
          z-index: 2;
          filter: blur(100px);
          opacity: 0.5;
          pointer-events: none;
        }

        .mp-aurora-blob {
          position: absolute;
          border-radius: 50%;
          animation: mpFloat 25s infinite alternate ease-in-out;
        }
        .mp-aurora-1 { width: 60vw; height: 60vw; background: rgba(255, 107, 53, 0.15); top: -10%; right: -10%; }
        .mp-aurora-2 { width: 50vw; height: 50vw; background: rgba(59, 130, 246, 0.1); bottom: -10%; left: -5%; }
        .mp-aurora-3 { width: 40vw; height: 40vw; background: rgba(139, 92, 246, 0.1); top: 30%; left: 30%; }

        @keyframes mpFloat {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(5%, 5%) scale(1.05); }
        }

        .mp-page {
          position: relative;
          z-index: 10;
        }
      `}</style>
    </div>
  );
};

export default Marketplace;