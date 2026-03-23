import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase Client
const supabase = createClient(
    "https://ombvnpeoietugpxelugs.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYnZucGVvaWV0dWdweGVsdWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5ODM2ODYsImV4cCI6MjA2NzU1OTY4Nn0.mv9NsqrC2tckMmHa2w0X8Vg0fGtjsQXYYbMG1LRy9K4"
);

function MediaUpload(file) {
    return new Promise((resolve, reject) => {
        if (file == null) {
            reject("No file selected");
        }
        const timeStamp = new Date().getTime();
        const newFileName = `${timeStamp}-${file.name}`;

        supabase.storage
            .from("cropcartimages")
            .upload(`boarding/${newFileName}`, file, {
                cacheControl: "3600",
                upsert: false,
            })
            .then(() => {
                const correctUrl = supabase.storage
                    .from("cropcartimages")
                    .getPublicUrl(`boarding/${newFileName}`).data.publicUrl;

                resolve(correctUrl);
            })
            .catch((error) => {
                console.error("Error uploading image:", error);
                toast.error("Error uploading image");
                reject("error uploading image");
            });
    });
}

const AdminEditBoarding = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '', description: '', price: '', currency: 'LKR', address: '', city: '', district: '', propertyType: 'Room', totalRooms: '', availableRooms: '', maxOccupantsPerRoom: '', attachedBathroom: false, furnished: false, wifi: false, parking: false, kitchen: false, laundry: false, waterIncluded: false, electricityIncluded: false, genderPreference: 'Any', smokingAllowed: false, petsAllowed: false, availabilityStatus: 'Available', ownerName: '', contactNumber: '', email: ''
  });

  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchBoarding();
  }, [id]);

  const fetchBoarding = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/boardings/${id}`);
      if (response.data.success) {
        const b = response.data.data;
        setFormData({
          title: b.title || '',
          description: b.description || '',
          price: b.price || '',
          currency: b.currency || 'LKR',
          address: b.address || '',
          city: b.city || '',
          district: b.district || '',
          propertyType: b.propertyType || 'Room',
          totalRooms: b.totalRooms || '',
          availableRooms: b.availableRooms || '',
          maxOccupantsPerRoom: b.maxOccupantsPerRoom || '',
          attachedBathroom: !!b.attachedBathroom,
          furnished: !!b.furnished,
          wifi: !!b.wifi,
          parking: !!b.parking,
          kitchen: !!b.kitchen,
          laundry: !!b.laundry,
          waterIncluded: !!b.waterIncluded,
          electricityIncluded: !!b.electricityIncluded,
          genderPreference: b.genderPreference || 'Any',
          smokingAllowed: !!b.smokingAllowed,
          petsAllowed: !!b.petsAllowed,
          availabilityStatus: b.availabilityStatus || 'Available',
          ownerName: b.ownerName || '',
          contactNumber: b.contactNumber || '',
          email: b.email || ''
        });
        setExistingImages(b.imageUrls || []);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load boarding details');
      navigate('/admin/allboardings');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const validateForm = () => {
    if (formData.title.trim().length < 5) {
      toast.error("Property Title must be at least 5 characters long");
      return false;
    }
    if (formData.description.trim().length < 20) {
      toast.error("Description must be at least 20 characters long");
      return false;
    }
    if (Number(formData.price) <= 0) {
      toast.error("Price must be greater than 0");
      return false;
    }
    if (formData.propertyType !== 'Room') {
      if (Number(formData.totalRooms) <= 0) {
        toast.error("Total Rooms must be greater than 0");
        return false;
      }
      if (Number(formData.availableRooms) < 0 || Number(formData.availableRooms) > Number(formData.totalRooms)) {
        toast.error("Available Rooms must be a valid number and cannot exceed Total Rooms");
        return false;
      }
    }
    if (Number(formData.maxOccupantsPerRoom) <= 0) {
      toast.error("Max Occupants Per Room must be greater than 0");
      return false;
    }
    const phoneRegex = /^(0|\+94)[0-9]{9}$/;
    if (!phoneRegex.test(formData.contactNumber.trim())) {
      toast.error("Please enter a valid 10-digit Sri Lankan mobile number (e.g., 0771234567)");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (images.length === 0 && existingImages.length === 0) {
      toast.error("Please ensure the property has at least one image");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      let finalImageUrls = [...existingImages];

      // If new images are chosen, replace the old ones
      if (images.length > 0) {
        const uploadedImageUrls = [];
        for (const image of images) {
          toast.loading(`Uploading ${image.name}...`);
          const url = await MediaUpload(image);
          uploadedImageUrls.push(url);
          toast.dismiss();
        }
        finalImageUrls = uploadedImageUrls;
      }

      const payload = {
        ...formData,
        price: Number(formData.price),
        totalRooms: formData.propertyType === 'Room' ? 1 : Number(formData.totalRooms),
        availableRooms: formData.propertyType === 'Room' ? 1 : Number(formData.availableRooms),
        maxOccupantsPerRoom: Number(formData.maxOccupantsPerRoom),
        imageUrls: finalImageUrls
      };

      const response = await axios.put(`http://localhost:5000/api/boardings/${id}`, payload);
      
      if (response.data && response.data.success) {
        toast.success('Boarding place updated successfully!');
        
        // Redirect back to all boardings after a short delay
        setTimeout(() => {
          navigate('/admin/allboardings');
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update boarding place");
    } finally {
      toast.dismiss();
      setLoading(false);
    }
  };

  const SectionTitle = ({ children, icon }) => (
    <h4 className="fw-bold text-dark mt-5 mb-4 border-bottom pb-2 d-flex align-items-center gap-2">
      {icon && <i className={`bi ${icon} text-primary`}></i>}
      {children}
    </h4>
  );

  if (fetching) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5 font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Toaster position="top-center" />
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10 col-xxl-9">
            
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-header bg-white border-bottom-0 py-4 px-4 px-md-5 pt-5 pb-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <h2 className="fw-bolder text-dark mb-0 d-flex align-items-center gap-3">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                        <i className="bi bi-pencil-square fs-4"></i>
                    </div>
                    Edit Boarding Place
                    </h2>
                    <Link to="/admin/allboardings" className="btn btn-outline-secondary rounded-pill fw-medium">
                        <i className="bi bi-arrow-left me-2"></i>Back to List
                    </Link>
                </div>
                <p className="text-secondary mb-0 ms-5 ps-3">Modify the details of the existing property.</p>
              </div>

              <div className="card-body px-4 px-md-5 py-4 bg-white">
                <form onSubmit={handleSubmit} className="needs-validation">
                  
                  {/* Basic Info */}
                  <SectionTitle icon="bi-info-circle">Basic Information</SectionTitle>
                  <div className="row g-4">
                    <div className="col-12">
                      <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Property Title</label>
                      <input type="text" name="title" value={formData.title} onChange={handleChange} required className="form-control form-control-lg bg-light border-0 shadow-sm" placeholder="E.g., Boys Boarding Near NSBM" />
                    </div>
                    
                    <div className="col-12">
                      <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Description</label>
                      <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="form-control form-control-lg bg-light border-0 shadow-sm" placeholder="Describe the boarding place, surroundings, and house rules..." />
                    </div>
                    
                    <div className="col-md-8">
                      <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Price / Month</label>
                      <div className="input-group input-group-lg shadow-sm">
                        <span className="input-group-text bg-white text-secondary border-0 border-end" style={{ borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem' }}>₨</span>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required className="form-control bg-light border-0" placeholder="18000" />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Currency</label>
                      <input type="text" name="currency" value={formData.currency} onChange={handleChange} className="form-control form-control-lg bg-light border-0 shadow-sm" placeholder="LKR" />
                    </div>
                  </div>

                  {/* Location Info */}
                  <SectionTitle icon="bi-geo-alt">Location Details</SectionTitle>
                  <div className="row g-4">
                    <div className="col-12">
                      <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Full Address</label>
                      <input type="text" name="address" value={formData.address} onChange={handleChange} required className="form-control form-control-lg bg-light border-0 shadow-sm" placeholder="123 High Level Road" />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">City</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} required className="form-control form-control-lg bg-light border-0 shadow-sm" placeholder="Homagama" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">District</label>
                      <input type="text" name="district" value={formData.district} onChange={handleChange} required className="form-control form-control-lg bg-light border-0 shadow-sm" placeholder="Colombo" />
                    </div>
                  </div>

                  {/* Property Specs */}
                  <SectionTitle icon="bi-building">Room & Occupancy Details</SectionTitle>
                  <div className="row g-4">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Property Type</label>
                        <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="form-select form-select-lg bg-light border-0 shadow-sm">
                            <option value="Room">Room</option>
                            <option value="House">House</option>
                            <option value="Apartment">Apartment</option>
                        </select>
                      </div>
                      
                      {formData.propertyType !== 'Room' && (
                        <>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Total Rooms</label>
                            <input type="number" name="totalRooms" value={formData.totalRooms} onChange={handleChange} required className="form-control form-control-lg bg-light border-0 shadow-sm" placeholder="4" />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Available Rooms</label>
                            <input type="number" name="availableRooms" value={formData.availableRooms} onChange={handleChange} required className="form-control form-control-lg bg-light border-0 shadow-sm" placeholder="2" />
                          </div>
                        </>
                      )}

                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Max Occupants Per Room</label>
                        <input type="number" name="maxOccupantsPerRoom" value={formData.maxOccupantsPerRoom} onChange={handleChange} required className="form-control form-control-lg bg-light border-0 shadow-sm" placeholder="2" />
                      </div>
                  </div>

                  {/* Amenities */}
                  <SectionTitle icon="bi-stars">Amenities & Inclusions</SectionTitle>
                  <div className="bg-light p-4 rounded-4 shadow-sm">
                    <div className="row g-3">
                      {['attachedBathroom', 'furnished', 'wifi', 'parking', 'kitchen', 'laundry', 'waterIncluded', 'electricityIncluded', 'smokingAllowed', 'petsAllowed'].map(field => (
                        <div key={field} className="col-sm-6 col-lg-4">
                          <div className="form-check form-switch p-0 d-flex align-items-center gap-3 bg-white p-3 rounded-3 shadow-sm" style={{ border: '1px solid #f0f0f0' }}>
                            <input 
                              type="checkbox" 
                              role="switch"
                              name={field} 
                              checked={formData[field]} 
                              onChange={handleChange} 
                              className="form-check-input m-0 ms-2"
                              style={{ width: '2.5em', height: '1.25em', cursor: 'pointer' }}
                            />
                            <label className="form-check-label text-dark fw-medium" style={{ cursor: 'pointer' }}>
                              {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preferences & Status */}
                  <SectionTitle icon="bi-check2-circle">Preferences & Status</SectionTitle>
                  <div className="row g-4">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Gender Preference</label>
                        <select name="genderPreference" value={formData.genderPreference} onChange={handleChange} className="form-select form-select-lg bg-light border-0 shadow-sm">
                            <option value="Male">Male Only</option>
                            <option value="Female">Female Only</option>
                            <option value="Any">Anyone</option>
                        </select>
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Availability Status</label>
                        <select name="availabilityStatus" value={formData.availabilityStatus} onChange={handleChange} className="form-select form-select-lg bg-light border-0 shadow-sm" style={{ fontWeight: 500 }}>
                            <option value="Available">Available</option>
                            <option value="Full">Full</option>
                            <option value="Under Maintenance">Under Maintenance</option>
                        </select>
                      </div>
                  </div>

                  {/* Contact Info */}
                  <SectionTitle icon="bi-telephone">Contact Details</SectionTitle>
                  <div className="row g-4">
                      <div className="col-md-4">
                          <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Owner Name</label>
                          <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required minLength={3} className="form-control form-control-lg bg-light border-0 shadow-sm" placeholder="Nimal Perera" />
                      </div>
                      <div className="col-md-4">
                          <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Contact Number</label>
                          <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required minLength={10} maxLength={12} className="form-control form-control-lg bg-light border-0 shadow-sm" placeholder="0771234567" />
                      </div>
                      <div className="col-md-4">
                          <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">Email Address</label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-control form-control-lg bg-light border-0 shadow-sm" placeholder="nimal@example.com" />
                      </div>
                  </div>

                  {/* Images */}
                  <SectionTitle icon="bi-images">Property Images</SectionTitle>
                  <div className="bg-light border border-2 border-primary border-dashed rounded-4 p-5 text-center position-relative" style={{ borderStyle: 'dashed !important', transition: 'all 0.3s' }}>
                    <i className="bi bi-cloud-arrow-up display-4 text-primary opacity-50 mb-3"></i>
                    <h5 className="fw-bold text-dark">Update property images</h5>
                    <p className="text-secondary small mb-4">Select new images ONLY if you want to replace the existing ones.</p>
                    
                    <div>
                      <label className="btn btn-outline-primary btn-lg px-5 rounded-pill shadow-sm" style={{ cursor: 'pointer' }}>
                        <i className="bi bi-folder2-open me-2"></i> Browse Files
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="d-none" />
                      </label>
                    </div>
                    
                    {images.length > 0 ? (
                       <div className="mt-4 d-inline-block bg-white text-primary px-4 py-2 rounded-pill shadow-sm fw-bold border border-primary-subtle">
                         <i className="bi bi-check-circle-fill me-2"></i>
                         {images.length} new image{images.length !== 1 && 's'} selected to replace old
                       </div>
                    ) : existingImages.length > 0 ? (
                      <div className="mt-4 text-secondary small">
                        {existingImages.length} existing image{existingImages.length !== 1 ? 's' : ''} saved. Leave unchanged to keep them.
                      </div>
                    ) : null}
                  </div>

                  {/* Submit */}
                  <div className="mt-5 pt-4 border-top">
                    <button 
                      type="submit" 
                      disabled={loading} 
                      className={`btn btn-primary btn-lg w-100 py-3 rounded-4 shadow-sm fw-bold fs-5 ${loading ? 'opacity-75' : ''}`}
                      style={{ transition: 'all 0.3s' }}
                    >
                      {loading ? (
                        <div className="d-flex align-items-center justify-content-center gap-3">
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          Saving Changes...
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <i className="bi bi-save-fill"></i> Save Changes
                        </div>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditBoarding;
