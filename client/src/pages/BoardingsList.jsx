import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BoardingCard from '../components/BoardingCard';
import Navbar from '../components/Navbar';
import './BoardingsList.css';

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
    <div className="boarding-page-bg font-sans d-flex flex-column" style={{ fontFamily: "'Inter', sans-serif", paddingTop: '80px' }}>
      <Navbar />

      {/* Modern Hero Section */}
      <section className="boardings-hero-modern">
        {/* Animated Background Elements */}
        <div className="hero-shape hero-shape-1"></div>
        <div className="hero-shape hero-shape-2"></div>
        <div className="hero-shape hero-shape-3"></div>
        
        <div className="container text-center position-relative" style={{ zIndex: 1 }}>
          <h1 className="hero-title-modern">
            Discover Your <span className="highlight-text">Perfect Student Home</span>
          </h1>
          <p className="hero-subtitle-modern mt-3 mb-3">
            Explore thousands of verified boarding places, apartments, and rooms near your university.
          </p>

          {/* Stat pills */}
          <div className="hero-stats">
            <span className="hero-stat-pill"><i className="bi bi-houses-fill" /> Verified Listings</span>
            <span className="hero-stat-pill"><i className="bi bi-shield-check-fill" /> Safe &amp; Trusted</span>
            <span className="hero-stat-pill"><i className="bi bi-lightning-charge-fill" /> Instant Search</span>
          </div>

           {/* Search Bar inside Hero */}
           <div className="row justify-content-center w-100 mt-5 mx-0">
             <div className="col-12 col-xl-8">
               <div className="input-group input-group-lg boarding-search-bar bg-white overflow-hidden shadow-lg">
                 <span className="input-group-text bg-transparent border-0 text-secondary ps-4">
                   <i className="bi bi-search"></i>
                 </span>
                 <input 
                   type="text" 
                   placeholder="Search by city, district, or address..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="form-control border-0 bg-transparent py-4 px-3 shadow-none boarding-search-input"
                   style={{ fontSize: '1.15rem' }}
                 />
                 <button 
                   onClick={() => setIsMobileFiltersOpen(true)}
                   className="btn btn-light d-lg-none border-start border-0 px-4"
                   aria-label="Open Filters"
                 >
                   <i className="bi bi-sliders fs-5"></i>
                 </button>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* Main Content Area */}
        <div className="container py-5 flex-grow-1">
        <div className="boardings-layout">
          {/* Sidebar Filters */}
          <aside
            className={`boardings-sidebar ${isMobileFiltersOpen ? 'open' : ''}`}
          >
            
            <div className="card h-100 glass-filter-card d-flex flex-column" style={isMobileFiltersOpen ? { borderRadius: '0 !important', padding: '2rem 1.5rem' } : { padding: '2rem 1.5rem' }}>
              
              <div className="bl-filter-header">
                <div className="bl-filter-header__icon"><i className="bi bi-funnel-fill" /></div>
                <h5 className="bl-filter-header__title">Filters</h5>
                {isMobileFiltersOpen && (
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="btn btn-sm btn-link text-secondary p-0 ms-auto">
                    <i className="bi bi-x-lg fs-5"></i>
                  </button>
                )}
              </div>

              <div className="d-flex flex-column gap-5">
                {/* Property Type */}
                <div>
                  <h6 className="filter-heading">Property Type</h6>
                  <div className="d-flex flex-column gap-2">
                    {['All', 'Room', 'House', 'Apartment'].map(type => (
                      <div key={type} className="form-check d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="propertyType"
                          id={`type-${type}`}
                          value={type}
                          checked={propertyType === type}
                          onChange={(e) => setPropertyType(e.target.value)}
                          className="form-check-input filter-radio"
                        />
                        <label className="filter-label" htmlFor={`type-${type}`}>{type}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="border-top pt-4">
                  <h6 className="filter-heading">Max Price (LKR)</h6>
                  <div className="bl-price-input-group">
                    <span className="bl-price-input-group__prefix">Rs</span>
                    <input
                      type="number"
                      placeholder="Any price"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div className="border-top pt-4">
                  <h6 className="filter-heading">Must Include</h6>
                  <div className="d-flex flex-column gap-2">
                    <div className="form-check d-flex align-items-center gap-2">
                      <input type="checkbox" id="wifi" name="wifi" checked={amenities.wifi} onChange={handleAmenityChange} className="form-check-input filter-checkbox m-0" />
                      <label className="filter-label" htmlFor="wifi">WiFi access</label>
                    </div>
                    <div className="form-check d-flex align-items-center gap-2">
                      <input type="checkbox" id="bath" name="attachedBathroom" checked={amenities.attachedBathroom} onChange={handleAmenityChange} className="form-check-input filter-checkbox m-0" />
                      <label className="filter-label" htmlFor="bath">Attached Bathroom</label>
                    </div>
                    <div className="form-check d-flex align-items-center gap-2">
                      <input type="checkbox" id="park" name="parking" checked={amenities.parking} onChange={handleAmenityChange} className="form-check-input filter-checkbox m-0" />
                      <label className="filter-label" htmlFor="park">Parking Space</label>
                    </div>
                    <div className="form-check d-flex align-items-center gap-2">
                      <input type="checkbox" id="furnish" name="furnished" checked={amenities.furnished} onChange={handleAmenityChange} className="form-check-input filter-checkbox m-0" />
                      <label className="filter-label" htmlFor="furnish">Fully Furnished</label>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="border-top pt-4 mt-auto">
                   <button 
                    onClick={clearFilters}
                    className="btn w-100 py-2 text-secondary fw-semibold clear-filter-btn"
                  >
                    Clear all filters
                  </button>
                </div>

              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <main className="boardings-results">
            <div className="bl-results-header">
              <div className="bl-count-pill">
                <i className="bi bi-grid-3x3-gap-fill" />
                <span className="bl-count-pill__num">{filteredBoardings.length}</span>
                {filteredBoardings.length === 1 ? 'place' : 'places'} found
              </div>
            </div>
            
            {loading ? (
               <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '300px' }}>
                  <div className="spinner-border text-primary border-4" style={{ width: '3rem', height: '3rem' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-secondary fw-medium mt-4">Loading amazing places...</p>
               </div>
            ) : filteredBoardings.length > 0 ? (
            <div className="boardings-grid">
                {filteredBoardings.map(boarding => (
                  <div key={boarding._id || boarding.id || Math.random()} className="boarding-grid-item">
                      <BoardingCard boarding={boarding} />
                  </div>
                ))}
              </div>
            ) : (
               <div className="card no-results-card p-5 text-center w-100">
                  <div className="card-body py-5">
                    <i className="bi bi-geo-alt display-2 text-light mb-4 shadow-sm rounded-circle d-inline-block p-4 bg-primary text-white" style={{ background: 'linear-gradient(135deg, var(--bs-primary), #3f2a8c)' }}></i>
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
