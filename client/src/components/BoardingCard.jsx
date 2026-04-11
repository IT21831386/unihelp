import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BoardingCard.css';

const BoardingCard = ({ boarding, onCompareToggle, isSelected }) => {
  const [ratingData, setRatingData] = useState({ average: 0, count: 0 });
  const navigate = useNavigate();

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
        console.error('Error fetching rating', error);
      }
    };
    fetchRating();
  }, [boarding]);

  const displayImage =
    boarding.imageUrls && boarding.imageUrls.length > 0
      ? boarding.imageUrls[0]
      : 'https://images.unsplash.com/photo-1522771731470-ea44358153a5?q=80&w=2070&auto=format&fit=crop';

  const statusClass =
    boarding.availabilityStatus === 'Available' ? 'bc-status--available' :
    boarding.availabilityStatus === 'Full'      ? 'bc-status--full' :
                                                   'bc-status--maintenance';

  const amenities = [
    { key: 'wifi',             icon: 'bi-wifi',          label: 'WiFi'    },
    { key: 'parking',          icon: 'bi-car-front-fill', label: 'Parking' },
    { key: 'attachedBathroom', icon: 'bi-droplet-half',   label: 'Bath'    },
    { key: 'kitchen',          icon: 'bi-cup-hot-fill',   label: 'Kitchen' },
    { key: 'furnished',        icon: 'bi-lamp',           label: 'Furnished'},
    { key: 'laundry',          icon: 'bi-wind',           label: 'Laundry' },
  ].filter((a) => boarding[a.key]);

  return (
    <div
      className="bc-card"
      onClick={() => navigate(`/boarding/${boarding._id || boarding.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/boarding/${boarding._id || boarding.id}`)}
    >
      {/* ── Image ── */}
      <div className="bc-img-wrap">
        <img src={displayImage} alt={boarding.title} className="bc-img" />

        {/* Gradient overlay */}
        <div className="bc-img-overlay" />

        {/* Top badges */}
        <div className="bc-badges">
          {/* Verified Badge (Simulated logic or from DB) */}
          {(boarding.isVerified || boarding.userId) && (
            <span className="bc-verified-badge">
              <i className="bi bi-patch-check-fill" /> Verified
            </span>
          )}
          
          {/* Hot Deal Badge (Property-specific thresholds) */}
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

          <span className="bc-type-badge">
            <i className="bi bi-building" /> {boarding.propertyType}
          </span>
          <span className={`bc-status ${statusClass}`}>
            <span className="bc-status__dot" />
            {boarding.availabilityStatus}
          </span>
        </div>

        {/* Compare Checkbox */}
        <div 
          className={`bc-compare-checkbox ${isSelected ? 'is-selected' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onCompareToggle();
          }}
          title="Add to compare"
        >
          <i className={`bi ${isSelected ? 'bi-check-circle-fill' : 'bi-plus-circle'}`} />
          <span>{isSelected ? 'Selected' : 'Compare'}</span>
        </div>

        {/* Rating pill overlaid on image bottom */}
        {ratingData.count > 0 && (
          <div className="bc-rating-pill">
            <i className="bi bi-star-fill" />
            <span>{ratingData.average.toFixed(1)}</span>
            <span className="bc-rating-pill__count">({ratingData.count})</span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="bc-body">
        <h5 className="bc-title" title={boarding.title}>{boarding.title}</h5>

        {ratingData.count === 0 && (
          <p className="bc-no-reviews">
            <i className="bi bi-chat-dots me-1" />No reviews yet
          </p>
        )}

        <div className="bc-location">
          <i className="bi bi-geo-alt-fill" />
          <span>{boarding.city}, {boarding.district}</span>
        </div>

        {/* Amenity chips */}
        {amenities.length > 0 && (
          <div className="bc-amenities">
            {amenities.slice(0, 4).map((a) => (
              <span key={a.key} className="bc-amenity">
                <i className={`bi ${a.icon}`} />
                {a.label}
              </span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="bc-footer">
          <div className="bc-price">
            <span className="bc-price__label">Price / month</span>
            <div className="bc-price__amount">
              <span className="bc-price__currency">
                {boarding.currency === 'LKR' ? 'Rs' : boarding.currency}
              </span>
              <span className="bc-price__value">{boarding.price.toLocaleString()}</span>
            </div>
          </div>
          <button
            className="bc-cta"
            onClick={(e) => { e.stopPropagation(); navigate(`/boarding/${boarding._id || boarding.id}`); }}
            aria-label="View details"
          >
            <i className="bi bi-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardingCard;
