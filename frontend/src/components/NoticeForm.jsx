import React, { useState, useEffect } from 'react';

const NoticeForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    noticeNo: '',
    title: '',
    date: '',
    time: '',
    description: '',
    category: '',
    audience: '',
    location: '',
    attachments: '',
    expiryDate: ''
  });

  const isEventForm = formData.category === 'Events' || (initialData && initialData.category === 'Events');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        noticeNo: initialData.noticeNo || '',
        title: initialData.title || '',
        date: initialData.date || '',
        time: initialData.time || '',
        description: initialData.description || '',
        category: initialData.category || '',
        audience: initialData.audience || '',
        location: initialData.location || '',
        attachments: initialData.attachments || '',
        expiryDate: initialData.expiryDate || ''
      });
    }
  }, [initialData]);

  const validate = () => {
    let tempErrors = {};
    if (!formData.title) tempErrors.title = "Title is required";
    if (!formData.date) tempErrors.date = "Date is required";
    if (!formData.time) tempErrors.time = "Time is required";
    if (!formData.description) tempErrors.description = "Description is required";
    if (!isEventForm && !formData.category) tempErrors.category = "Category is required";
    if (isEventForm && !formData.location) tempErrors.location = "Location is required";
    if (!formData.audience) tempErrors.audience = "Audience is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Convert uploaded photo to Base64 to save and display immediately
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

  const labelStyle = { width: '200px', fontWeight: 'bold', fontSize: '1.1rem', color: '#334155' };
  const inputStyle = { padding: '0.6rem 1rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', width: '300px', fontSize: '1.05rem', backgroundColor: '#f8fafc' };
  const getContainerStyle = () => ({ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' });

  return (
    <div style={{ background: '#ffffff', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: '#1e293b', fontSize: '2.2rem', fontWeight: '800' }}>
        {initialData && initialData._id ? `Edit ${isEventForm ? 'Event' : 'Notice'}` : `Add ${isEventForm ? 'Event' : 'Notice'}`}
      </h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: '650px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>

        {/* Title */}
        <div style={getContainerStyle()}>
          <label style={labelStyle}>Title:</label>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <input type="text" name="title" value={formData.title} onChange={handleChange} style={inputStyle} />
            {errors.title && <span style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '4px' }}>{errors.title}</span>}
          </div>
        </div>

        {/* Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={getContainerStyle()}>
            <label style={{ ...labelStyle, width: '120px' }}>Date:</label>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input type="date" name="date" value={formData.date} onChange={handleChange} style={{ ...inputStyle, width: '200px' }} />
              {errors.date && <span style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '4px' }}>{errors.date}</span>}
            </div>
          </div>
          <div style={getContainerStyle()}>
            <label style={{ ...labelStyle, width: '120px' }}>Expiry Date:</label>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} style={{ ...inputStyle, width: '200px' }} />
              <span style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>Notice will archive after this date</span>
            </div>
          </div>
        </div>

        {/* Time */}
        <div style={getContainerStyle()}>
          <label style={labelStyle}>Time:</label>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <input type="time" name="time" value={formData.time} onChange={handleChange} style={inputStyle} />
            {errors.time && <span style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '4px' }}>{errors.time}</span>}
          </div>
        </div>

        {/* Description */}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <label style={{ ...labelStyle, marginTop: '10px' }}>Description:</label>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <textarea name="description" value={formData.description} onChange={handleChange} 
              style={{ ...inputStyle, width: '400px', minHeight: '120px', resize: 'vertical' }} 
            ></textarea>
            {errors.description && <span style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '4px' }}>{errors.description}</span>}
          </div>
        </div>

        {/* Category (Hidden if forced/hidden requested) */}
        {!initialData?.hideCategory && (
          <div style={getContainerStyle()}>
            <label style={labelStyle}>Category:</label>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <select name="category" value={formData.category} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Select Category</option>
                <option value="Academic">Academic</option>
                <option value="Events">Events</option>
                <option value="Exam">Exam</option>
                <option value="Lost Item">Lost Item</option>
                <option value="Found Item">Found Item</option>
                <option value="General">General</option>
              </select>
              {errors.category && <span style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '4px' }}>{errors.category}</span>}
            </div>
          </div>
        )}

        {/* Location (Visible only for Events) */}
        {isEventForm && (
          <div style={getContainerStyle()}>
            <label style={labelStyle}>Location:</label>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <select name="location" value={formData.location} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Select Location</option>
                <option value="Main Hall">Main Hall</option>
                <option value="Open Theatre">Open Theatre</option>
                <option value="Ground">Ground</option>
                <option value="Library">Library</option>
                <option value="Auditorium">Auditorium</option>
                <option value="Online (Zoom)">Online (Zoom)</option>
              </select>
              {errors.location && <span style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '4px' }}>{errors.location}</span>}
            </div>
          </div>
        )}

        {/* Audience */}
        <div style={getContainerStyle()}>
          <label style={labelStyle}>Audience:</label>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <select name="audience" value={formData.audience} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Select Audience</option>
              <option value="All Students">All Students</option>
              <option value="Computer Faculty">Computer Faculty</option>
              <option value="Business Faculty">Business Faculty</option>
              <option value="Lecturers">Lecturers</option>
              <option value="Staff">Staff</option>
              <option value="Specific Group">Specific Group</option>
            </select>
            {errors.audience && <span style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '4px' }}>{errors.audience}</span>}
          </div>
        </div>

        {/* Attachments (Photos) */}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <label style={{ ...labelStyle, marginTop: '10px' }}>Upload Photo:</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px dashed #cbd5e1', borderRadius: '8px', padding: '1rem', width: '300px', backgroundColor: '#f8fafc', cursor: 'pointer', justifyContent: 'center' }}>
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ fontSize: '1rem', width: '100%' }} />
            </div>
            {formData.attachments && (
              <div style={{ marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', width: '300px', height: '150px' }}>
                <img src={formData.attachments} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem', gap: '1.5rem' }}>
          <button type="submit" disabled={isLoading} 
            style={{ background: '#f97316', color: '#fff', border: 'none', padding: '1rem 3rem', borderRadius: '8px', fontWeight: '800', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '220px', boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)', transition: 'transform 0.2s' }}>
            {isLoading ? <span style={{ border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid #fff', borderRadius: '50%', width: '22px', height: '22px', animation: 'spin 1s linear infinite' }}></span> : (initialData && initialData._id ? `Update ${isEventForm ? 'Event' : 'Notice'}` : `Add ${isEventForm ? 'Event' : 'Notice'}`)}
          </button>
          <button type="button" onClick={onCancel} 
            style={{ background: '#fff', color: '#64748b', border: '2px solid #cbd5e1', padding: '1rem 3rem', borderRadius: '8px', fontWeight: '800', fontSize: '1.2rem', cursor: 'pointer', minWidth: '150px', transition: 'background-color 0.2s' }}>
            Cancel
          </button>
        </div>

      </form>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        button:hover:not(:disabled) { transform: translateY(-2px); }
        input:focus, textarea:focus, select:focus { outline: none; border-color: #f97316; box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1); }
      `}</style>
    </div>
  );
};

export default NoticeForm;
