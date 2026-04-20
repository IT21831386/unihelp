import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Item from '../Item/Item';
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
  );
}

export default SellItems;