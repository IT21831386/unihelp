import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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

  // View Mode: 'grid' | 'map'
  const [viewMode, setViewMode] = useState('grid');
  const [selectedMapBoarding, setSelectedMapBoarding] = useState(null);

  // Wishlist / Saved Favorites
  const [savedFavorites, setSavedFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('unihelp_saved_boardings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState('recommended');

  // Filter States
  const [propertyType, setPropertyType] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');
  const [onlyHotDeals, setOnlyHotDeals] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [genderFilter, setGenderFilter] = useState('All');
  const [billsIncludedFilter, setBillsIncludedFilter] = useState(false);

  const [amenities, setAmenities] = useState({
    wifi: false,
    attachedBathroom: false,
    parking: false,
    furnished: false,
  });

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedToCompare, setSelectedToCompare] = useState([]);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

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

  const toggleFavorite = (boardingId) => {
    setSavedFavorites(prev => {
      let updated;
      if (prev.includes(boardingId)) {
        updated = prev.filter(id => id !== boardingId);
        toast('Removed from saved favorites', { icon: '🤍' });
      } else {
        updated = [...prev, boardingId];
        toast.success('Saved to your favorites! ❤️');
      }
      localStorage.setItem('unihelp_saved_boardings', JSON.stringify(updated));
      return updated;
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPropertyType('All');
    setMaxPrice('');
    setOnlyHotDeals(false);
    setOnlyVerified(false);
    setGenderFilter('All');
    setBillsIncludedFilter(false);
    setShowFavoritesOnly(false);
    setAmenities({ wifi: false, attachedBathroom: false, parking: false, furnished: false });
  };

  const handleCompareToggle = (boarding) => {
    setSelectedToCompare(prev => {
      const isSelected = prev.find(item => (item._id || item.id) === (boarding._id || boarding.id));
      if (isSelected) {
        return prev.filter(item => (item._id || item.id) !== (boarding._id || boarding.id));
      }
      if (prev.length >= 3) {
        toast.error('You can compare up to 3 properties at a time.');
        return prev;
      }
      return [...prev, boarding];
    });
  };

  // Filter Logic
  let filteredBoardings = boardings.filter(b => {
    const id = b._id || b.id;
    // Favorites only
    if (showFavoritesOnly && !savedFavorites.includes(id)) return false;

    // Search Query (Location, Title, City, Address)
    const matchesSearch = searchQuery === '' || 
      (b.city && b.city.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (b.district && b.district.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.address && b.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.title && b.title.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Property Type
    const matchesType = propertyType === 'All' || b.propertyType === propertyType;
    
    // Max Price
    const matchesPrice = maxPrice === '' || b.price <= Number(maxPrice);

    // Hot deals & Verified
    const isHotDeal = b.isHotDeal || (b.price > 0 && ((b.propertyType === 'Room' && b.price < 15000) || ((b.propertyType === 'Apartment' || b.propertyType === 'House') && b.price < 40000)));
    const matchesHotDeal = !onlyHotDeals || isHotDeal;
    const matchesVerified = !onlyVerified || (b.isVerified || b.userId);

    // Gender
    const matchesGender = genderFilter === 'All' || !b.genderPreference || b.genderPreference === 'Any' || b.genderPreference === genderFilter;

    // Bills Included
    const matchesBills = !billsIncludedFilter || (b.waterIncluded && b.electricityIncluded);
    
    // Amenities
    const matchesWifi = !amenities.wifi || b.wifi;
    const matchesBathroom = !amenities.attachedBathroom || b.attachedBathroom;
    const matchesParking = !amenities.parking || b.parking;
    const matchesFurnished = !amenities.furnished || b.furnished;

    return matchesSearch && matchesType && matchesPrice && matchesHotDeal && matchesVerified && matchesGender && matchesBills && matchesWifi && matchesBathroom && matchesParking && matchesFurnished;
  });

  // Sorting Logic
  if (sortBy === 'price-low') {
    filteredBoardings.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredBoardings.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'newest') {
    filteredBoardings.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  // Active filter count
  const activeFilterCount = [
    propertyType !== 'All',
    maxPrice !== '',
    onlyHotDeals,
    onlyVerified,
    genderFilter !== 'All',
    billsIncludedFilter,
    showFavoritesOnly,
    amenities.wifi,
    amenities.attachedBathroom,
    amenities.parking,
    amenities.furnished
  ].filter(Boolean).length;

  return (
    <div className="unihelp-page-bg font-sans d-flex flex-column" style={{ fontFamily: "'Inter', sans-serif", paddingTop: '80px' }}>

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

      {/* Modern Hero Section */}
      <section className="boardings-hero-modern">
        <div className="hero-shape hero-shape-1"></div>
        <div className="hero-shape hero-shape-2"></div>
        <div className="hero-shape hero-shape-3"></div>
        
        <div className="container text-center position-relative" style={{ zIndex: 1 }}>
          <h1 className="hero-title-modern">
            Discover Your <span className="highlight-text">Perfect Student Home</span>
          </h1>
          <p className="hero-subtitle-modern mt-3 mb-3">
            Explore verified boarding places, apartments, and rooms near your university campus.
          </p>

          <div className="row justify-content-center w-100 mt-4 mx-0">
            <div className="col-12 col-xl-9">
              
              {/* Category Icons */}
              <div className="bl-hero-categories mb-3">
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
                  placeholder="Search by city, Malabe, Kaduwela, address..." 
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

              {/* Quick Pills Row */}
              <div className="bl-quick-filter-pills mt-3 d-flex justify-content-center flex-wrap gap-2">
                <button
                  type="button"
                  className={`bl-pill-btn ${showFavoritesOnly ? 'active' : ''}`}
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                >
                  ❤️ Saved Favorites ({savedFavorites.length})
                </button>
                <button
                  type="button"
                  className={`bl-pill-btn ${onlyHotDeals ? 'active' : ''}`}
                  onClick={() => setOnlyHotDeals(!onlyHotDeals)}
                >
                  🔥 Hot Deals
                </button>
                <button
                  type="button"
                  className={`bl-pill-btn ${onlyVerified ? 'active' : ''}`}
                  onClick={() => setOnlyVerified(!onlyVerified)}
                >
                  🛡️ Verified Hosts
                </button>
                <button
                  type="button"
                  className={`bl-pill-btn ${maxPrice === '20000' ? 'active' : ''}`}
                  onClick={() => setMaxPrice(maxPrice === '20000' ? '' : '20000')}
                >
                  ⚡ Under Rs. 20,000
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container py-4 mb-5 flex-grow-1">
        <div className="boardings-layout">
          {/* Sidebar Filters */}
          <aside className={`boardings-sidebar ${isMobileFiltersOpen ? 'open' : ''}`}>
            <div className="card h-100 glass-filter-card d-flex flex-column" style={isMobileFiltersOpen ? { borderRadius: '0 !important', padding: '2rem 1.5rem' } : { padding: '2rem 1.5rem' }}>
              
              <div className="bl-filter-header">
                <div className="bl-filter-header__icon"><i className="bi bi-funnel-fill" /></div>
                <h5 className="bl-filter-header__title">Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</h5>
                {isMobileFiltersOpen && (
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="btn btn-sm btn-link text-secondary p-0 ms-auto">
                    <i className="bi bi-x-lg fs-5"></i>
                  </button>
                )}
              </div>

              <div className="d-flex flex-column gap-4">
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
                <div className="border-top pt-3">
                  <h6 className="filter-heading">Max Budget (LKR)</h6>
                  <div className="bl-price-input-group">
                    <span className="bl-price-input-group__prefix">Rs</span>
                    <input
                      type="number"
                      placeholder="e.g. 25000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>

                {/* Gender Allowed */}
                <div className="border-top pt-3">
                  <h6 className="filter-heading">Gender Preference</h6>
                  <select
                    className="form-select form-select-sm rounded-3"
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    style={{ fontSize: '13px', fontWeight: '600' }}
                  >
                    <option value="All">Any Gender</option>
                    <option value="Male">Male Students Only</option>
                    <option value="Female">Female Students Only</option>
                  </select>
                </div>

                {/* Amenities */}
                <div className="border-top pt-3">
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
                    <div className="form-check d-flex align-items-center gap-2">
                      <input type="checkbox" id="bills" checked={billsIncludedFilter} onChange={(e) => setBillsIncludedFilter(e.target.checked)} className="form-check-input filter-checkbox m-0" />
                      <label className="filter-label" htmlFor="bills">Water &amp; Electricity Included</label>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="border-top pt-3 mt-auto">
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

          {/* Results Area */}
          <main className="boardings-results">
            <div className="bl-results-header">
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <div className="bl-count-pill">
                  <i className="bi bi-grid-3x3-gap-fill" />
                  <span className="bl-count-pill__num">{filteredBoardings.length}</span>
                  {filteredBoardings.length === 1 ? 'place' : 'places'} found
                </div>

                {/* View Switcher: Grid vs Map */}
                <div className="bl-view-switcher">
                  <button
                    type="button"
                    className={`bl-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <i className="bi bi-grid-fill me-1" /> Grid
                  </button>
                  <button
                    type="button"
                    className={`bl-view-btn ${viewMode === 'map' ? 'active' : ''}`}
                    onClick={() => setViewMode('map')}
                  >
                    <i className="bi bi-map-fill me-1" /> Campus Map
                  </button>
                </div>
              </div>

              {/* Sort By Dropdown */}
              <div className="d-flex align-items-center gap-2">
                <label className="bl-sort-label d-none d-sm-inline">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bl-sort-select"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Added</option>
                </select>
                
                {user && user.role === 'admin' && (
                  <button 
                    onClick={() => navigate('/dashboard?tab=boardings')} 
                    className="btn btn-premium-add d-flex align-items-center gap-2"
                    style={{ padding: '6px 16px', fontSize: '13px', borderRadius: '50px' }}
                  >
                    <i className="bi bi-shield-lock-fill"></i>
                    Admin Manage
                  </button>
                )}
              </div>
            </div>
            
            {loading ? (
             <div className="boardings-grid">
               {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
             </div>
            ) : viewMode === 'map' ? (
              /* ── Interactive Campus Proximity Map View ── */
              <div className="bl-map-view-container">
                <div className="bl-interactive-map-canvas">
                  <div className="bl-map-grid-bg" />
                  
                  {/* Campus Epicenter */}
                  <div className="bl-map-campus-center">
                    <div className="bl-campus-pin">
                      <span className="bl-campus-icon">🎓</span>
                      <strong>SLIIT Main Campus</strong>
                    </div>
                    <div className="bl-campus-radius-ring r1"></div>
                    <div className="bl-campus-radius-ring r2"></div>
                  </div>

                  {/* Property Pins */}
                  {filteredBoardings.slice(0, 8).map((b, idx) => {
                    const positions = [
                      { top: '25%', left: '22%' },
                      { top: '35%', left: '72%' },
                      { top: '65%', left: '30%' },
                      { top: '70%', left: '78%' },
                      { top: '20%', left: '60%' },
                      { top: '80%', left: '48%' },
                      { top: '45%', left: '15%' },
                      { top: '55%', left: '85%' },
                    ];
                    const pos = positions[idx % positions.length];
                    const isSelected = selectedMapBoarding && (selectedMapBoarding._id === b._id);

                    return (
                      <div
                        key={b._id || idx}
                        className={`bl-map-property-pin ${isSelected ? 'active' : ''}`}
                        style={pos}
                        onClick={() => setSelectedMapBoarding(b)}
                      >
                        <span className="bl-pin-price">Rs.{(b.price / 1000).toFixed(0)}k</span>
                        <div className="bl-pin-dot"></div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Map Preview Card */}
                {selectedMapBoarding && (
                  <div className="bl-map-preview-card">
                    <button className="bl-map-preview-close" onClick={() => setSelectedMapBoarding(null)}>✕</button>
                    <img src={selectedMapBoarding.imageUrls?.[0] || 'https://images.unsplash.com/photo-1522771731470-ea44358153a5?w=500&fit=crop'} alt={selectedMapBoarding.title} />
                    <div className="bl-map-preview-body">
                      <h6>{selectedMapBoarding.title}</h6>
                      <p className="bl-map-preview-loc"><i className="bi bi-geo-alt-fill text-danger me-1" />{selectedMapBoarding.city}, {selectedMapBoarding.district}</p>
                      <div className="bl-map-preview-price">Rs.{selectedMapBoarding.price.toLocaleString()} / mo</div>
                      <button
                        onClick={() => navigate(`/boarding/${selectedMapBoarding._id || selectedMapBoarding.id}`)}
                        className="btn btn-primary btn-sm rounded-pill mt-2 w-100"
                      >
                        View Full Property &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : filteredBoardings.length > 0 ? (
              <div className="boardings-grid">
                {filteredBoardings.map(boarding => {
                  const bId = boarding._id || boarding.id;
                  const isSelected = selectedToCompare.some(item => (item._id || item.id) === bId);
                  const isFav = savedFavorites.includes(bId);

                  return (
                    <div key={bId || Math.random()} className="boarding-grid-item">
                        <BoardingCard 
                          boarding={boarding} 
                          onCompareToggle={() => handleCompareToggle(boarding)}
                          isSelected={isSelected}
                          isFavorite={isFav}
                          onFavoriteToggle={toggleFavorite}
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
                    <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '400px' }}>
                      {showFavoritesOnly ? 'You have not saved any boarding places to your favorites yet.' : "We couldn't find any boarding places matching your exact filters."}
                    </p>
                    <button 
                      onClick={clearFilters}
                      className="btn btn-primary px-5 py-2 rounded-pill fw-bold shadow-sm"
                    >
                      Clear filters and reset
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

