import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import './AddItem.css';
import { getCurrentUser } from '../../utils/user';

const STEPS = ['Item Info', 'Pricing', 'Photos', 'Contact'];

function AddItem() {
  const navigate = useNavigate();
  // ... state ...
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedCond, setSelectedCond] = useState('');
  const [negVal, setNegVal] = useState('');
  const [conVal, setConVal] = useState('');
  const [photos, setPhotos] = useState([]);
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [inputs, setInputs] = useState({
    itemName: '',
    description: '',
    price: '',
    phone: '',
  });

  const showToast = (msg) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2400);
  };

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 4 - photos.length;
    const toAdd = files.slice(0, remaining);
    if (files.length > remaining) showToast('Maximum 4 photos allowed');
    toAdd.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setPhotos((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(f);
    });
    e.target.value = '';
  };

  const removePhoto = (i) =>
    setPhotos((prev) => prev.filter((_, idx) => idx !== i));

  const validate = () => {
    if (currentStep === 0) {
      if (!inputs.itemName.trim()) { showToast('Please enter an item name'); return false; }
      if (!selectedCat) { showToast('Please select a category'); return false; }
      if (!selectedCond) { showToast('Please select a condition'); return false; }
      if (!inputs.description.trim()) { showToast('Please add a description'); return false; }
    }
    if (currentStep === 1) {
      if (!inputs.price) { showToast('Please enter a price'); return false; }
      if (!negVal) { showToast('Please select negotiable or fixed'); return false; }
    }
    if (currentStep === 3) {
      if (!conVal) { showToast('Please select a contact preference'); return false; }
      if (conVal === 'yes' && !inputs.phone.trim()) {
        showToast('Please enter your contact number'); return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (!validate()) return;
    if (currentStep < 3) setCurrentStep((p) => p + 1);
    else handleSubmit();
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  };

  const handleSubmit = async () => {
  const currentUser = getCurrentUser();
  try {
    await axios.post('http://localhost:5000/api/marketplace', {
      itemName: inputs.itemName,
      category: selectedCat,
      condition: selectedCond,
      description: inputs.description,
      price: Number(inputs.price),
      isNegotiable: negVal === 'yes',
      photos: photos,
      showContact: conVal === 'yes',
      phone: inputs.phone,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
    });
    showToast('Item posted successfully!');
    setTimeout(() => navigate('/marketplace/sell'), 1500);
  } catch (err) {
    showToast('Something went wrong. Please try again.');
  }
};

  const progress = ((currentStep + 1) / 4) * 100;

  const categories = [
    { name: 'Electronics', icon: '💻' },
    { name: 'Furniture', icon: '🛋️' },
    { name: 'Books', icon: '📚' },
    { name: 'Clothing', icon: '👕' },
    { name: 'Boarding', icon: '🏠' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Stationery', icon: '✏️' },
    { name: 'Other', icon: '📦' },
  ];

  const conditions = [
    { label: 'Like New', desc: 'Barely used, no visible wear', color: '#0d7a4a' },
    { label: 'Good', desc: 'Minor use, works perfectly', color: '#1a5fa8' },
    { label: 'Fair', desc: 'Visible wear, fully functional', color: '#b35c00' },
    { label: 'Poor', desc: 'Heavy wear or defects', color: '#c0392b' },
  ];

  return (
    <div className="ai-page-wrapper">
      <Navbar />
      <div className="ai-page">

        {/* BREADCRUMB */}
        <div className="ai-breadcrumb">
          <span onClick={() => navigate('/marketplace')}>Market Place</span>
          &nbsp;›&nbsp;
          <span onClick={() => navigate('/marketplace/sell')}>Sell Items</span>
          &nbsp;›&nbsp; Add New Item
        </div>

      {/* HERO */}
      <div className="ai-hero">
        <div className="ai-hero-left">
          <h1>List Your Item</h1>
          <p>Complete all steps to post your item on the marketplace</p>
        </div>
        <div className="ai-hero-right">
          <div className="ai-prog-label">Step {currentStep + 1} of 4</div>
          <div className="ai-prog-bar-bg">
            <div className="ai-prog-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="ai-dots-row">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`ai-dot ${i < currentStep ? 'ai-dot--done' : i === currentStep ? 'ai-dot--active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="ai-body">

        {/* SIDEBAR */}
        <div className="ai-sidebar">
          {STEPS.map((label, i) => (
            <div
              key={i}
              className={`ai-snav ${i === currentStep ? 'ai-snav--active' : ''} ${i < currentStep ? 'ai-snav--done' : ''}`}
              onClick={() => i < currentStep && setCurrentStep(i)}
            >
              <div className="ai-snum">
                {i < currentStep ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (i + 1)}
              </div>
              <div className="ai-slabel">{label}</div>
            </div>
          ))}
        </div>

        {/* FORM CARD */}
        <div className="ai-card">

          {/* STEP 1 — Item Info */}
          {currentStep === 0 && (
            <div className="ai-step">
              <div className="ai-step-title">Item Information</div>
              <div className="ai-step-desc">Tell buyers what you are selling and its condition.</div>

              <div className="ai-form-row">
                <label>Item Name <span className="ai-req">*</span></label>
                <input
                  type="text"
                  name="itemName"
                  value={inputs.itemName}
                  onChange={handleChange}
                  placeholder="e.g. iPad Air 5th Generation"
                  maxLength={60}
                />
                <div className="ai-char">{inputs.itemName.length} / 60</div>
              </div>

              <div className="ai-form-row">
                <label>Category <span className="ai-req">*</span></label>
                <div className="ai-cat-grid">
                  {categories.map((c) => (
                    <div
                      key={c.name}
                      className={`ai-cat-card ${selectedCat === c.name ? 'ai-cat-card--sel' : ''}`}
                      onClick={() => setSelectedCat(c.name)}
                    >
                      <div className="ai-cat-icon">{c.icon}</div>
                      <div className="ai-cat-name">{c.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ai-form-row">
                <label>Condition <span className="ai-req">*</span></label>
                <div className="ai-cond-grid">
                  {conditions.map((c) => (
                    <div
                      key={c.label}
                      className={`ai-cond-card ${selectedCond === c.label ? 'ai-cond-card--sel' : ''}`}
                      onClick={() => setSelectedCond(c.label)}
                    >
                      <div className="ai-cond-title" style={{ color: c.color }}>{c.label}</div>
                      <div className="ai-cond-desc">{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ai-form-row">
                <label>Description <span className="ai-req">*</span></label>
                <textarea
                  name="description"
                  value={inputs.description}
                  onChange={handleChange}
                  placeholder="Describe your item — include specs, defects, reason for selling..."
                  maxLength={500}
                />
                <div className="ai-char">{inputs.description.length} / 500</div>
              </div>
            </div>
          )}

          {/* STEP 2 — Pricing */}
          {currentStep === 1 && (
            <div className="ai-step">
              <div className="ai-step-title">Pricing</div>
              <div className="ai-step-desc">Set a fair price and let buyers know if there is room to negotiate.</div>

              <div className="ai-form-row">
                <label>Asking Price <span className="ai-req">*</span></label>
                <div className="ai-price-wrap">
                  <span className="ai-price-prefix">LKR</span>
                  <input
                    type="number"
                    name="price"
                    value={inputs.price}
                    onChange={handleChange}
                    placeholder="e.g. 80000"
                    min="0"
                  />
                </div>
              </div>

              <div className="ai-form-row">
                <label>Is the price negotiable? <span className="ai-req">*</span></label>
                <div className="ai-toggle-group">
                  <div
                    className={`ai-topt ${negVal === 'yes' ? 'ai-topt--yes' : ''}`}
                    onClick={() => setNegVal('yes')}
                  >
                    ✓ &nbsp; Yes, negotiable
                  </div>
                  <div
                    className={`ai-topt ${negVal === 'no' ? 'ai-topt--no' : ''}`}
                    onClick={() => setNegVal('no')}
                  >
                    ✕ &nbsp; Fixed price
                  </div>
                </div>
              </div>

              <div className="ai-tips-box">
                <div className="ai-tips-title">Pricing Tips</div>
                <div className="ai-tips-list">
                  <div>✓ &nbsp; Check the original price before setting yours</div>
                  <div>✓ &nbsp; Items priced 30–50% below market sell fastest</div>
                  <div>✓ &nbsp; Enabling negotiable gets 2× more inquiries</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Photos */}
          {currentStep === 2 && (
            <div className="ai-step">
              <div className="ai-step-title">Item Photos</div>
              <div className="ai-step-desc">Add up to 4 photos. Good photos attract more buyers.</div>

              <div
                className="ai-upload-zone"
                onClick={() => document.getElementById('ai-file-input').click()}
              >
                <div className="ai-upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#aab4cc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                </div>
                <p><strong>Click to upload photos</strong></p>
                <small>PNG or JPG · Max 5MB each · Up to 4 images</small>
              </div>
              <input
                type="file"
                id="ai-file-input"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleFiles}
              />

              <div className="ai-photo-slots">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="ai-photo-slot">
                    {photos[i] ? (
                      <>
                        <img src={photos[i]} alt={`Photo ${i + 1}`} />
                        {i === 0 && <div className="ai-cover-badge">COVER</div>}
                        <div
                          className="ai-photo-remove"
                          onClick={() => removePhoto(i)}
                        >✕</div>
                      </>
                    ) : (
                      <>
                        <div className="ai-slot-plus">+</div>
                        <div className="ai-slot-label">Photo {i + 1}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="ai-photo-tip">
                💡 The first photo will be shown as the cover image in the marketplace
              </div>
            </div>
          )}

          {/* STEP 4 — Contact */}
          {currentStep === 3 && (
            <div className="ai-step">
              <div className="ai-step-title">Contact Preference</div>
              <div className="ai-step-desc">Choose how buyers can reach you about this item.</div>

              <div className="ai-form-row">
                <label>Show contact number to buyers? <span className="ai-req">*</span></label>
                <div className="ai-toggle-group">
                  <div
                    className={`ai-topt ${conVal === 'yes' ? 'ai-topt--yes' : ''}`}
                    onClick={() => setConVal('yes')}
                  >
                    ✓ &nbsp; Yes, show my number
                  </div>
                  <div
                    className={`ai-topt ${conVal === 'no' ? 'ai-topt--no' : ''}`}
                    onClick={() => setConVal('no')}
                  >
                    ✕ &nbsp; No, chat only
                  </div>
                </div>
              </div>

              {conVal === 'yes' && (
                <div className="ai-form-row">
                  <div className="ai-contact-reveal">
                    <label>Your Contact Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={inputs.phone}
                      onChange={handleChange}
                      placeholder="e.g. 077 123 4567"
                    />
                  </div>
                </div>
              )}

              {/* REVIEW */}
              <div className="ai-review-box">
                <div className="ai-review-title">
                  <svg viewBox="0 0 24 24" fill="#e8821a" width="15" height="15">
                    <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                  </svg>
                  Review your listing before posting
                </div>
                <div className="ai-review-grid">
                  <div className="ai-review-cell">
                    <div className="ai-review-lbl">Item Name</div>
                    <div className="ai-review-val">{inputs.itemName || '—'}</div>
                  </div>
                  <div className="ai-review-cell">
                    <div className="ai-review-lbl">Category</div>
                    <div className="ai-review-val">{selectedCat || '—'}</div>
                  </div>
                  <div className="ai-review-cell">
                    <div className="ai-review-lbl">Condition</div>
                    <div className="ai-review-val">{selectedCond || '—'}</div>
                  </div>
                  <div className="ai-review-cell">
                    <div className="ai-review-lbl">Negotiable</div>
                    <div className="ai-review-val">{negVal === 'yes' ? 'Yes' : negVal === 'no' ? 'No' : '—'}</div>
                  </div>
                  <div className="ai-review-cell ai-review-cell--full">
                    <div className="ai-review-lbl">Price</div>
                    <div className="ai-review-val ai-review-price">
                      {inputs.price ? Number(inputs.price).toLocaleString() + ' LKR' : '—'}
                    </div>
                  </div>
                </div>
                {photos.length > 0 && (
                  <div className="ai-review-photos">
                    <div className="ai-review-lbl">Photos</div>
                    <div className="ai-review-photos-row">
                      {photos.map((p, i) => (
                        <div key={i} className="ai-review-photo">
                          <img src={p} alt="" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="ai-card-footer">
            <button
              className="ai-btn-back"
              onClick={prevStep}
              style={{ visibility: currentStep === 0 ? 'hidden' : 'visible' }}
            >
              ← Back
            </button>
            <div className="ai-step-ind">Step {currentStep + 1} of 4</div>
            <button
              className={currentStep === 3 ? 'ai-btn-post' : 'ai-btn-next'}
              onClick={nextStep}
            >
              {currentStep === 3 ? 'Post to Marketplace ✓' : 'Next →'}
            </button>
          </div>
        </div>
      </div>

      {/* TOAST */}
      <div className={`ai-toast ${toastVisible ? 'ai-toast--show' : ''}`}>
        {toast}
      </div>
      <Footer />
    </div>
  </div>
  );
}

export default AddItem;