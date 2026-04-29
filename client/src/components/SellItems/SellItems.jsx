import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Item from '../Item/Item';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { getCurrentUser } from '../../utils/user';
import './SellItems.css';

const URL = 'http://localhost:5000/api/marketplace';

function SellItems() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    axios.get(URL).then((res) => {
      const allItems = res.data.items;
      console.log('All items:', allItems);
      console.log('Current user id:', currentUser.id);
      const myItems = allItems.filter(
        (item) => item.sellerId === currentUser.id || !item.sellerId
      );
      console.log('My items:', myItems);
      setItems(myItems);
    });
  }, []);

  return (
    <div className="sell-page-wrapper sell-live-bg">
      <Navbar />

      {/* ══ LIVE BACKGROUND ELEMENTS ══ */}
      <div className="sell-bg-images"></div>
      <div className="sell-bg-overlay"></div>
      <div className="sell-bg-aurora">
        <div className="sell-aurora-blob sell-aurora-1"></div>
        <div className="sell-aurora-blob sell-aurora-2"></div>
        <div className="sell-aurora-blob sell-aurora-3"></div>
      </div>

      <div className="sell-page">
        <div className="sell-breadcrumb">
          <span onClick={() => navigate('/marketplace')}>Market Place</span>
          &nbsp;›&nbsp; Sell Items
        </div>

        <div className="sell-content">
          <div className="sell-title">Sell Items</div>

          <div className="sell-top-buttons">
            <div
              className="sell-big-btn btn-orange"
              onClick={() => navigate('/marketplace/sell/add')}
            >
              <div className="sell-icon-wrap orange-icon">
                <svg width="26" height="26" viewBox="0 0 24 24">
                  <path d="M19 13H13v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              </div>
              <div className="sell-btn-label">Add New Item</div>
              <div className="sell-btn-sub">Post a new item to the marketplace</div>
            </div>

            <div
              className="sell-big-btn btn-navy"
              onClick={() => navigate('/marketplace/chats')}
            >
              <div className="sell-icon-wrap navy-icon">
                <svg width="26" height="26" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
              </div>
              <div className="sell-btn-label">
                Chats &nbsp;<span className="sell-badge">3 new</span>
              </div>
              <div className="sell-btn-sub">View messages from buyers</div>
            </div>
          </div>

          <div className="sell-section-label">My Posted Items</div>

          {items.length === 0 ? (
            <div className="sell-empty">
              <div className="sell-empty-icon">📦</div>
              <p>No items posted yet</p>
              <span>Click "Add New Item" to list your first item</span>
            </div>
          ) : (
            <div className="sell-cards-grid">
              {items.map((item, i) => (
                <Item key={i} item={item} isOwner={true} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />

      <style>{`
        .sell-live-bg {
          position: relative;
          min-height: 100vh;
          background: #ffffff;
          overflow-x: hidden;
        }

        .sell-bg-images {
          position: fixed;
          inset: 0;
          z-index: 0;
          background-size: cover;
          background-position: center;
          animation: sellBgCrossfade 30s infinite;
          opacity: 0.35;
        }

        .sell-bg-overlay {
          position: fixed;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            135deg,
            rgba(240, 243, 255, 0.4) 0%,
            rgba(255, 255, 255, 0.3) 100%
          );
        }

        @keyframes sellBgCrossfade {
          0%, 18%  { background-image: url('https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=2070&auto=format&fit=crop'); }
          20%, 38% { background-image: url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop'); }
          40%, 58% { background-image: url('https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070&auto=format&fit=crop'); }
          60%, 78% { background-image: url('https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?q=80&w=1974&auto=format&fit=crop'); }
          80%, 98% { background-image: url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop'); }
          100%     { background-image: url('https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=2070&auto=format&fit=crop'); }
        }

        .sell-bg-aurora {
          position: fixed;
          inset: 0;
          z-index: 2;
          filter: blur(100px);
          opacity: 0.5;
          pointer-events: none;
        }

        .sell-aurora-blob {
          position: absolute;
          border-radius: 50%;
          animation: sellFloat 25s infinite alternate ease-in-out;
        }
        .sell-aurora-1 { width: 60vw; height: 60vw; background: rgba(255, 107, 53, 0.15); top: -10%; right: -10%; }
        .sell-aurora-2 { width: 50vw; height: 50vw; background: rgba(59, 130, 246, 0.1); bottom: -10%; left: -5%; }
        .sell-aurora-3 { width: 40vw; height: 40vw; background: rgba(139, 92, 246, 0.1); top: 30%; left: 30%; }

        @keyframes sellFloat {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(5%, 5%) scale(1.05); }
        }

        .sell-page {
          position: relative;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}

export default SellItems;