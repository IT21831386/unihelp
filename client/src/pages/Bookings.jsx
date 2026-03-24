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
    <>
      <Navbar />

      {/* Hero Banner */}
      <section className="bookings-hero">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&h=500&fit=crop"
          alt="Student booking"
          className="bookings-hero__image"
        />
        <div className="bookings-hero__overlay">
          <h1 className="bookings-hero__title">
            Book seatings before you miss your favourite spots in studies.
          </h1>
        </div>
      </section>

      {/* Booking Categories */}
      <section className="bookings-section">
        <div className="container">
          <h2 className="bookings-section__heading">Your booking confirmations</h2>

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
    </>
  );
}

export default Bookings;
