import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Careers.css';

function getLoggedInUser() {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

const careerCategories = [
  {
    id: 'post-job',
    label: 'Post a Job',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=500&h=380&fit=crop',
    to: '/careers/post-job',
  },
  {
    id: 'find-job',
    label: 'Find  a Job',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&h=380&fit=crop',
    to: '/careers/find-jobs',
  },
];

function Careers() {
  const [activeDot] = useState(1);
  const navigate = useNavigate();
  const user = getLoggedInUser();

  // Students go directly to Find Jobs
  if (user && user.role === 'user') {
    return <Navigate to="/careers/find-jobs" replace />;
  }

  const isLoggedIn = !!user;

  const handleCardClick = (e, category) => {
    // If not logged in and clicking "Post a Job", redirect to login with return URL
    if (!isLoggedIn && category.id === 'post-job') {
      e.preventDefault();
      navigate('/login?redirect=/careers/post-job');
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Banner */}
      <section className="careers-hero">
        <img
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&h=500&fit=crop"
          alt="Career opportunities"
          className="careers-hero__image"
        />
        <div className="careers-hero__overlay">
          <h1 className="careers-hero__title">
            Find job opportunities and post to hire your next employee
          </h1>
        </div>
      </section>

      {/* Career Categories */}
      <section className="careers-section">
        <div className="container">
          <div className="careers-cards">
            {careerCategories.map((category) => (
              <Link
                to={category.to}
                key={category.id}
                className="career-card"
                onClick={(e) => handleCardClick(e, category)}
              >
                <div className="career-card__image-wrapper">
                  <img
                    src={category.image}
                    alt={category.label}
                    className="career-card__image"
                  />
                </div>
                <p className="career-card__label">{category.label}</p>
              </Link>
            ))}
          </div>

          <div className="careers-dots">
            {[0, 1].map((i) => (
              <button
                key={i}
                className={`careers-dot ${i === activeDot ? 'active' : ''}`}
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

export default Careers;
