import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Item.css';

function Item(props) {
  const { _id, itemName, category, condition, price, photos, status } = props.item;
  const isOwner = props.isOwner || false;
  const navigate = useNavigate();
  const isActive = status === 'active' || !status;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/marketplace/${_id}`);
        window.location.reload();
      } catch (err) {
        alert('Failed to delete item. Please try again.');
      }
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/marketplace/sell/update/${_id}`);
  };

  return (
    <div
      className="item-card"
      onClick={() => navigate(`/marketplace/item/${_id}`)}
    >
      <div className="item-card-img">
        {photos && photos.length > 0 ? (
          <img src={photos[0]} alt={itemName} />
        ) : (
          <div className="item-card-no-img">No Image</div>
        )}
        <div className={`item-status-pill ${isActive ? 'active-pill' : 'sold-pill'}`}>
          {isActive ? 'Active' : 'Sold'}
        </div>
      </div>
      <div className="item-card-body">
        <div className="item-card-name">{itemName}</div>
        <div className="item-card-price">
          {Number(price).toLocaleString()} LKR
        </div>
        <div className="item-card-meta">
          {category} &nbsp;·&nbsp; {condition}
        </div>
      </div>

      {isOwner && (
        <div className="item-card-actions">
          <button className="item-btn-edit" onClick={handleEdit}>Edit</button>
          <button className="item-btn-delete" onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default Item;