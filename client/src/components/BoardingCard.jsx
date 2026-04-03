import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BoardingCard.css';

const BoardingCard = ({ boarding }) => {
  const [ratingData, setRatingData] = useState({ average: 0, count: 0 });

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const id = boarding._id || boarding.id;
        if (!id) return;
        const response = await axios.get(`http://localhost:5000/api/reviews/boarding/${id}`);
        if (response.data && response.data.success && response.data.data.length > 0) {
          const reviews = response.data.data;
          const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
          setRatingData({ average: sum / reviews.length, count: reviews.length });
        }
      } catch (error) {
        console.error("Error fetching rating", error);
      }
    };
    fetchRating();
  }, [boarding]);

  const navigate = useNavigate();

  // Determine the display image
  const displayImage = boarding.imageUrls && boarding.imageUrls.length > 0 
    ? boarding.imageUrls[0] 
    : 'https://images.unsplash.com/photo-1522771731470-ea44358153a5?q=80&w=2070&auto=format&fit=crop'; // fallback image

  return (
    <div className="boarding-card-modern d-flex flex-column h-100">
      
      {/* Image Container */}
      <div 
        className="boarding-card-img-wrapper cursor-pointer" 
        style={{ aspectRatio: '5/4' }}
        onClick={() => navigate(`/boarding/${boarding._id || boarding.id}`)}
      >
        <img 
          src={displayImage} 
          alt={boarding.title} 
          className="w-100 h-100 object-fit-cover boarding-place-card__img"
          style={{ transition: 'transform 0.5s ease-in-out' }}
        />
        {/* Status Badge */}
        <div className={`position-absolute top-0 end-0 m-3 badge rounded-pill px-3 py-2 ${
          boarding.availabilityStatus === 'Available' ? 'bg-success text-white' : 
          boarding.availabilityStatus === 'Full' ? 'bg-danger text-white' : 
          'bg-warning text-dark'
        } boarding-status-glass`}>
          {boarding.availabilityStatus}
        </div>
        
        {/* Type Badge */}
        <div className="position-absolute top-0 start-0 m-3 badge rounded-pill px-3 py-2 boarding-badge-glass">
          {boarding.propertyType}
        </div>
      </div>

      {/* Content */}
      <div className="card-body d-flex flex-column p-4">
        <h5 className="boarding-place-card__title card-title fw-bolder text-dark text-truncate mb-1" title={boarding.title}>
          {boarding.title}
        </h5>
        
        <div className="d-flex align-items-center mb-2">
          {ratingData.count > 0 ? (
            <>
              <div className="text-warning me-1 small">
                <i className="bi bi-star-fill"></i>
              </div>
              <span className="fw-bold me-1 text-dark small">{ratingData.average.toFixed(1)}</span>
              <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>({ratingData.count})</span>
            </>
          ) : (
            <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>No reviews yet</span>
          )}
        </div>

        <div className="d-flex align-items-center text-secondary small mb-3">
          <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
          <span className="text-truncate">
            {boarding.city}, {boarding.district}
          </span>
        </div>

        <div className="mt-auto">
          {/* Amenities Row */}
          <div className="boarding-place-card__amenities d-flex flex-wrap gap-2 mb-4 pt-3 border-top">
            {boarding.wifi && (
              <span className="amenity-chip" title="WiFi Included">
                <i className="bi bi-wifi me-1 text-primary"></i> WiFi
              </span>
            )}
            {boarding.parking && (
              <span className="amenity-chip" title="Parking Available">
                <i className="bi bi-car-front-fill me-1 text-primary"></i> Parking
              </span>
            )}
            {boarding.attachedBathroom && (
              <span className="amenity-chip" title="Attached Bathroom">
                <i className="bi bi-droplet-half me-1 text-primary"></i> Bath
              </span>
            )}
            {boarding.kitchen && (
              <span className="amenity-chip" title="Kitchen Access">
                <i className="bi bi-cup-hot-fill me-1 text-primary"></i> Kitchen
              </span>
            )}
          </div>

          {/* Price & Action */}
          <div className="d-flex align-items-end justify-content-between pt-1">
            <div>
              <p className="boarding-place-card__price-label text-secondary small fw-medium mb-1">Price / month</p>
              <div className="d-flex align-items-baseline text-primary">
                <span className="fs-6 fw-bold me-1">{boarding.currency === 'LKR' ? '₨' : boarding.currency}</span>
                <span className="fs-4 fw-bolder">{boarding.price.toLocaleString()}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/boarding/${boarding._id || boarding.id}`)}
              className="boarding-cta-btn border-0" 
            >
              <i className="bi bi-arrow-right-short fs-4 lh-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardingCard;
