import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReviewList from '../components/ReviewList';
import './BoardingDetails.css';

const BoardingDetails = () => {
  const { id } = useParams();
  const [boarding, setBoarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchBoarding();
  }, [id]);

  const fetchBoarding = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/boardings/${id}`);
      if (response.data && response.data.success) {
        setBoarding(response.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load boarding details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookBoarding = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.error('Please login to book a boarding place');
      return;
    }

    const user = JSON.parse(userStr);
    const userId = user.id || user._id || user.userId;
    
    if (!userId) {
      toast.error('User ID not found. Please log out and log back in.');
      return;
    }

    if (user.role !== 'user') {
      toast.error('Only students can book boarding places');
      return;
    }

    const confirmBooking = window.confirm(`Confirm booking request for "${boarding.title}"?`);
    if (!confirmBooking) return;

    try {
      const response = await axios.post('http://localhost:5000/api/boarding-bookings', {
        boardingId: boarding._id || boarding.id,
        userId: userId,
        message: `Initial booking request for ${boarding.title}`
      });

      if (response.data.success) {
        toast.success('Booking request sent successfully!');
      } else {
        toast.error(response.data.message || 'Failed to send booking request');
      }
    } catch (error) {
      console.error('Booking Error Details:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error processing booking';
      toast.error(`Error: ${errorMsg}`);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="unihelp-loader-container">
          <div className="unihelp-loader">
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
            <div className="loader-logo">U</div>
          </div>
          <span className="loader-text">Fetching Property...</span>
        </div>
      </div>
    );
  }

  if (!boarding) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
        <i className="bi bi-building-x display-1 text-secondary mb-4"></i>
        <h2 className="text-dark fw-bold">Property Not Found</h2>
        <p className="text-secondary mb-4">The boarding place you're looking for doesn't exist or was removed.</p>
        <Link to="/boarding" className="btn btn-primary px-4 py-2 rounded-pill fw-medium">
          <i className="bi bi-arrow-left me-2"></i>Back to Listings
        </Link>
      </div>
    );
  }

  const images = boarding.imageUrls && boarding.imageUrls.length > 0
    ? boarding.imageUrls
    : ['https://images.unsplash.com/photo-1522771731470-ea44358153a5?q=80&w=2070&auto=format&fit=crop'];

  return (
    <div className="unihelp-page-bg pb-5 boarding-details" style={{ fontFamily: "'Inter', sans-serif", paddingTop: '100px' }}>
      
      {/* Aurora glow layer */}
      <div className="bg-aurora" aria-hidden="true">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
        <div className="aurora-blob aurora-blob-4" />
      </div>

      {/* Film grain layer */}
      <div className="bg-grain" aria-hidden="true" />

      <Navbar />
      <Toaster position="top-center" />

      {/* Navigation Header */}
      <div className="bd-back-nav">
        <div className="container">
          <Link to="/boarding" className="bd-back-link">
            <span className="bd-back-link__icon"><i className="bi bi-arrow-left" /></span>
            Back to all places
          </Link>
        </div>
      </div>

      <div className="container mt-4 mt-lg-5 mb-5 pb-5 boarding-details__container">

        {/* ── Header Title Section ── */}
        <div className="bd-header-card">
          <div className="bd-header-card__left">
            <div className="bd-header-card__badges">
              {/* Verified Badge */}
              {(boarding.isVerified || boarding.userId) && (
                <span className="bc-verified-badge">
                  <i className="bi bi-patch-check-fill" /> Verified
                </span>
              )}
              
              {/* Hot Deal Badge */}
              {(boarding.isHotDeal || 
                (boarding.price > 0 && (
                  (boarding.propertyType === 'Room' && boarding.price < 15000) ||
                  ((boarding.propertyType === 'Apartment' || boarding.propertyType === 'House') && boarding.price < 40000)
                ))
              ) && (
                <span className="bc-hotdeal-badge">
                  <i className="bi bi-fire" /> Hot Deal
                </span>
              )}

              <span className={`bd-status-badge ${
                boarding.availabilityStatus === 'Available' ? 'bd-status-badge--available' :
                boarding.availabilityStatus === 'Full'      ? 'bd-status-badge--full' :
                                                              'bd-status-badge--maintenance'
              }`}>
                <span className="bd-status-badge__dot" />
                {boarding.availabilityStatus}
              </span>
              <span className="bd-type-badge">
                <i className="bi bi-building me-1" />{boarding.propertyType}
              </span>
            </div>
            <h1 className="bd-header-card__title">{boarding.title}</h1>
            <div className="bd-header-card__location">
              <span className="bd-location-chip">
                <i className="bi bi-geo-alt-fill" />
                {boarding.address}, {boarding.city}, {boarding.district}
              </span>
            </div>
          </div>

          <div className="bd-price-block">
            <p className="bd-price-block__label">Monthly Rent</p>
            <div className="bd-price-block__amount">
              <span className="bd-price-block__currency">
                {boarding.currency === 'LKR' ? 'Rs' : boarding.currency}
              </span>
              <span className="bd-price-block__value">
                {boarding.price.toLocaleString()}
              </span>
            </div>
            <span className="bd-price-block__note">per month</span>
            
            {boarding.availabilityStatus === 'Available' && (
              <button 
                onClick={handleBookBoarding}
                className="btn btn-primary w-100 mt-3 rounded-pill fw-bold py-2 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #5938B6, #ec4899)', border: 'none' }}
              >
                <i className="bi bi-bookmark-plus-fill me-2"></i>Book Now
              </button>
            )}
          </div>
        </div>

        <div className="row justify-content-center g-5 boarding-details__layout">
          {/* Main Content */}
          <div className="col-12 col-lg-10">

            {/* Image Gallery */}
            <div className="gallery-card-modern mb-5 boarding-details__gallery">
              <div className="position-relative rounded-3 overflow-hidden bg-light gallery-hero-img-wrapper" style={{ aspectRatio: '16/9' }}>
                <img
                  src={images[activeImage]}
                  alt={boarding.title}
                  className="w-100 h-100 object-fit-cover boarding-details__hero-img"
                  style={{ transition: 'opacity 0.3s ease-in-out' }}
                />
              </div>
              {images.length > 1 && (
                <div className="d-flex gap-2 mt-3 overflow-auto pb-2 boarding-details__thumbs" style={{ scrollbarWidth: 'thin' }}>
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`rounded-3 overflow-hidden flex-shrink-0 cursor-pointer boarding-details__thumb ${activeImage === idx ? 'border border-2 border-primary shadow-sm is-active' : 'opacity-75'}`}
                      style={{ width: '100px', height: '70px', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <img src={img} alt="Thumbnail" className="w-100 h-100 object-fit-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── About this place ── */}
            <div className="bd-section-card mb-5">
              <div className="bd-section-card__header">
                <div className="bd-section-card__header-icon bd-section-card__header-icon--blue">
                  <i className="bi bi-body-text" />
                </div>
                <div>
                  <h4 className="bd-section-card__title">About this place</h4>
                  <p className="bd-section-card__subtitle">Property description &amp; highlights</p>
                </div>
              </div>
              <p className="bd-section-card__body-text" style={{ whiteSpace: 'pre-line' }}>
                {boarding.description}
              </p>
            </div>

            {/* ── Property Specifications ── */}
            <div className="bd-section-card mb-5">
              <div className="bd-section-card__header">
                <div className="bd-section-card__header-icon bd-section-card__header-icon--purple">
                  <i className="bi bi-house-door" />
                </div>
                <div>
                  <h4 className="bd-section-card__title">Property Specifications</h4>
                  <p className="bd-section-card__subtitle">Room details &amp; capacity</p>
                </div>
              </div>

              <div className="bd-spec-grid">
                <div className="bd-stat-card bd-stat-card--purple">
                  <div className="bd-stat-card__icon"><i className="bi bi-door-open" /></div>
                  <span className="bd-stat-card__value">{boarding.totalRooms}</span>
                  <span className="bd-stat-card__label">Total Rooms</span>
                </div>
                <div className="bd-stat-card bd-stat-card--green">
                  <div className="bd-stat-card__icon"><i className="bi bi-check2-circle" /></div>
                  <span className="bd-stat-card__value">{boarding.availableRooms}</span>
                  <span className="bd-stat-card__label">Available</span>
                </div>
                <div className="bd-stat-card bd-stat-card--blue">
                  <div className="bd-stat-card__icon"><i className="bi bi-people" /></div>
                  <span className="bd-stat-card__value">{boarding.maxOccupantsPerRoom}</span>
                  <span className="bd-stat-card__label">Per Room Max</span>
                </div>
                <div className="bd-stat-card bd-stat-card--orange">
                  <div className="bd-stat-card__icon"><i className="bi bi-gender-ambiguous" /></div>
                  <span className="bd-stat-card__value bd-stat-card__value--sm">{boarding.genderPreference}</span>
                  <span className="bd-stat-card__label">Allowed</span>
                </div>
              </div>

              <div className="bd-amenities-header">
                <i className="bi bi-stars" />
                Amenities &amp; Features
              </div>
              <div className="bd-amenities-grid">
                {[
                  { key: 'attachedBathroom',   label: 'Attached Bathroom',   icon: 'bi-droplet-half' },
                  { key: 'furnished',           label: 'Fully Furnished',      icon: 'bi-lamp' },
                  { key: 'wifi',                label: 'WiFi Access',          icon: 'bi-wifi' },
                  { key: 'parking',             label: 'Parking Space',        icon: 'bi-car-front' },
                  { key: 'kitchen',             label: 'Kitchen Access',       icon: 'bi-cup-hot' },
                  { key: 'laundry',             label: 'Laundry Facility',     icon: 'bi-wind' },
                  { key: 'waterIncluded',       label: 'Water Included',       icon: 'bi-water' },
                  { key: 'electricityIncluded', label: 'Electricity Included', icon: 'bi-lightning' },
                  { key: 'smokingAllowed',      label: 'Smoking Allowed',      icon: 'bi-fire' },
                  { key: 'petsAllowed',         label: 'Pets Allowed',         icon: 'bi-bug' },
                ].map((amenity) => (
                  <div
                    key={amenity.key}
                    className={`bd-amenity-chip ${boarding[amenity.key] ? 'bd-amenity-chip--on' : 'bd-amenity-chip--off'}`}
                  >
                    <span className="bd-amenity-chip__icon">
                      <i className={`bi ${amenity.icon}`} />
                    </span>
                    <span className="bd-amenity-chip__label">{amenity.label}</span>
                    {boarding[amenity.key]
                      ? <span className="bd-amenity-chip__check"><i className="bi bi-check-lg" /></span>
                      : <span className="bd-amenity-chip__x"><i className="bi bi-x-lg" /></span>
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <ReviewList boardingId={boarding._id} boardingEmail={boarding.email} />
          </div>

          {/* Sidebar */}
          <div className="col-12 col-lg-10">
            <div className="boarding-details__side row g-4 mt-2">

              {/* Contact Card */}
              <div className="col-12 col-md-6">
                <div className="contact-card-modern h-100 mb-4 boarding-details__contact-card">
                  <div className="contact-hero-modern bg-primary text-white position-relative boarding-details__contact-hero">
                    <div className="position-absolute w-100 h-100 top-0 start-0 opacity-10 bg-white" style={{ background: 'radial-gradient(circle, transparent 20%, #fff 20%, #fff 80%, transparent 80%, transparent) 0% 0% / 20px 20px' }}></div>
                    <div className="position-relative z-1">
                      <h4 className="fw-bolder mb-1">Contact Owner</h4>
                      <p className="mb-0 text-white-50">Reach out for inquiries or bookings</p>
                    </div>
                  </div>
                  <div className="px-4 pb-4 bg-white">
                    <div className="contact-avatar-wrapper">
                      <div className="bg-light text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                        <i className="bi bi-person-fill fs-1"></i>
                      </div>
                      <h4 className="fw-bold text-dark mb-1">{boarding.ownerName}</h4>
                      <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1">Verified Host</span>
                    </div>
                    <div className="d-flex flex-column gap-3">
                      <a href={`tel:${boarding.contactNumber}`} className="contact-action-btn btn-call">
                        <i className="bi bi-telephone-fill fs-5"></i>
                        {boarding.contactNumber}
                      </a>
                      <a href={`mailto:${boarding.email}?subject=Inquiry about ${boarding.title}`} className="contact-action-btn btn-email">
                        <i className="bi bi-envelope-fill fs-5"></i>
                        Send an Email
                      </a>
                    </div>
                    <div className="mt-4 p-3 bg-light rounded-3 d-flex gap-3 text-secondary small align-items-start border">
                      <i className="bi bi-shield-check text-success fs-4"></i>
                      <p className="mb-0">Never transfer money before viewing the property physically. Safety first!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map / Location Card */}
              <div className="col-12 col-md-6">
                <div className="bd-location-card h-100">

                  {/* Card header */}
                  <div className="bd-location-card__header">
                    <div className="bd-location-card__header-icon">
                      <i className="bi bi-map-fill" />
                    </div>
                    <div>
                      <h6 className="bd-location-card__header-title">Location View</h6>
                      <p className="bd-location-card__header-sub">Property address &amp; area</p>
                    </div>
                  </div>

                  {/* Decorative map area */}
                  <div className="bd-map-visual">
                    {/* Grid lines */}
                    <div className="bd-map-visual__grid" />

                    {/* Roads */}
                    <div className="bd-map-visual__road bd-map-visual__road--h" style={{ top: '38%' }} />
                    <div className="bd-map-visual__road bd-map-visual__road--h" style={{ top: '62%' }} />
                    <div className="bd-map-visual__road bd-map-visual__road--v" style={{ left: '35%' }} />
                    <div className="bd-map-visual__road bd-map-visual__road--v" style={{ left: '65%' }} />

                    {/* Decorative blocks */}
                    <div className="bd-map-visual__block" style={{ top: '18%', left: '10%',  width: '18%', height: '16%' }} />
                    <div className="bd-map-visual__block" style={{ top: '18%', left: '40%',  width: '20%', height: '16%' }} />
                    <div className="bd-map-visual__block" style={{ top: '18%', left: '70%',  width: '18%', height: '16%' }} />
                    <div className="bd-map-visual__block" style={{ top: '68%', left: '10%',  width: '18%', height: '16%' }} />
                    <div className="bd-map-visual__block" style={{ top: '68%', left: '40%',  width: '20%', height: '16%' }} />
                    <div className="bd-map-visual__block" style={{ top: '68%', left: '70%',  width: '18%', height: '16%' }} />

                    {/* Pin */}
                    <div className="bd-map-pin">
                      <div className="bd-map-pin__icon">
                        <i className="bi bi-geo-alt-fill" />
                      </div>
                      <div className="bd-map-pin__pulse" />
                      <div className="bd-map-pin__shadow" />
                    </div>

                    {/* Location label on map */}
                    <div className="bd-map-label">
                      <i className="bi bi-buildings-fill" />
                      {boarding.city}
                    </div>
                  </div>

                  {/* Address details */}
                  <div className="bd-location-card__details">
                    <div className="bd-location-detail-row">
                      <span className="bd-location-detail-row__icon bd-location-detail-row__icon--red">
                        <i className="bi bi-geo-alt-fill" />
                      </span>
                      <div>
                        <p className="bd-location-detail-row__label">Full Address</p>
                        <p className="bd-location-detail-row__value">{boarding.address}</p>
                      </div>
                    </div>
                    <div className="bd-location-detail-row">
                      <span className="bd-location-detail-row__icon bd-location-detail-row__icon--blue">
                        <i className="bi bi-building" />
                      </span>
                      <div>
                        <p className="bd-location-detail-row__label">City / District</p>
                        <p className="bd-location-detail-row__value">{boarding.city}, {boarding.district}</p>
                      </div>
                    </div>

                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(`${boarding.address}, ${boarding.city}, ${boarding.district}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bd-open-maps-btn"
                    >
                      <i className="bi bi-map-fill" />
                      Open in Google Maps
                      <i className="bi bi-arrow-up-right-square" />
                    </a>
                  </div>

                </div>
              </div>


            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BoardingDetails;
