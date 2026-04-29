import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BoardingCard from '../components/BoardingCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './BoardingsList.css';

const SkeletonCard = () => (
  <div className="bc-card is-skeleton">
    <div className="bc-img-wrap"></div>
    <div className="bc-body">
      <div className="bc-title mb-2"></div>
      <div className="bc-location"></div>
      <div className="bc-amenities mt-3">
        <div className="bc-amenity"></div>
        <div className="bc-amenity"></div>
        <div className="bc-amenity"></div>
      </div>
      <div className="bc-footer mt-auto">
        <div className="bc-price__amount"></div>
      </div>
    </div>
  </div>
);

const BoardingsList = () => {
  const navigate = useNavigate();
  const [boardings, setBoardings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);
  
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
  const [selectedToCompare, setSelectedToCompare] = useState([]); // Array of boarding objects
  const [isComparing, setIsComparing] = useState(false);

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

  const handleCompareToggle = (boarding) => {
    setSelectedToCompare(prev => {
      const isSelected = prev.find(item => (item._id || item.id) === (boarding._id || boarding.id));
      if (isSelected) {
        return prev.filter(item => (item._id || item.id) !== (boarding._id || boarding.id));
      }
      if (prev.length >= 3) return prev; // Limit to 3
      return [...prev, boarding];
    });
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
    <div className="bl-page-wrapper">

      {/* Dynamic Background System */}
      <div className="bg-images bl-bg-images" aria-hidden="true" />
      <div className="bg-overlay" aria-hidden="true" />
      <div className="bg-aurora" aria-hidden="true">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>

      {/* Film grain layer — Layer -1 */}
      <div className="bg-grain" aria-hidden="true" />

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

          <div className="row justify-content-center w-100 mt-5 mx-0">
            <div className="col-12 col-xl-8">
              
              {/* Category Icons (Airbnb Style) */}
              <div className="bl-hero-categories mb-4">
                {[
                  { label: 'All', icon: 'bi-grid-1x2-fill' },
                  { label: 'Room', icon: 'bi-door-open-fill' },
                  { label: 'House', icon: 'bi-house-heart-fill' },
                  { label: 'Apartment', icon: 'bi-building-fill' }
                ].map(cat => (
                  <div 
                    key={cat.label} 
                    className={`bl-hero-cat-item ${propertyType === cat.label ? 'active' : ''}`}
                    onClick={() => setPropertyType(cat.label)}
                  >
                    <i className={`bi ${cat.icon} bl-hero-cat-icon`}></i>
                    <span className="bl-hero-cat-label">{cat.label}</span>
                  </div>
                ))}
              </div>

              {/* Modern Search Bar */}
              <div className="bl-hero-search">
                <div className="bl-hero-search-icon">
                   <i className="bi bi-search"></i>
                </div>
                <input 
                  type="text" 
                  placeholder="Search by city, district, or address..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bl-hero-search-input"
                />
                <button className="bl-hero-search-btn">
                   Search
                </button>
                
                {/* Mobile Toggle */}
                <button 
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="bl-hero-mobile-toggle d-md-none"
                >
                  <i className="bi bi-sliders"></i>
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
        <div className="container py-5 mb-5 flex-grow-1">
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
              
              {user && user.role === 'admin' && (
                <div className="bl-admin-actions">
                  <button 
                    onClick={() => navigate('/dashboard?tab=boardings')} 
                    className="btn btn-premium-add d-flex align-items-center gap-2"
                    style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '50px' }}
                  >
                    <i className="bi bi-shield-lock-fill"></i>
                    Manage Boardings
                  </button>
                </div>
              )}
            </div>
            
            {loading ? (
             <div className="boardings-grid">
               {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
             </div>
            ) : filteredBoardings.length > 0 ? (
            <div className="boardings-grid">
                {filteredBoardings.map(boarding => {
                  const isSelected = selectedToCompare.some(item => (item._id || item.id) === (boarding._id || boarding.id));
                  return (
                    <div key={boarding._id || boarding.id || Math.random()} className="boarding-grid-item">
                        <BoardingCard 
                          boarding={boarding} 
                          onCompareToggle={() => handleCompareToggle(boarding)}
                          isSelected={isSelected}
                        />
                    </div>
                  );
                })}
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

      {/* ── Comparison Floating Bar ── */}
      {selectedToCompare.length > 0 && (
        <div className="bl-compare-bar animate__animated animate__slideInUp">
          <div className="container d-flex align-items-center justify-content-between">
            <div className="bl-compare-items d-flex gap-3">
              {selectedToCompare.map(item => (
                <div key={item._id || item.id} className="bl-compare-item-chip">
                  <img src={item.imageUrls?.[0] || 'https://images.unsplash.com/photo-1522771731470-ea44358153a5?q=80&w=2070&auto=format&fit=crop'} alt={item.title} />
                  <span>{item.title}</span>
                  <button onClick={() => handleCompareToggle(item)}><i className="bi bi-x" /></button>
                </div>
              ))}
              {selectedToCompare.length < 3 && (
                <div className="bl-compare-placeholder">
                  Add {3 - selectedToCompare.length} more to compare
                </div>
              )}
            </div>
            <div className="bl-compare-actions d-flex gap-2">
              <button 
                className="btn-clear-compare"
                onClick={() => setSelectedToCompare([])}
              >
                Clear All
              </button>
              <button 
                className="btn-compare-trigger"
                disabled={selectedToCompare.length < 2}
                onClick={() => setIsComparing(true)}
              >
                Compare Now ({selectedToCompare.length}/3)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Comparison Modal ── */}
      {isComparing && (
        <div className="bl-compare-modal-overlay">
          <div className="bl-compare-modal-content scale-in-center">
            <div className="bl-compare-modal-header">
              <h3 className="mb-0">Compare Listings</h3>
              <button className="close-btn" onClick={() => setIsComparing(false)}><i className="bi bi-x-lg" /></button>
            </div>
            <div className="bl-compare-modal-body table-responsive">
              <table className="table bl-compare-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: '150px' }}>Features</th>
                    {selectedToCompare.map(item => (
                      <th key={item._id || item.id} style={{ minWidth: '220px' }}>
                        <div className="compare-th-card">
                          <img src={item.imageUrls?.[0] || 'https://images.unsplash.com/photo-1522771731470-ea44358153a5?q=80&w=2070&auto=format&fit=crop'} alt={item.title} />
                          <h6>{item.title}</h6>
                          <div className="compare-price">Rs.{item.price.toLocaleString()}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Property Type</strong></td>
                    {selectedToCompare.map((item, idx) => <td key={item._id || idx}>{item.propertyType}</td>)}
                  </tr>
                  <tr>
                    <td><strong>Location</strong></td>
                    {selectedToCompare.map((item, idx) => <td key={item._id || idx}>{item.city}, {item.district}</td>)}
                  </tr>
                  <tr>
                    <td><strong>Amenities</strong></td>
                    {selectedToCompare.map((item, idx) => (
                      <td key={item._id || idx}>
                        <div className="compare-amenities-list">
                          {item.wifi && <span><i className="bi bi-wifi" /> WiFi</span>}
                          {item.parking && <span><i className="bi bi-car-front" /> Parking</span>}
                          {item.attachedBathroom && <span><i className="bi bi-droplet" /> Bath</span>}
                          {item.furnished && <span><i className="bi bi-lamp" /> Furnished</span>}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Gender Preference</strong></td>
                    {selectedToCompare.map((item, idx) => <td key={item._id || idx}>{item.genderPreference || 'Any'}</td>)}
                  </tr>
                  <tr>
                    <td>Action</td>
                    {selectedToCompare.map((item, idx) => (
                      <td key={item._id || idx}>
                        <a href={`/boarding/${item._id || item.id}`} className="btn-view-compare">View Listing</a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default BoardingsList;
