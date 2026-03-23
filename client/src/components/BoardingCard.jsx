import React from 'react';

const BoardingCard = ({ boarding }) => {
  // Determine the display image
  const displayImage = boarding.imageUrls && boarding.imageUrls.length > 0 
    ? boarding.imageUrls[0] 
    : 'https://images.unsplash.com/photo-1522771731470-ea44358153a5?q=80&w=2070&auto=format&fit=crop'; // fallback image

  return (
    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden" style={{ transition: 'transform 0.3s, box-shadow 0.3s' }} onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.classList.add('shadow');}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'none'; e.currentTarget.classList.remove('shadow');}}>
      
      {/* Image Container */}
      <div className="position-relative bg-light" style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
        <img 
          src={displayImage} 
          alt={boarding.title} 
          className="w-100 h-100 object-fit-cover"
          style={{ transition: 'transform 0.5s ease-in-out' }}
        />
        {/* Status Badge */}
        <div className={`position-absolute top-0 end-0 m-3 badge rounded-pill fw-semibold shadow-sm px-3 py-2 ${
          boarding.availabilityStatus === 'Available' ? 'bg-success bg-opacity-75 text-white' : 
          boarding.availabilityStatus === 'Full' ? 'bg-danger bg-opacity-75 text-white' : 
          'bg-warning bg-opacity-75 text-dark'
        }`} style={{ backdropFilter: 'blur(5px)' }}>
          {boarding.availabilityStatus}
        </div>
        
        {/* Type Badge */}
        <div className="position-absolute top-0 start-0 m-3 badge bg-white bg-opacity-75 text-dark rounded-pill shadow-sm px-3 py-2 fw-bold" style={{ backdropFilter: 'blur(5px)' }}>
          {boarding.propertyType}
        </div>
      </div>

      {/* Content */}
      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title fw-bolder text-dark text-truncate mb-0" title={boarding.title}>
            {boarding.title}
          </h5>
        </div>

        <div className="d-flex align-items-center text-secondary small mb-3">
          <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
          <span className="text-truncate">
            {boarding.city}, {boarding.district}
          </span>
        </div>

        <div className="mt-auto">
          {/* Amenities Row */}
          <div className="d-flex flex-wrap gap-2 mb-4 pt-3 border-top">
            {boarding.wifi && (
              <span className="badge bg-light text-secondary border px-2 py-1 rounded-2" title="WiFi Included">
                <i className="bi bi-wifi me-1 text-primary"></i> WiFi
              </span>
            )}
            {boarding.parking && (
              <span className="badge bg-light text-secondary border px-2 py-1 rounded-2" title="Parking Available">
                <i className="bi bi-car-front-fill me-1 text-primary"></i> Parking
              </span>
            )}
            {boarding.attachedBathroom && (
              <span className="badge bg-light text-secondary border px-2 py-1 rounded-2" title="Attached Bathroom">
                <i className="bi bi-droplet-half me-1 text-primary"></i> Bath
              </span>
            )}
            {boarding.kitchen && (
              <span className="badge bg-light text-secondary border px-2 py-1 rounded-2" title="Kitchen Access">
                <i className="bi bi-cup-hot-fill me-1 text-primary"></i> Kitchen
              </span>
            )}
          </div>

          {/* Price & Action */}
          <div className="d-flex align-items-end justify-content-between pt-1">
            <div>
              <p className="text-secondary small fw-medium mb-1">Price / month</p>
              <div className="d-flex align-items-baseline text-primary">
                <span className="fs-6 fw-bold me-1">{boarding.currency === 'LKR' ? '₨' : boarding.currency}</span>
                <span className="fs-4 fw-bolder">{boarding.price.toLocaleString()}</span>
              </div>
            </div>
            <button className="btn btn-light text-primary bg-primary-subtle rounded-3 p-2" style={{ transition: 'all 0.2s' }} onMouseEnter={(e) => {e.currentTarget.classList.add('bg-primary', 'text-white')}} onMouseLeave={(e) => {e.currentTarget.classList.remove('bg-primary', 'text-white')}}>
              <i className="bi bi-arrow-right-short fs-4 lh-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardingCard;
