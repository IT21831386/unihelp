import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Bookings.css';

const bookingCategories = [
  {
    id: 'canteen',
    label: 'Canteen',
    image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&h=400&fit=crop',
  },
  {
    id: 'study-area',
    label: 'Study Area',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop',
  },
  {
    id: 'library',
    label: 'Library',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=400&fit=crop',
  },
];

function Bookings() {
  const [activeDot] = useState(1);

  return (
    <div className="bookings-page-bg">
      {/* Aurora glow layer */}
      <div className="bk-bg-aurora" aria-hidden="true">
        <div className="bk-aurora-blob bk-aurora-blob-1" />
        <div className="bk-aurora-blob bk-aurora-blob-2" />
        <div className="bk-aurora-blob bk-aurora-blob-3" />
      </div>

      {/* Film grain layer */}
      <div className="bk-bg-grain" aria-hidden="true" />

      <Navbar />

      {/* Page Title */}
      <div className="bookings-page-title container">
        <h1>Book seatings before you miss your favourite spots in studies.</h1>
        <p>Choose an area below to secure your space</p>
      </div>

      {/* Booking Categories */}
      <section className="bookings-section">
        <div className="container">
          <h2 className="bookings-section__heading">
            <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
              Your booking confirmations &rarr;
            </Link>
          </h2>

          <div className="bookings-cards">
            {bookingCategories.map((category) => (
              <Link to={`/bookings/${category.id}`} key={category.id} className="booking-card">
                <div className="booking-card__image-wrapper">
                  <img
                    src={category.image}
                    alt={category.label}
                    className="booking-card__image"
                  />
                </div>
                <p className="booking-card__label">{category.label}</p>
              </Link>
            ))}
          </div>

          <div className="bookings-dots">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                className={`bookings-dot ${i === activeDot ? 'active' : ''}`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Bookings;
