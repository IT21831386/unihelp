import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
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

  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
        <div className="spinner-border text-primary border-4" style={{ width: '4rem', height: '4rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="mt-4 text-secondary">Loading Property Details...</h4>
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
    <div className="boarding-details-bg pb-5 boarding-details" style={{ fontFamily: "'Inter', sans-serif", paddingTop: '80px' }}>
      <Navbar />
      <Toaster position="top-center" />
      
      {/* Navigation Header */}
      <div className="bg-white border-bottom sticky-top shadow-sm z-3">
        <div className="container py-3">
          <Link to="/boarding" className="text-decoration-none text-secondary d-inline-flex align-items-center fw-medium hover-primary" style={{ transition: 'color 0.2s' }}>
            <i className="bi bi-arrow-left me-2 fs-5"></i> Back to all places
          </Link>
        </div>
      </div>

      <div className="container mt-4 mt-lg-5 boarding-details__container">
        
        {/* Header Title Section */}
        <div className="details-header-card d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3 boarding-details__header">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className={`badge rounded-pill fw-bold px-3 py-2 ${
                boarding.availabilityStatus === 'Available' ? 'bg-success bg-opacity-10 text-success border border-success' : 
                boarding.availabilityStatus === 'Full' ? 'bg-danger bg-opacity-10 text-danger border border-danger' : 
                'bg-warning bg-opacity-10 text-warning-emphasis border border-warning'
              } boarding-details__status-badge`}>
                {boarding.availabilityStatus}
              </span>
              <span className="badge bg-light text-dark border rounded-pill px-3 py-2 fw-medium boarding-details__type-badge">
                {boarding.propertyType}
              </span>
            </div>
            <h1 className="fw-bolder text-dark mb-2 display-5">{boarding.title}</h1>
            <p className="text-secondary fs-5 mb-0 d-flex align-items-center">
              <i className="bi bi-geo-alt-fill text-primary me-2"></i>
              {boarding.address}, {boarding.city}, {boarding.district}
            </p>
          </div>
          <div className="text-md-end boarding-details__price">
            <p className="text-secondary fw-semibold mb-1 text-uppercase tracking-wider small">Monthly Rent</p>
            <h2 className="text-primary fw-bolder mb-0 display-4">
              <span className="fs-3 align-top me-1">{boarding.currency === 'LKR' ? '₨' : boarding.currency}</span>
              {boarding.price.toLocaleString()}
            </h2>
          </div>
        </div>

        <div className="row g-5 boarding-details__layout">
          {/* Main Content (Images & Details) */}
          <div className="col-12 col-lg-8">
            
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
              
              {/* Thumbnails */}
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

            {/* Description */}
            <div className="details-section-card mb-5 boarding-details__section-card">
              <h4 className="fw-bold text-dark mb-4 border-bottom pb-3"><i className="bi bi-body-text text-primary me-2"></i> About this place</h4>
              <p className="text-secondary lh-lg fs-5 mb-0" style={{ whiteSpace: 'pre-line' }}>{boarding.description}</p>
            </div>

            {/* Property Details Grid */}
            <div className="details-section-card mb-5 boarding-details__section-card">
              <h4 className="fw-bold text-dark mb-4 border-bottom pb-3"><i className="bi bi-house-door text-primary me-2"></i> Property Specifications</h4>
                
                <div className="row g-4 mb-5">
                  <div className="col-6 col-md-3">
                    <div className="spec-card-modern boarding-details__stat">
                      <i className="bi bi-door-open fs-2 text-primary mb-2 d-block"></i>
                      <h3 className="fw-bold text-dark mb-0">{boarding.totalRooms}</h3>
                      <p className="text-secondary small fw-medium mb-0">Total Rooms</p>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="spec-card-modern boarding-details__stat">
                      <i className="bi bi-check2-circle fs-2 text-success mb-2 d-block"></i>
                      <h3 className="fw-bold text-dark mb-0">{boarding.availableRooms}</h3>
                      <p className="text-secondary small fw-medium mb-0">Available</p>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="spec-card-modern boarding-details__stat">
                      <i className="bi bi-people fs-2 text-info mb-2 d-block"></i>
                      <h3 className="fw-bold text-dark mb-0">{boarding.maxOccupantsPerRoom}</h3>
                      <p className="text-secondary small fw-medium mb-0">Per Room Max</p>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="spec-card-modern boarding-details__stat">
                      <i className="bi bi-gender-ambiguous fs-2 text-warning mb-2 d-block"></i>
                      <h5 className="fw-bold text-dark mb-0 mt-2">{boarding.genderPreference}</h5>
                      <p className="text-secondary small fw-medium mb-0">Allowed</p>
                    </div>
                  </div>
                </div>

                <h5 className="fw-bold text-dark mb-4">Amenities & Features</h5>
                <div className="row g-3">
                  {[
                    { key: 'attachedBathroom', label: 'Attached Bathroom', icon: 'bi-droplet-half' },
                    { key: 'furnished', label: 'Fully Furnished', icon: 'bi-lamp' },
                    { key: 'wifi', label: 'WiFi Access', icon: 'bi-wifi' },
                    { key: 'parking', label: 'Parking Space', icon: 'bi-car-front' },
                    { key: 'kitchen', label: 'Kitchen Access', icon: 'bi-cup-hot' },
                    { key: 'laundry', label: 'Laundry Facility', icon: 'bi-wind' },
                    { key: 'waterIncluded', label: 'Water Included', icon: 'bi-water' },
                    { key: 'electricityIncluded', label: 'Electricity Included', icon: 'bi-lightning' },
                    { key: 'smokingAllowed', label: 'Smoking Allowed', icon: 'bi-fire' },
                    { key: 'petsAllowed', label: 'Pets Allowed', icon: 'bi-bug' },
                  ].map((amenity) => (
                    <div key={amenity.key} className="col-sm-6 col-md-4">
                      <div className={`amenity-chip-large boarding-details__amenity ${boarding[amenity.key] ? 'is-on' : 'is-off'}`}>
                        <i className={`bi ${amenity.icon} fs-4 ${boarding[amenity.key] ? 'text-primary' : ''}`}></i>
                        <span className={`${boarding[amenity.key] ? '' : ''}`}>{amenity.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

            </div>

            {/* Reviews Section */}
            <ReviewList boardingId={boarding._id} />
          </div>

          {/* Sidebar (Contact Info & Map Placeholder) */}
          <div className="col-12 col-lg-4">
            <div className="position-sticky boarding-details__side" style={{ top: '100px' }}>
              
              {/* Contact Card */}
              <div className="contact-card-modern mb-4 boarding-details__contact-card">
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

              {/* Map Placeholder */}
              <div className="details-section-card p-4">
                 <h6 className="fw-bold text-dark mb-3"><i className="bi bi-map text-primary me-2"></i> Location View</h6>
                 <div className="bg-light rounded-3 d-flex flex-column align-items-center justify-content-center text-secondary border" style={{ height: '200px' }}>
                    <i className="bi bi-geo text-secondary opacity-50 display-3 mb-2"></i>
                    <span className="fw-medium">{boarding.city}, {boarding.district}</span>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BoardingDetails;
