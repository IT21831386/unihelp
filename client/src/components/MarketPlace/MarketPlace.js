import React, { useState, useEffect } from 'react';
import './MarketPlace.css';
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
    <div className="mp-page">

      {/* ══ HERO ══ */}
      <div className={`mp-hero ${animated ? 'mp-hero--visible' : ''}`}>

        {/* Slideshow images */}
        {heroSlides.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="Marketplace hero"
            className={`mp-hero__bg ${activeSlide === i ? 'mp-hero__bg--active' : ''}`}
          />
        ))}

        {/* Dot-grid texture */}
        <div className="mp-hero__dots-grid" />

        {/* Orange glow orbs */}
        <div className="mp-hero__orb-1" />
        <div className="mp-hero__orb-2" />

        {/* Dark directional overlay */}
        <div className="mp-hero__overlay" />

        {/* Top bar — chip badge + slide dots */}
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

        {/* Hero text */}
        <div className="mp-hero__content">
          <p className="mp-hero__eyebrow">Discover · Trade · Connect</p>
          <h1 className="mp-hero__title">
            Find items that matches your taste or{' '}
            <span>sell anything</span>{' '}
            you have!
          </h1>
        </div>

        {/* Bottom accent line */}
        <div className="mp-hero__accent-line" />
      </div>

      {/* ══ CARDS SECTION ══ */}
      <div className="mp-cards-section">

        {/* Section heading row */}
        <div className="mp-section-header">
          <span className="mp-section-label">What would you like to do?</span>
          <div className="mp-section-line" />
        </div>

        <div className="mp-cards-wrapper">

          {/* BUY CARD */}
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="#FF6B35" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round">
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
              <p className="mp-card__desc">
                Discover thousands of curated listings from trusted sellers near you
              </p>
              <div className="mp-card__footer">
                <span className="mp-card__cta-text">Shop now</span>
                <div className="mp-card__cta-btn">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M6 2l4 4-4 4"
                      stroke="#fff" strokeWidth="1.6"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* SELL CARD */}
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="#FF6B35" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <path d="M8 21h8M12 17v4"/>
                    <path d="M12 7v6M9 10l3-3 3 3"/>
                  </svg>
                </div>
              </div>
              <span className="mp-card__badge">List</span>
            </div>
            <div className="mp-card__body">
              <p className="mp-card__micro-tag">Earn</p>
              <h3 className="mp-card__label">Sell Items</h3>
              <p className="mp-card__desc">
                List anything you have and reach thousands of buyers instantly
              </p>
              <div className="mp-card__footer">
                <span className="mp-card__cta-text">Start selling</span>
                <div className="mp-card__cta-btn">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M6 2l4 4-4 4"
                      stroke="#fff" strokeWidth="1.6"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ══ BOTTOM BAR ══ */}
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
  );
};

export default Marketplace;