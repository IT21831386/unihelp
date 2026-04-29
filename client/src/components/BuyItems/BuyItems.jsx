import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import './BuyItems.css';

const URL = 'http://localhost:5000/api/marketplace';

const CATEGORIES = [
  'Electronics',
  'Furniture',
  'Books',
  'Clothing',
  'Boarding',
  'Sports',
  'Stationery',
  'Other',
];

function BuyItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [onlyNegotiable, setOnlyNegotiable] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(URL).then((res) => {
      const active = res.data.items.filter(
        (item) => item.status === 'active' || !item.status
      );
      setItems(active);
      setLoading(false);
    });
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesMinPrice = minPrice === '' || Number(item.price) >= Number(minPrice);
    const matchesMaxPrice = maxPrice === '' || Number(item.price) <= Number(maxPrice);
    const matchesCondition = selectedConditions.length === 0 || selectedConditions.includes(item.condition);
    const matchesNegotiable = !onlyNegotiable || item.isNegotiable;

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesCondition && matchesNegotiable;
  });

  const getItemsByCategory = (cat, itemList) =>
    itemList.filter((item) => item.category === cat);

  if (loading) {
    return (
      <div className="bi-loading">
        <div className="bi-spinner" />
        <p>Loading marketplace...</p>
      </div>
    );
  }

  return (
    <div className="bi-page-wrapper bi-live-bg">
      <Navbar />

      {/* ══ LIVE BACKGROUND ELEMENTS ══ */}
      <div className="bi-bg-images"></div>
      <div className="bi-bg-overlay"></div>
      <div className="bi-bg-aurora">
        <div className="bi-aurora-blob bi-aurora-1"></div>
        <div className="bi-aurora-blob bi-aurora-2"></div>
        <div className="bi-aurora-blob bi-aurora-3"></div>
      </div>

      <div className="bi-page">

        {/* ══ HERO BANNER — breadcrumb + title ══ */}
        <div className="bi-hero-banner">

          {/* Breadcrumb path */}
          <div className="bi-breadcrumb">
            <span
              className="bi-breadcrumb-home"
              onClick={() => navigate('/marketplace')}
            >
              Market Place
            </span>
            <span className="bi-breadcrumb-sep">›</span>
            <span className="bi-breadcrumb-current">Buy Items</span>
          </div>

          {/* Page title */}
          <div className="bi-hero-title-row">
            <h1 className="bi-hero-main-title">
              Browse &amp; <span>discover</span> items
            </h1>
            <p className="bi-hero-sub">
              Electronics · Furniture · Books · Clothing &amp; more
            </p>
          </div>

          <div className="bi-hero-accent" />
        </div>

        {/* ══ CONTENT ══ */}
        <div className="bi-content">
          
          {/* ══ SIDEBAR ══ */}
          <aside className="bi-sidebar">
            <div className="bi-sidebar-section">
              <h3 className="bi-sidebar-title">Search</h3>
              <div className="bi-search-wrap">
                <input 
                  type="text" 
                  placeholder="Find item..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bi-search-input"
                />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bi-search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
            </div>

            <div className="bi-sidebar-section">
              <h3 className="bi-sidebar-title">Categories</h3>
              <div className="bi-filter-list">
                <button 
                  className={`bi-filter-btn ${selectedCategory === 'All' ? 'bi-filter-btn--active' : ''}`}
                  onClick={() => setSelectedCategory('All')}
                >
                  All Categories
                </button>
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    className={`bi-filter-btn ${selectedCategory === cat ? 'bi-filter-btn--active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bi-sidebar-section">
              <h3 className="bi-sidebar-title">Price Range (LKR)</h3>
              <div className="bi-price-inputs">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="bi-price-input"
                />
                <span className="bi-price-sep">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="bi-price-input"
                />
              </div>
            </div>

            <div className="bi-sidebar-section">
              <h3 className="bi-sidebar-title">Condition</h3>
              <div className="bi-condition-grid">
                {['Like New', 'Good', 'Fair', 'Poor'].map(cond => (
                  <button 
                    key={cond}
                    className={`bi-cond-pill ${selectedConditions.includes(cond) ? 'bi-cond-pill--active' : ''}`}
                    onClick={() => {
                      if (selectedConditions.includes(cond)) {
                        setSelectedConditions(selectedConditions.filter(c => c !== cond));
                      } else {
                        setSelectedConditions([...selectedConditions, cond]);
                      }
                    }}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <div className="bi-sidebar-section">
              <h3 className="bi-sidebar-title">Options</h3>
              <label className="bi-option-item">
                <input 
                  type="checkbox" 
                  checked={onlyNegotiable}
                  onChange={(e) => setOnlyNegotiable(e.target.checked)}
                />
                <span>Negotiable only</span>
              </label>
            </div>

            <button 
              className="bi-clear-filters"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setMinPrice('');
                setMaxPrice('');
                setSelectedConditions([]);
                setOnlyNegotiable(false);
              }}
            >
              Clear All Filters
            </button>
          </aside>

          {/* ══ MAIN AREA ══ */}
          <main className="bi-main">
            {filteredItems.length === 0 ? (

              /* Empty state */
              <div className="bi-empty">
                <div className="bi-empty-icon">🛒</div>
                <p>No items match your filters</p>
                <span>Try adjusting your search or price range</span>
              </div>

            ) : (
              (selectedCategory === 'All' ? CATEGORIES : [selectedCategory]).map((cat) => {
                const catItems = getItemsByCategory(cat, filteredItems);
                if (catItems.length === 0) return null;

                return (
                  <div key={cat} className="bi-category-section">

                    {/* Category header */}
                    <div className="bi-category-header">
                      <span className="bi-category-tag">Category</span>
                      <span className="bi-category-title">{cat}</span>
                      <div className="bi-category-line" />
                    </div>

                    {/* Items grid */}
                    <div className="bi-cards-grid">
                      {catItems.map((item, i) => (
                        <div
                          key={i}
                          className="bi-card"
                          onClick={() => navigate(`/marketplace/item/${item._id}`)}
                        >

                          {/* Image area */}
                          <div className="bi-card-img">
                            {item.photos && item.photos.length > 0 ? (
                              <img src={item.photos[0]} alt={item.itemName} />
                            ) : (
                              <div className="bi-card-no-img">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                                  stroke="#ffffff" strokeWidth="1.2"
                                  strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="3" width="18" height="18" rx="2" />
                                  <circle cx="8.5" cy="8.5" r="1.5" />
                                  <polyline points="21 15 16 10 5 21" />
                                </svg>
                                No Image
                              </div>
                            )}
                            <div className="bi-card-img-overlay" />
                            {item.condition && (
                              <span className="bi-card-cond-badge">
                                {item.condition}
                              </span>
                            )}
                          </div>

                          {/* Card body */}
                          <div className="bi-card-body">
                            <div className="bi-card-name">{item.itemName}</div>
                            <div className="bi-card-price">
                              {Number(item.price).toLocaleString()}
                              <span>LKR</span>
                            </div>
                            <div className="bi-card-meta">
                              {item.condition}
                              {item.isNegotiable && (
                                <span className="bi-neg-badge">Negotiable</span>
                              )}
                            </div>

                            {/* Footer: text button + arrow */}
                            <div className="bi-card-footer">
                              <button
                                className="bi-view-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/marketplace/item/${item._id}`);
                                }}
                              >
                                View Details
                              </button>
                              <div
                                className="bi-card-arrow"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/marketplace/item/${item._id}`);
                                }}
                              >
                                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                  <path d="M2 6h8M6 2l4 4-4 4"
                                    stroke="#fff" strokeWidth="1.6"
                                    strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </main>
        </div>
      </div>
      <Footer />

      <style>{`
        .bi-live-bg {
          position: relative;
          min-height: 100vh;
          background: #ffffff;
          overflow-x: hidden;
        }

        .bi-bg-images {
          position: fixed;
          inset: 0;
          z-index: 0;
          background-size: cover;
          background-position: center;
          animation: biBgCrossfade 30s infinite;
          opacity: 0.35;
        }

        .bi-bg-overlay {
          position: fixed;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            135deg,
            rgba(240, 243, 255, 0.4) 0%,
            rgba(255, 255, 255, 0.3) 100%
          );
        }

        @keyframes biBgCrossfade {
          0%, 18%  { background-image: url('https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=2070&auto=format&fit=crop'); }
          20%, 38% { background-image: url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop'); }
          40%, 58% { background-image: url('https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070&auto=format&fit=crop'); }
          60%, 78% { background-image: url('https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?q=80&w=1974&auto=format&fit=crop'); }
          80%, 98% { background-image: url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop'); }
          100%     { background-image: url('https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=2070&auto=format&fit=crop'); }
        }

        .bi-bg-aurora {
          position: fixed;
          inset: 0;
          z-index: 2;
          filter: blur(100px);
          opacity: 0.5;
          pointer-events: none;
        }

        .bi-aurora-blob {
          position: absolute;
          border-radius: 50%;
          animation: biFloat 25s infinite alternate ease-in-out;
        }
        .bi-aurora-1 { width: 60vw; height: 60vw; background: rgba(255, 107, 53, 0.15); top: -10%; right: -10%; }
        .bi-aurora-2 { width: 50vw; height: 50vw; background: rgba(59, 130, 246, 0.1); bottom: -10%; left: -5%; }
        .bi-aurora-3 { width: 40vw; height: 40vw; background: rgba(139, 92, 246, 0.1); top: 30%; left: 30%; }

        @keyframes biFloat {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(5%, 5%) scale(1.05); }
        }

        .bi-page {
          position: relative;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}

export default BuyItems;