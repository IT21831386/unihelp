import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import './UpdateItem.css';

const STEPS = ['Item Info', 'Pricing', 'Photos', 'Contact'];

function UpdateItem() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedCond, setSelectedCond] = useState('');
  const [negVal, setNegVal] = useState('');
  const [conVal, setConVal] = useState('');
  const [photos, setPhotos] = useState([]);
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState({
    itemName: '',
    description: '',
    price: '',
    phone: '',
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/marketplace/${id}`)
      .then((res) => {
        const item = res.data.item;
        setInputs({
          itemName: item.itemName || '',
          description: item.description || '',
          price: item.price || '',
          phone: item.phone || '',
        });
        setSelectedCat(item.category || '');
        setSelectedCond(item.condition || '');
        setNegVal(item.isNegotiable ? 'yes' : 'no');
        setConVal(item.showContact ? 'yes' : 'no');
        setPhotos(item.photos || []);
        setLoading(false);
      })
      .catch(() => {
        showToast('Failed to load item details.');
        setLoading(false);
      });
  }, [id]);

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
    try {
      const response = await axios.put(`http://localhost:5000/api/marketplace/${id}`, {
        itemName: inputs.itemName,
        category: selectedCat,
        condition: selectedCond,
        description: inputs.description,
        price: Number(inputs.price),
        isNegotiable: negVal === 'yes',
        photos: photos,
        showContact: conVal === 'yes',
        phone: inputs.phone,
      });
      console.log('Update response:', response.data);
      showToast('Item updated successfully!');
      setTimeout(() => navigate('/marketplace/sell'), 1500);
      } catch (err) {
      console.log('Error status:', err.response?.status);
      console.log('Error message:', err.response?.data);
      showToast(`Error: ${err.response?.data?.message || err.message}`);
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

  if (loading) {
    return (
      <div className="ui-loading">
        <div className="ui-spinner" />
        <p>Loading item details...</p>
      </div>
    );
  }

  return (
    <div className="ui-page-wrapper">
      <Navbar />
      <div className="ui-page">

      <div className="ui-breadcrumb">
        <span onClick={() => navigate('/marketplace')}>Market Place</span>
        &nbsp;›&nbsp;
        <span onClick={() => navigate('/marketplace/sell')}>Sell Items</span>
        &nbsp;›&nbsp; Update Item
      </div>

      <div className="ui-hero">
        <div className="ui-hero-left">
          <h1>Update Your Item</h1>
          <p>Edit the details below and save your changes</p>
        </div>
        <div className="ui-hero-right">
          <div className="ui-prog-label">Step {currentStep + 1} of 4</div>
          <div className="ui-prog-bar-bg">
            <div className="ui-prog-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="ui-dots-row">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`ui-dot ${i < currentStep ? 'ui-dot--done' : i === currentStep ? 'ui-dot--active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="ui-body">

        <div className="ui-sidebar">
          {STEPS.map((label, i) => (
            <div
              key={i}
              className={`ui-snav ${i === currentStep ? 'ui-snav--active' : ''} ${i < currentStep ? 'ui-snav--done' : ''}`}
              onClick={() => i < currentStep && setCurrentStep(i)}
            >
              <div className="ui-snum">
                {i < currentStep ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (i + 1)}
              </div>
              <div className="ui-slabel">{label}</div>
            </div>
          ))}
        </div>

        <div className="ui-card">

          {/* STEP 1 */}
          {currentStep === 0 && (
            <div className="ui-step">
              <div className="ui-step-title">Item Information</div>
              <div className="ui-step-desc">Update what you are selling and its condition.</div>

              <div className="ui-form-row">
                <label>Item Name <span className="ui-req">*</span></label>
                <input
                  type="text"
                  name="itemName"
                  value={inputs.itemName}
                  onChange={handleChange}
                  placeholder="e.g. iPad Air 5th Generation"
                  maxLength={60}
                />
                <div className="ui-char">{inputs.itemName.length} / 60</div>
              </div>

              <div className="ui-form-row">
                <label>Category <span className="ui-req">*</span></label>
                <div className="ui-cat-grid">
                  {categories.map((c) => (
                    <div
                      key={c.name}
                      className={`ui-cat-card ${selectedCat === c.name ? 'ui-cat-card--sel' : ''}`}
                      onClick={() => setSelectedCat(c.name)}
                    >
                      <div className="ui-cat-icon">{c.icon}</div>
                      <div className="ui-cat-name">{c.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ui-form-row">
                <label>Condition <span className="ui-req">*</span></label>
                <div className="ui-cond-grid">
                  {conditions.map((c) => (
                    <div
                      key={c.label}
                      className={`ui-cond-card ${selectedCond === c.label ? 'ui-cond-card--sel' : ''}`}
                      onClick={() => setSelectedCond(c.label)}
                    >
                      <div className="ui-cond-title" style={{ color: c.color }}>{c.label}</div>
                      <div className="ui-cond-desc">{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ui-form-row">
                <label>Description <span className="ui-req">*</span></label>
                <textarea
                  name="description"
                  value={inputs.description}
                  onChange={handleChange}
                  placeholder="Describe your item..."
                  maxLength={500}
                />
                <div className="ui-char">{inputs.description.length} / 500</div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 1 && (
            <div className="ui-step">
              <div className="ui-step-title">Pricing</div>
              <div className="ui-step-desc">Update the price and negotiability.</div>

              <div className="ui-form-row">
                <label>Asking Price <span className="ui-req">*</span></label>
                <div className="ui-price-wrap">
                  <span className="ui-price-prefix">LKR</span>
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

              <div className="ui-form-row">
                <label>Is the price negotiable? <span className="ui-req">*</span></label>
                <div className="ui-toggle-group">
                  <div
                    className={`ui-topt ${negVal === 'yes' ? 'ui-topt--yes' : ''}`}
                    onClick={() => setNegVal('yes')}
                  >
                    ✓ &nbsp; Yes, negotiable
                  </div>
                  <div
                    className={`ui-topt ${negVal === 'no' ? 'ui-topt--no' : ''}`}
                    onClick={() => setNegVal('no')}
                  >
                    ✕ &nbsp; Fixed price
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 2 && (
            <div className="ui-step">
              <div className="ui-step-title">Item Photos</div>
              <div className="ui-step-desc">Update your item photos. Up to 4 images.</div>

              <div
                className="ui-upload-zone"
                onClick={() => document.getElementById('ui-file-input').click()}
              >
                <div className="ui-upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#aab4cc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                </div>
                <p><strong>Click to upload photos</strong></p>
                <small>PNG or JPG · Max 5MB each · Up to 4 images</small>
              </div>
              <input
                type="file"
                id="ui-file-input"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleFiles}
              />

              <div className="ui-photo-slots">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="ui-photo-slot">
                    {photos[i] ? (
                      <>
                        <img src={photos[i]} alt={`Photo ${i + 1}`} />
                        {i === 0 && <div className="ui-cover-badge">COVER</div>}
                        <div className="ui-photo-remove" onClick={() => removePhoto(i)}>✕</div>
                      </>
                    ) : (
                      <>
                        <div className="ui-slot-plus">+</div>
                        <div className="ui-slot-label">Photo {i + 1}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 3 && (
            <div className="ui-step">
              <div className="ui-step-title">Contact Preference</div>
              <div className="ui-step-desc">Update how buyers can reach you.</div>

              <div className="ui-form-row">
                <label>Show contact number to buyers? <span className="ui-req">*</span></label>
                <div className="ui-toggle-group">
                  <div
                    className={`ui-topt ${conVal === 'yes' ? 'ui-topt--yes' : ''}`}
                    onClick={() => setConVal('yes')}
                  >
                    ✓ &nbsp; Yes, show my number
                  </div>
                  <div
                    className={`ui-topt ${conVal === 'no' ? 'ui-topt--no' : ''}`}
                    onClick={() => setConVal('no')}
                  >
                    ✕ &nbsp; No, chat only
                  </div>
                </div>
              </div>

              {conVal === 'yes' && (
                <div className="ui-form-row">
                  <div className="ui-contact-reveal">
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

              <div className="ui-review-box">
                <div className="ui-review-title">
                  <svg viewBox="0 0 24 24" fill="#e8821a" width="15" height="15">
                    <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                  </svg>
                  Review your changes before saving
                </div>
                <div className="ui-review-grid">
                  <div className="ui-review-cell">
                    <div className="ui-review-lbl">Item Name</div>
                    <div className="ui-review-val">{inputs.itemName || '—'}</div>
                  </div>
                  <div className="ui-review-cell">
                    <div className="ui-review-lbl">Category</div>
                    <div className="ui-review-val">{selectedCat || '—'}</div>
                  </div>
                  <div className="ui-review-cell">
                    <div className="ui-review-lbl">Condition</div>
                    <div className="ui-review-val">{selectedCond || '—'}</div>
                  </div>
                  <div className="ui-review-cell">
                    <div className="ui-review-lbl">Negotiable</div>
                    <div className="ui-review-val">{negVal === 'yes' ? 'Yes' : negVal === 'no' ? 'No' : '—'}</div>
                  </div>
                  <div className="ui-review-cell ui-review-cell--full">
                    <div className="ui-review-lbl">Price</div>
                    <div className="ui-review-val ui-review-price">
                      {inputs.price ? Number(inputs.price).toLocaleString() + ' LKR' : '—'}
                    </div>
                  </div>
                </div>
                {photos.length > 0 && (
                  <div className="ui-review-photos">
                    <div className="ui-review-lbl">Photos</div>
                    <div className="ui-review-photos-row">
                      {photos.map((p, i) => (
                        <div key={i} className="ui-review-photo">
                          <img src={p} alt="" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="ui-card-footer">
            <button
              className="ui-btn-back"
              onClick={prevStep}
              style={{ visibility: currentStep === 0 ? 'hidden' : 'visible' }}
            >
              ← Back
            </button>
            <div className="ui-step-ind">Step {currentStep + 1} of 4</div>
            <button
              className={currentStep === 3 ? 'ui-btn-update' : 'ui-btn-next'}
              onClick={nextStep}
            >
              {currentStep === 3 ? 'Save Changes ✓' : 'Next →'}
            </button>
          </div>
        </div>
      </div>

      <div className={`ui-toast ${toastVisible ? 'ui-toast--show' : ''}`}>
        {toast}
      </div>
      <Footer />
    </div>
  </div>
  );
}

export default UpdateItem;