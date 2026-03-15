import { useState } from 'react';
import './EventsBanner.css';

const slides = [
  {
    tag: "Don't miss the fun",
    title: 'Stay updated with biggest events around you',
    btnText: 'View events',
    image: '/assets/images/events-banner.png',
  },
];

function EventsBanner() {
  const [activeSlide] = useState(0);

  return (
    <section className="events-banner">
      <div className="container">
        <div className="events-banner__card">
          <img
            src={slides[activeSlide].image}
            alt="Campus events"
            className="events-banner__image"
          />
          <div className="events-banner__overlay">
            <div className="events-banner__content">
              <span className="events-banner__tag">{slides[activeSlide].tag}</span>
              <h2 className="events-banner__title">{slides[activeSlide].title}</h2>
              <button className="events-banner__btn">
                {slides[activeSlide].btnText}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="events-banner__dots">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              className={`events-banner__dot ${i === activeSlide ? 'active' : ''}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default EventsBanner;
