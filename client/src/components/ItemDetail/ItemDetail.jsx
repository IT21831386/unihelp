import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { getCurrentUser } from '../../utils/user';
import './ItemDetail.css';

const BASE_URL = 'http://localhost:5000/api/marketplace';
const CONV_URL = 'http://localhost:5000/api/conversations';

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [saved, setSaved] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const currentUser = getCurrentUser();
  if (!currentUser) {
    return (
      <div className="ch-loading">
        <p>Please log in to view your chats.</p>
        <button className="id-btn-chat" onClick={() => navigate('/login')}>Log In</button>
      </div>
    );
  }

  useEffect(() => {
    axios.get(`${BASE_URL}/${id}`).then((res) => setItem(res.data.item));
    
    // Check if item is saved
    if (currentUser) {
      axios.get(`${BASE_URL}/saved/${currentUser.id || currentUser._id}`)
        .then((res) => {
          const savedItems = res.data.items || [];
          const isSaved = savedItems.some(i => i._id === id);
          setSaved(isSaved);
        })
        .catch(err => console.log('Error fetching saved items', err));
    }
  }, [id, currentUser]);

  const showToast = (msg) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const toggleSave = async () => {
    const endpoint = saved ? '/unsave' : '/save';
    try {
      await axios.post(`${BASE_URL}${endpoint}`, {
        userId: currentUser.id || currentUser._id,
        itemId: item._id
      });
      setSaved(!saved);
      showToast(saved ? 'Removed from saved items' : 'Item saved to your list');
    } catch (err) {
      showToast('Error updating saved items');
    }
  };

  const handleChat = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setChatLoading(true);
    try {
      const res = await axios.post(CONV_URL, {
        itemId: item._id,
        itemName: item.itemName,
        itemPhoto: item.photos && item.photos.length > 0 ? item.photos[0] : '',
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        sellerId: item.sellerId,
        sellerName: item.sellerName || 'Unknown Seller',
      });
      const convId = res.data.conversation._id;
      navigate(`/marketplace/chats?conv=${convId}`);
    } catch (err) {
      showToast('Could not start chat. Please try again.');
    }
    setChatLoading(false);
  };

  if (!item) {
    return (
      <div className="id-loading">
        <div className="id-spinner" />
        <p>Loading item details...</p>
      </div>
    );
  }

  const photos = item.photos && item.photos.length > 0 ? item.photos : [];
  const isOwner = currentUser && item.sellerId === currentUser.id;

  return (
    <div className="id-page-wrapper">
      <Navbar />
      <div className="id-page">

      <div className="id-breadcrumb">
        <span onClick={() => navigate('/marketplace')}>Market Place</span>
        &nbsp;›&nbsp;
        <span onClick={() => navigate('/marketplace/buy')}>Buy Items</span>
        &nbsp;›&nbsp;
        {item.itemName}
      </div>

      <div className="id-content">

        <div className="id-image-section">
          <div className="id-main-image" onClick={() => setModalOpen(true)}>
            {photos.length > 0 ? (
              <img src={photos[activeImg]} alt={item.itemName} />
            ) : (
              <div className="id-no-image">No Image Available</div>
            )}
            <div className="id-zoom-hint">Click to enlarge</div>
          </div>

          {photos.length > 1 && (
            <div className="id-thumbnails">
              {photos.map((photo, i) => (
                <div
                  key={i}
                  className={`id-thumb ${activeImg === i ? 'id-thumb--active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={photo} alt={`View ${i + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="id-detail-section">
          <div className="id-badge">{item.category}</div>
          <div className="id-title">{item.itemName}</div>
          <div className="id-price">{Number(item.price).toLocaleString()} LKR</div>

          {item.isNegotiable && (
            <div className="id-negotiable">✓ Price negotiable</div>
          )}

          <div className="id-info-grid">
            <div className="id-info-cell">
              <div className="id-info-label">Condition</div>
              <div className="id-info-value">{item.condition}</div>
            </div>
            <div className="id-info-cell">
              <div className="id-info-label">Category</div>
              <div className="id-info-value">{item.category}</div>
            </div>
            <div className="id-info-cell">
              <div className="id-info-label">Status</div>
              <div className="id-info-value">{item.status || 'Active'}</div>
            </div>
            <div className="id-info-cell">
              <div className="id-info-label">Seller</div>
              <div className="id-info-value">{item.sellerName || 'Unknown'}</div>
            </div>
          </div>

          <div className="id-desc-title">Description</div>
          <div className="id-desc-text">{item.description}</div>

          {item.showContact && item.phone && (
            <div className="id-contact-row">
              <svg viewBox="0 0 24 24" fill="#1a2540" width="14" height="14">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              <span>{item.phone}</span>
            </div>
          )}

          <hr className="id-divider" />

          <div className="id-seller-card">
            <div className="id-seller-avatar">
              {item.sellerName ? item.sellerName.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="id-seller-info">
              <div className="id-seller-name">{item.sellerName || 'Unknown Seller'}</div>
              <div className="id-seller-meta">University Student</div>
            </div>
            <div className="id-seller-badge">Verified Student</div>
          </div>

          <div className="id-actions">
            {!isOwner && (
              <button
                className="id-btn-chat"
                onClick={handleChat}
                disabled={chatLoading}
              >
                <svg viewBox="0 0 24 24" fill="white" width="17" height="17">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
                {chatLoading ? 'Starting chat...' : 'Chat with Seller'}
              </button>
            )}

            {isOwner && (
              <button
                className="id-btn-chat"
                onClick={() => navigate(`/marketplace/chats`)}
              >
                <svg viewBox="0 0 24 24" fill="white" width="17" height="17">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
                Chat
              </button>
            )}

            <button
              className={`id-btn-save ${saved ? 'id-btn-save--saved' : ''}`}
              onClick={toggleSave}
              title="Save item"
            >
              <svg
                viewBox="0 0 24 24"
                fill={saved ? '#e8821a' : 'none'}
                stroke={saved ? '#e8821a' : '#aaa'}
                strokeWidth="2"
                width="20"
                height="20"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {modalOpen && photos.length > 0 && (
        <div className="id-modal" onClick={() => setModalOpen(false)}>
          <button className="id-modal-close" onClick={() => setModalOpen(false)}>✕</button>
          <img className="id-modal-img" src={photos[activeImg]} alt="Full view" />
        </div>
      )}

      <div className={`id-toast ${toastVisible ? 'id-toast--show' : ''}`}>
        {toast}
      </div>
      <Footer />
    </div>
  </div>
  );
}

export default ItemDetail;