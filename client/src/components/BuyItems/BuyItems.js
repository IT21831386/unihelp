import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BuyItems.css';

const URL = 'http://localhost:5000/marketplace';

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
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  useEffect(() => {
    axios.get(URL).then((res) => {
      const active = res.data.items.filter(
        (item) => item.status === 'active' || !item.status
      );
      setItems(active);
      setLoading(false);
    });
  }, []);

  const getItemsByCategory = (cat) =>
    items.filter((item) => item.category === cat);

  if (loading) {
    return (
      <div className="bi-loading">
        <div className="bi-spinner" />
        <p>Loading marketplace...</p>
      </div>
    );
  }

  return (
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
        {items.length === 0 ? (

          /* Empty state */
          <div className="bi-empty">
            <div className="bi-empty-icon">🛒</div>
            <p>No items available right now</p>
            <span>Check back later or post your own items to sell</span>
          </div>

        ) : (
          CATEGORIES.map((cat) => {
            const catItems = getItemsByCategory(cat);
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
                              <rect x="3" y="3" width="18" height="18" rx="2"/>
                              <circle cx="8.5" cy="8.5" r="1.5"/>
                              <polyline points="21 15 16 10 5 21"/>
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
                                strokeLinecap="round" strokeLinejoin="round"/>
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
      </div>

    </div>
  );
}

export default BuyItems;