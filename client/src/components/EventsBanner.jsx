import { useState, useEffect } from 'react';
import './EventsBanner.css';

const slides = [
  {
    tag: "Don't miss the fun",
    title: 'Stay updated with the biggest events around you',
    btnText: 'Explore Events',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
  },
  {
    tag: "Marketplace",
    title: 'Buy and sell items within your campus community',
    btnText: 'Visit Marketplace',
    image: 'https://images.unsplash.com/photo-1534452286337-d9a513854a4b?q=80&w=2070&auto=format&fit=crop',
  },
  {
    tag: "Boarding",
    title: 'Find the most comfortable places to stay near campus',
    btnText: 'Find Boarding',
    image: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=2070&auto=format&fit=crop',
  },
];

function EventsBanner() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="events-banner">
      <div className="container">
        <div className="events-banner__wrapper">
          {slides.map((slide, index) => (
            <div 
              key={index}
              className={`events-banner__card ${index === activeSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="events-banner__overlay">
                <div className="events-banner__content">
                  <span className="events-banner__tag">{slide.tag}</span>
                  <h2 className="events-banner__title">{slide.title}</h2>
                  <button className="events-banner__btn">
                    {slide.btnText}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="events-banner__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`events-banner__dot ${i === activeSlide ? 'active' : ''}`}
              onClick={() => setActiveSlide(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default EventsBanner;
