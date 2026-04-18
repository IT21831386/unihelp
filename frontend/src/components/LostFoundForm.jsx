import React, { useState } from 'react';

const LostFoundForm = ({ type, onSubmit, onCancel, isLoading }) => {
  const isLost = type === 'lost';
  const themeColor = isLost ? '#ef4444' : '#10b981';
  const themeBg = isLost ? '#fee2e2' : '#dcfce7';

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    category: isLost ? 'Lost Item' : 'Found Item',
    audience: '', // used for Contact Number
    email: '',    // new field
    location: '', // used for Where Lost/Found
    attachments: '',
    expiryDate: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.title) tempErrors.title = "Item name is required";
    if (!formData.date) tempErrors.date = "Date is required";
    
    // Date Year Validation
    if (formData.date) {
      const year = formData.date.split('-')[0];
      if (year.length !== 4) tempErrors.date = "Year must be 4 digits";
    }

    if (!formData.description) tempErrors.description = "Brief description is required";
    
    // Phone Validation
    if (!formData.audience) {
      tempErrors.audience = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.audience)) {
      tempErrors.audience = "Phone number must be exactly 10 digits";
    }

    // Email Validation
    if (formData.email && !formData.email.includes('@')) {
      tempErrors.email = "Email must contain @";
    }

    if (!formData.location) tempErrors.location = "Location is required";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Combine phone and email for the 'audience' field in the database
      const combinedContact = `Phone: ${formData.audience}${formData.email ? ` | Email: ${formData.email}` : ''}`;
      const submissionData = { ...formData, audience: combinedContact };
      onSubmit(submissionData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Phone number digit restriction
    if (name === 'audience') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      if (onlyNums.length <= 10) {
        setFormData({ ...formData, [name]: onlyNums });
      }
      return;
    }

    // Email @gmail.com auto-fix: If user types anything and it doesn't have @, we can help them.
    // Or just a simple implementation: 
    if (name === 'email') {
      // If user clears the field, keep it empty.
      // If they type and it doesn't have @, we let them type.
      setFormData({ ...formData, [name]: value });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, attachments: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Styles
  const labelStyle = { display: 'block', fontWeight: '700', marginBottom: '0.5rem', color: '#334155', fontSize: '1rem' };
  const inputStyle = { width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' };
  const rowStyle = { marginBottom: '1.5rem' };

  return (
    <div style={{ 
      background: '#ffffff', 
      padding: '2.5rem', 
      borderRadius: '24px', 
      boxShadow: '0 20px 50px rgba(0,0,0,0.1)', 
      border: `2px solid ${themeColor}`,
      maxWidth: '700px',
      margin: '0 auto',
      animation: 'slideUp 0.4s ease-out'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ 
          display: 'inline-block', 
          padding: '0.5rem 1.5rem', 
          background: themeBg, 
          color: themeColor, 
          borderRadius: '30px', 
          fontWeight: '800', 
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          marginBottom: '1rem',
          letterSpacing: '1px'
        }}>
          {isLost ? 'Reporting Lost Item' : 'Reporting Found Item'}
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#1e293b', margin: 0 }}>
          {isLost ? 'Report Your Lost Item' : 'Report an Item You Found'}
        </h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Please fill in the details as accurately as possible.</p>
      </div>

      <form onSubmit={handleSubmit}>
        
        {/* Item Name */}
        <div style={rowStyle}>
          <label style={labelStyle}>Item Name (e.g. Black Wallet, Keys):</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder="What did you lose/find?" 
            style={inputStyle}
          />
          {errors.title && <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px' }}>{errors.title}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Phone */}
          <div>
            <label style={labelStyle}>Contact Phone Number:</label>
            <input 
              type="text" 
              name="audience" 
              value={formData.audience} 
              onChange={handleChange} 
              placeholder="e.g. 071 234 5678" 
              style={inputStyle}
            />
            {errors.audience && <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px' }}>{errors.audience}</span>}
          </div>
          
          {/* Email */}
          <div>
            <label style={labelStyle}>Email Address:</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="username@gmail.com" 
                style={inputStyle}
                onBlur={() => {
                  if (formData.email && !formData.email.includes('@')) {
                    setFormData(prev => ({ ...prev, email: prev.email + '@gmail.com' }));
                  }
                }}
              />
              {!formData.email.includes('@') && formData.email.length > 0 && (
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                  Tip: Will auto-add @gmail.com if missing
                </div>
              )}
            </div>
            {errors.email && <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px' }}>{errors.email}</span>}
          </div>
        </div>

        <div style={rowStyle}>
          {/* Location */}
          <label style={labelStyle}>{isLost ? 'Where was it lost?' : 'Where did you find it?'}:</label>
          <input 
            type="text" 
            name="location" 
            value={formData.location} 
            onChange={handleChange} 
            placeholder="e.g. Library 2nd Floor" 
            style={inputStyle}
          />
          {errors.location && <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px' }}>{errors.location}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Date */}
          <div>
            <label style={labelStyle}>{isLost ? 'Date Lost:' : 'Date Found:'}</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              style={inputStyle}
            />
            {errors.date && <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px' }}>{errors.date}</span>}
          </div>
          
          {/* Expiry Date */}
          <div>
            <label style={labelStyle}>Expiry Date:</label>
            <input 
              type="date" 
              name="expiryDate" 
              value={formData.expiryDate} 
              onChange={handleChange} 
              style={inputStyle}
            />
            <span style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '4px' }}>Will archive after this date</span>
          </div>
        </div>

        <div style={rowStyle}>
          {/* Time */}
          <label style={labelStyle}>{isLost ? 'Approximate Time Lost:' : 'Time Found:'}</label>
          <input 
            type="time" 
            name="time" 
            value={formData.time} 
            onChange={handleChange} 
            style={inputStyle}
          />
        </div>

        {/* Description */}
        <div style={rowStyle}>
          <label style={labelStyle}>Detailed Description (Color, Brand, Markings):</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            placeholder="e.g. A Sony camera with a leather strap..." 
            style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
          ></textarea>
          {errors.description && <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px' }}>{errors.description}</span>}
        </div>

        {/* Photo Upload */}
        <div style={rowStyle}>
          <label style={labelStyle}>Upload Photo:</label>
          <div style={{ 
            border: '2px dashed #cbd5e1', 
            borderRadius: '12px', 
            padding: '1.5rem', 
            textAlign: 'center', 
            background: '#f8fafc',
            cursor: 'pointer'
          }}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              style={{ width: '100%', fontSize: '0.9rem' }} 
            />
          </div>
          {formData.attachments && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <img 
                src={formData.attachments} 
                alt="Preview" 
                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem' }}>
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              flex: '1', 
              padding: '1rem', 
              borderRadius: '12px', 
              border: 'none', 
              backgroundColor: themeColor, 
              color: '#fff', 
              fontWeight: '800', 
              fontSize: '1.1rem', 
              cursor: 'pointer',
              boxShadow: `0 8px 20px ${themeColor}40`,
              transition: 'all 0.2s'
            }}
          >
            {isLoading ? 'Submitting...' : isLost ? 'Submit Lost Report' : 'Submit Found Report'}
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            style={{ 
              padding: '1rem 2rem', 
              borderRadius: '12px', 
              border: '2px solid #e2e8f0', 
              backgroundColor: '#fff', 
              color: '#64748b', 
              fontWeight: '700', 
              cursor: 'pointer' 
            }}
          >
            Cancel
          </button>
        </div>
      </form>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        form input:focus, form textarea:focus {
          border-color: ${themeColor} !important;
          box-shadow: 0 0 0 3px ${themeColor}20 !important;
        }
        button:hover { transform: translateY(-2px); opacity: 0.9; }
      `}</style>
    </div>
  );
};

export default LostFoundForm;
