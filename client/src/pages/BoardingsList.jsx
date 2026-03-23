import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BoardingCard from '../components/BoardingCard';

const BoardingsList = () => {
  const [boardings, setBoardings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [propertyType, setPropertyType] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');
  const [amenities, setAmenities] = useState({
    wifi: false,
    attachedBathroom: false,
    parking: false,
    furnished: false,
  });

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetchBoardings();
  }, []);

  const fetchBoardings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/boardings');
      if (response.data && response.data.success) {
        setBoardings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching boardings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAmenityChange = (e) => {
    setAmenities({
      ...amenities,
      [e.target.name]: e.target.checked
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPropertyType('All');
    setMaxPrice('');
    setAmenities({ wifi: false, attachedBathroom: false, parking: false, furnished: false });
  };

  // Filter Logic
  const filteredBoardings = boardings.filter(b => {
    // 1. Search Query (Location, Title, City)
    const matchesSearch = searchQuery === '' || 
      b.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Property Type
    const matchesType = propertyType === 'All' || b.propertyType === propertyType;
    
    // 3. Max Price
    const matchesPrice = maxPrice === '' || b.price <= Number(maxPrice);
    
    // 4. Amenities
    const matchesWifi = !amenities.wifi || b.wifi;
    const matchesBathroom = !amenities.attachedBathroom || b.attachedBathroom;
    const matchesParking = !amenities.parking || b.parking;
    const matchesFurnished = !amenities.furnished || b.furnished;

    return matchesSearch && matchesType && matchesPrice && matchesWifi && matchesBathroom && matchesParking && matchesFurnished;
  });

  return (
    <div className="bg-light min-vh-100 font-sans d-flex flex-column" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Search Header */}
      <div className="bg-white border-bottom sticky-top shadow-sm z-3">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-8">
              <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border">
                <span className="input-group-text bg-white border-0 text-secondary ps-4">
                  <i className="bi bi-search"></i>
                </span>
                <input 
                  type="text" 
                  placeholder="Search by city, district, or address..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control border-0 bg-white py-3 px-3 shadow-none"
                />
                <button 
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="btn btn-light d-lg-none border-start border-0 px-4"
                  aria-label="Open Filters"
                >
                  <i className="bi bi-sliders"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container py-5 flex-grow-1">
        <div className="row g-5">
          
          {/* Sidebar Filters (Desktop) */}
          <aside className={`col-lg-3 ${isMobileFiltersOpen ? 'd-block position-fixed top-0 start-0 h-100 bg-white z-3 shadow-lg overflow-auto' : 'd-none d-lg-block'}`} style={isMobileFiltersOpen ? { width: '320px', zIndex: 1050 } : {}}>
            
            <div className="card border-0 rounded-4 shadow-sm h-100 bg-white d-flex flex-column" style={isMobileFiltersOpen ? { borderRadius: '0 !important', padding: '2rem 1.5rem', boxShadow: 'none' } : { padding: '2rem 1.5rem' }}>
              
              <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                <div className="d-flex align-items-center gap-2 text-dark fs-5 fw-bold">
                  <i className="bi bi-funnel-fill text-primary"></i>
                  Filters
                </div>
                {isMobileFiltersOpen && (
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="btn btn-sm btn-link text-secondary p-0">
                    <i className="bi bi-x-lg fs-5"></i>
                  </button>
                )}
              </div>

              <div className="d-flex flex-column gap-5">
                {/* Property Type */}
                <div>
                  <h6 className="text-secondary small fw-bold text-uppercase tracking-wider mb-3">Property Type</h6>
                  <div className="d-flex flex-column gap-2">
                    {['All', 'Room', 'House', 'Apartment'].map(type => (
                      <div key={type} className="form-check">
                        <input 
                          type="radio" 
                          name="propertyType" 
                          id={`type-${type}`}
                          value={type}
                          checked={propertyType === type}
                          onChange={(e) => setPropertyType(e.target.value)}
                          className="form-check-input border-secondary-subtle focus-ring focus-ring-primary"
                        />
                        <label className="form-check-label text-dark fw-medium" htmlFor={`type-${type}`}>
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="border-top pt-4">
                  <h6 className="text-secondary small fw-bold text-uppercase tracking-wider mb-3">Max Price (LKR)</h6>
                   <div className="input-group">
                    <span className="input-group-text bg-light text-secondary border-end-0">₨</span>
                    <input 
                      type="number" 
                      placeholder="Any price" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="form-control bg-light border-start-0 ps-0 shadow-none"
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div className="border-top pt-4">
                  <h6 className="text-secondary small fw-bold text-uppercase tracking-wider mb-3">Must Include</h6>
                  <div className="d-flex flex-column gap-2">
                    <div className="form-check">
                      <input type="checkbox" id="wifi" name="wifi" checked={amenities.wifi} onChange={handleAmenityChange} className="form-check-input border-secondary-subtle" />
                      <label className="form-check-label text-dark fw-medium" htmlFor="wifi">WiFi access</label>
                    </div>
                    <div className="form-check">
                      <input type="checkbox" id="bath" name="attachedBathroom" checked={amenities.attachedBathroom} onChange={handleAmenityChange} className="form-check-input border-secondary-subtle" />
                      <label className="form-check-label text-dark fw-medium" htmlFor="bath">Attached Bathroom</label>
                    </div>
                    <div className="form-check">
                      <input type="checkbox" id="park" name="parking" checked={amenities.parking} onChange={handleAmenityChange} className="form-check-input border-secondary-subtle" />
                      <label className="form-check-label text-dark fw-medium" htmlFor="park">Parking Space</label>
                    </div>
                    <div className="form-check">
                      <input type="checkbox" id="furnish" name="furnished" checked={amenities.furnished} onChange={handleAmenityChange} className="form-check-input border-secondary-subtle" />
                      <label className="form-check-label text-dark fw-medium" htmlFor="furnish">Fully Furnished</label>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="border-top pt-4 mt-auto">
                   <button 
                    onClick={clearFilters}
                    className="btn btn-light w-100 py-2 text-secondary fw-semibold border"
                  >
                    Clear all filters
                  </button>
                </div>

              </div>
            </div>
          </aside>

          {/* Mobile filter backdrop */}
          {isMobileFiltersOpen && (
            <div 
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 z-2"
              style={{ backdropFilter: 'blur(3px)' }}
              onClick={() => setIsMobileFiltersOpen(false)}
            ></div>
          )}

          {/* Results Grid */}
          <main className="col-12 col-lg-9">
            <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
              <h3 className="fw-bolder text-dark mb-0">
                {filteredBoardings.length} {filteredBoardings.length === 1 ? 'place' : 'places'} found
              </h3>
            </div>
            
            {loading ? (
               <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '300px' }}>
                  <div className="spinner-border text-primary border-4" style={{ width: '3rem', height: '3rem' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-secondary fw-medium mt-4">Loading amazing places...</p>
               </div>
            ) : filteredBoardings.length > 0 ? (
              <div className="row g-4">
                {filteredBoardings.map(boarding => (
                  <div key={boarding._id || boarding.id || Math.random()} className="col-12 col-md-6 col-xl-4">
                      <BoardingCard boarding={boarding} />
                  </div>
                ))}
              </div>
            ) : (
               <div className="card border-0 rounded-4 p-5 text-center bg-white shadow-sm w-100" style={{ borderStyle: 'dashed !important', borderWidth: '2px !important', borderColor: '#dee2e6 !important' }}>
                  <div className="card-body py-5">
                    <i className="bi bi-geo-alt display-2 text-light mb-4 shadow-sm rounded-circle d-inline-block p-4 bg-primary text-white"></i>
                    <h3 className="fw-bold text-dark mb-3">No places found</h3>
                    <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '400px' }}>We couldn't find any boarding places matching your exact search and filters.</p>
                    <button 
                      onClick={clearFilters}
                      className="btn btn-primary px-5 py-2 rounded-pill fw-bold shadow-sm"
                    >
                      Clear filters and try again
                    </button>
                  </div>
               </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BoardingsList;
