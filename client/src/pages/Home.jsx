import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import EventsBanner from '../components/EventsBanner';
import Footer from '../components/Footer';
import './Home.css';

const bentoFeatures = [
  {
    id: 'boarding',
    title: 'Peer-Verified Boarding Places',
    category: 'Accommodation',
    tag: 'Popular',
    desc: 'Browse rooms, shared annexes, and houses near campus. View photos, filter by walking distance, and send direct viewing booking requests.',
    link: '/boarding',
    btnText: 'Find a Place to Stay',
    icon: 'bi-house-check-fill',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop',
    accentColor: '#10b981',
    badgeText: '500+ Listings'
  },
  {
    id: 'bookings',
    title: 'Smart Campus Seat & Space Booking',
    category: 'Study Zones',
    tag: 'Live Occupancy',
    desc: 'Reserve study desks and canteen seats in advance. Auto-allocate adjacent seats for project groups and export instant QR entrance passes to Google Calendar.',
    link: '/bookings',
    btnText: 'Reserve Study Desk',
    icon: 'bi-qr-code-scan',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
    accentColor: '#5938B6',
    badgeText: 'Instant Pass'
  },
  {
    id: 'marketplace',
    title: 'Student-to-Student Marketplace',
    category: 'Commerce',
    tag: 'Zero Fees',
    desc: 'Buy and sell textbooks, electronics, dorm essentials, and calculators within your campus network with secure peer messaging.',
    link: '/marketplace',
    btnText: 'Shop Campus Deals',
    icon: 'bi-shop-window',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1200&auto=format&fit=crop',
    accentColor: '#ec4899',
    badgeText: 'Save up to 70%'
  },
  {
    id: 'careers',
    title: 'Student Internships & Part-Time Jobs',
    category: 'Careers',
    tag: 'Tailored for Students',
    desc: 'Find flexible internships, tutoring gigs, and campus ambassador roles that fit seamlessly around your lecture timetable.',
    link: '/careers',
    btnText: 'Explore Opportunities',
    icon: 'bi-briefcase-fill',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200&auto=format&fit=crop',
    accentColor: '#f59e0b',
    badgeText: 'Verified Employers'
  },
  {
    id: 'notices',
    title: 'Live Campus Notices & Lost & Found',
    category: 'Campus Life',
    tag: 'Real-Time Feed',
    desc: 'Stay informed with faculty notices, upcoming club hackathons, lost item tracking, and campus emergencies all in one verified feed.',
    link: '/notices',
    btnText: 'View Campus Feed',
    icon: 'bi-megaphone-fill',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
    accentColor: '#6366f1',
    badgeText: 'Daily Updates'
  }
];

const whyUniHelpPillars = [
  {
    icon: 'bi-shield-check',
    title: 'Peer-Verified Community',
    desc: 'All boarding listings, items, and notices are verified by university peers to ensure safety and prevent spam.',
    color: '#3b82f6'
  },
  {
    icon: 'bi-lightning-charge-fill',
    title: 'Instant QR Entry Passes',
    desc: 'Book study spots and seats with automated adjacent grouping and 1-click Google Calendar & .ics export.',
    color: '#8b5cf6'
  },
  {
    icon: 'bi-geo-alt-fill',
    title: 'Campus Radius Proximity',
    desc: 'Filter boarding places by estimated walking time, bus commute duration, and exact proximity to faculty buildings.',
    color: '#10b981'
  },
  {
    icon: 'bi-chat-heart-fill',
    title: 'Direct Peer Communication',
    desc: 'Connect directly with sellers, landlords, and study partners without middlemen or hidden commission fees.',
    color: '#ec4899'
  }
];

const faqs = [
  {
    q: 'How does Seat Booking work for the campus library and canteen?',
    a: 'You can select your preferred area (e.g. Quiet Study, Discussion Zone), pick your time slot, and either select individual seats or click "Auto-Select Seats" for your group. You will receive an instant digital QR pass that can be saved directly to your Apple or Google Calendar.'
  },
  {
    q: 'Is UniHelp completely free for students?',
    a: 'Yes! UniHelp is 100% free for all students. You can browse notices, post marketplace listings, book seats, and contact boarding hosts without any subscription fees.'
  },
  {
    q: 'How do I schedule a viewing visit for a boarding place?',
    a: 'When you find a room or house you like, click "Request Booking" on the property details page. You can choose your preferred viewing date and include any questions or notes for the owner directly.'
  },
  {
    q: 'How can I post an internship or part-time job listing?',
    a: 'Companies, faculty members, and student leaders can post opportunities via the Career Portal after quick profile verification.'
  }
];

function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="home-page-bg">
      {/* Aurora glow layer */}
      <div className="hm-bg-aurora" aria-hidden="true">
        <div className="hm-aurora-blob hm-aurora-blob-1" />
        <div className="hm-aurora-blob hm-aurora-blob-2" />
        <div className="hm-aurora-blob hm-aurora-blob-3" />
      </div>

      {/* Film grain layer */}
      <div className="hm-bg-grain" aria-hidden="true" />

      <Navbar />
      
      {/* 1. Hero Section with Portal Launcher */}
      <Hero />

      {/* 2. Interactive Events Carousel Banner */}
      <EventsBanner />

      {/* 3. Creative Bento-Grid Feature Showcase */}
      <section className="hm-bento-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="hm-section-pill">🔥 Complete Campus Suite</span>
            <h2 className="hm-section-title">
              Designed Exclusively for <span className="highlight-gradient">Student Life</span>
            </h2>
            <p className="hm-section-subtitle">
              Every tool and portal you need to navigate your semester with ease, comfort, and productivity.
            </p>
          </div>

          <div className="hm-bento-grid">
            {bentoFeatures.map((feat, idx) => (
              <div 
                key={feat.id} 
                className={`hm-bento-card card-${idx + 1}`}
                style={{ '--accent': feat.accentColor }}
              >
                <div className="hm-bento-img-wrap">
                  <img src={feat.image} alt={feat.title} className="hm-bento-img" />
                  <div className="hm-bento-overlay" />
                  <div className="hm-bento-badges">
                    <span className="hm-bento-cat">{feat.category}</span>
                    <span className="hm-bento-tag">{feat.tag}</span>
                  </div>
                  <span className="hm-bento-highlight-badge">{feat.badgeText}</span>
                </div>

                <div className="hm-bento-body">
                  <div className="hm-bento-icon-title">
                    <div className="hm-bento-icon-box" style={{ background: feat.accentColor }}>
                      <i className={`bi ${feat.icon}`} />
                    </div>
                    <h3 className="hm-bento-title">{feat.title}</h3>
                  </div>

                  <p className="hm-bento-desc">{feat.desc}</p>

                  <div className="hm-bento-footer">
                    <Link to={feat.link} className="hm-bento-link-btn">
                      <span>{feat.btnText}</span>
                      <i className="bi bi-arrow-right-short fs-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Students Choose UniHelp */}
      <section className="hm-pillars-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="hm-section-pill">✨ The UniHelp Advantage</span>
            <h2 className="hm-section-title">
              Why Thousands of Students <span className="highlight-gradient">Rely On Us</span>
            </h2>
            <p className="hm-section-subtitle">
              Built by students, for students — solving real campus challenges every single day.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {whyUniHelpPillars.map((pillar, idx) => (
              <div key={idx} className="col-12 col-md-6 col-lg-3">
                <div className="hm-pillar-card">
                  <div className="hm-pillar-icon" style={{ color: pillar.color, background: `${pillar.color}18` }}>
                    <i className={`bi ${pillar.icon}`} />
                  </div>
                  <h4 className="hm-pillar-title">{pillar.title}</h4>
                  <p className="hm-pillar-desc">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions Interactive Accordion */}
      <section className="hm-faq-section">
        <div className="container">
          <div className="hm-faq-wrapper">
            <div className="text-center mb-5">
              <span className="hm-section-pill">💡 Got Questions?</span>
              <h2 className="hm-section-title">
                Frequently Asked <span className="highlight-gradient">Questions</span>
              </h2>
              <p className="hm-section-subtitle">
                Everything you need to know about navigating the UniHelp ecosystem.
              </p>
            </div>

            <div className="hm-faq-list">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className={`hm-faq-item ${isOpen ? 'open' : ''}`}>
                    <button 
                      type="button" 
                      className="hm-faq-question-btn"
                      onClick={() => toggleFaq(idx)}
                    >
                      <span className="hm-faq-q-text">{faq.q}</span>
                      <div className="hm-faq-toggle-icon">
                        <i className={`bi ${isOpen ? 'bi-dash-lg' : 'bi-plus-lg'}`} />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="hm-faq-answer-body">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Creative Impact CTA Banner */}
      <section className="hm-cta-section">
        <div className="container">
          <div className="hm-cta-card">
            <div className="hm-cta-shapes">
              <div className="hm-cta-shape-1" />
              <div className="hm-cta-shape-2" />
            </div>
            <div className="hm-cta-content text-center">
              <span className="hm-cta-badge">🚀 Get Started Today</span>
              <h2 className="hm-cta-title">
                Ready to Upgrade Your Campus Experience?
              </h2>
              <p className="hm-cta-desc">
                Join your fellow students at SLIIT and make finding accommodation, booking library desks, and discovering student opportunities effortless.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
                <Link to="/boarding" className="btn hm-cta-primary-btn">
                  <i className="bi bi-house-door-fill me-2" />
                  Explore Boarding Places
                </Link>
                <Link to="/bookings" className="btn hm-cta-secondary-btn">
                  <i className="bi bi-calendar2-check-fill me-2" />
                  Reserve a Seat
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;

