import React, { useState } from 'react';
import axios from 'axios';
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

const AdminAddBoarding = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'LKR',
    address: '',
    city: '',
    district: '',
    propertyType: 'Room',
    totalRooms: '',
    availableRooms: '',
    maxOccupantsPerRoom: '',
    attachedBathroom: false,
    furnished: false,
    wifi: false,
    parking: false,
    kitchen: false,
    laundry: false,
    waterIncluded: false,
    electricityIncluded: false,
    genderPreference: 'Male',
    smokingAllowed: false,
    petsAllowed: false,
    availabilityStatus: 'Available',
    ownerName: '',
    contactNumber: '',
    email: ''
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload Images
      const uploadedImageUrls = [];
      for (const image of images) {
        toast.loading(`Uploading ${image.name}...`);
        const url = await MediaUpload(image);
        uploadedImageUrls.push(url);
        toast.dismiss();
      }

      // 2. Prepare Payload
      const payload = {
        ...formData,
        price: Number(formData.price),
        totalRooms: Number(formData.totalRooms),
        availableRooms: Number(formData.availableRooms),
        maxOccupantsPerRoom: Number(formData.maxOccupantsPerRoom),
        imageUrls: uploadedImageUrls
      };

      // 3. Send to Backend
      const response = await axios.post('http://localhost:5000/api/boardings', payload);
      
      if (response.data.success) {
        toast.success("Boarding place added successfully!");
        // Reset form
        setFormData({
            title: '', description: '', price: '', currency: 'LKR', address: '', city: '', district: '', propertyType: 'Room', totalRooms: '', availableRooms: '', maxOccupantsPerRoom: '', attachedBathroom: false, furnished: false, wifi: false, parking: false, kitchen: false, laundry: false, waterIncluded: false, electricityIncluded: false, genderPreference: 'Male', smokingAllowed: false, petsAllowed: false, availabilityStatus: 'Available', ownerName: '', contactNumber: '', email: ''
        });
        setImages([]);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add boarding place");
    } finally {
      toast.dismiss();
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Toaster />
      <h2>Add New Boarding Place</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
        
        {/* Basic Info */}
        <h3>Basic Information</h3>
        <div>
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label>Price:</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Currency:</label>
            <input type="text" name="currency" value={formData.currency} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
          </div>
        </div>

        {/* Location Info */}
        <h3>Location</h3>
        <div>
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label>City:</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>District:</label>
            <input type="text" name="district" value={formData.district} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
          </div>
        </div>

        {/* Property Specs */}
        <h3>Room & Occupancy Details</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
                <label>Property Type:</label>
                <select name="propertyType" value={formData.propertyType} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                    <option value="Room">Room</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                </select>
            </div>
            <div style={{ flex: 1 }}>
                <label>Total Rooms:</label>
                <input type="number" name="totalRooms" value={formData.totalRooms} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
            </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
                <label>Available Rooms:</label>
                <input type="number" name="availableRooms" value={formData.availableRooms} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
                <label>Max Occupants / Room:</label>
                <input type="number" name="maxOccupantsPerRoom" value={formData.maxOccupantsPerRoom} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
            </div>
        </div>

        {/* Amenities (Booleans) */}
        <h3>Amenities</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {['attachedBathroom', 'furnished', 'wifi', 'parking', 'kitchen', 'laundry', 'waterIncluded', 'electricityIncluded', 'smokingAllowed', 'petsAllowed'].map(field => (
            <label key={field} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input type="checkbox" name={field} checked={formData[field]} onChange={handleChange} />
              {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
          ))}
        </div>

        {/* Preferences & Status */}
        <h3>Preferences & Status</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
                <label>Gender Preference:</label>
                <select name="genderPreference" value={formData.genderPreference} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Any">Any</option>
                </select>
            </div>
            <div style={{ flex: 1 }}>
                <label>Availability Status:</label>
                <select name="availabilityStatus" value={formData.availabilityStatus} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                    <option value="Available">Available</option>
                    <option value="Full">Full</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                </select>
            </div>
        </div>

        {/* Contact Info */}
        <h3>Contact Information</h3>
         <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
                <label>Owner Name:</label>
                <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
                <label>Contact Number:</label>
                <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
            </div>
             <div style={{ flex: 1 }}>
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
            </div>
        </div>

        {/* Images */}
        <h3>Images</h3>
        <div>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} required={images.length === 0} style={{ width: '100%', padding: '8px' }} />
          <small>Select multiple images by holding Ctrl (or Cmd) when clicking.</small>
          {images.length > 0 && <p>{images.length} images selected.</p>}
        </div>

        <button type="submit" disabled={loading} style={{ padding: '12px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}>
          {loading ? 'Adding Boarding Place...' : 'Add Boarding Place'}
        </button>

      </form>
    </div>
  );
};

export default AdminAddBoarding;
