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
    title: '', description: '', price: '', currency: 'LKR', address: '', city: '', district: '', propertyType: 'Room', totalRooms: '', availableRooms: '', maxOccupantsPerRoom: '', attachedBathroom: false, furnished: false, wifi: false, parking: false, kitchen: false, laundry: false, waterIncluded: false, electricityIncluded: false, genderPreference: 'Any', smokingAllowed: false, petsAllowed: false, availabilityStatus: 'Available', ownerName: '', contactNumber: '', email: ''
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
      const uploadedImageUrls = [];
      for (const image of images) {
        toast.loading(`Uploading ${image.name}...`);
        const url = await MediaUpload(image);
        uploadedImageUrls.push(url);
        toast.dismiss();
      }

      const payload = {
        ...formData,
        price: Number(formData.price),
        totalRooms: Number(formData.totalRooms),
        availableRooms: Number(formData.availableRooms),
        maxOccupantsPerRoom: Number(formData.maxOccupantsPerRoom),
        imageUrls: uploadedImageUrls
      };

      const response = await axios.post('http://localhost:5000/api/boardings', payload);
      
      if (response.data.success) {
        toast.success("Boarding place added successfully!");
        setFormData({
            title: '', description: '', price: '', currency: 'LKR', address: '', city: '', district: '', propertyType: 'Room', totalRooms: '', availableRooms: '', maxOccupantsPerRoom: '', attachedBathroom: false, furnished: false, wifi: false, parking: false, kitchen: false, laundry: false, waterIncluded: false, electricityIncluded: false, genderPreference: 'Any', smokingAllowed: false, petsAllowed: false, availabilityStatus: 'Available', ownerName: '', contactNumber: '', email: ''
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

  const SectionTitle = ({ children }) => (
    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2 mt-8">
      {children}
    </h3>
  );

  const InputGroup = ({ label, children }) => (
    <div className="flex flex-col gap-1.5 flex-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );

  const inputStyles = "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm";
  const selectStyles = "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer";

  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Add New Boarding Place</h2>
          <p className="text-gray-500 mt-1 text-sm">List a new property for students with complete details and high-quality images.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          
          {/* Basic Info */}
          <SectionTitle>Basic Information</SectionTitle>
          <div className="space-y-5">
            <InputGroup label="Property Title">
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className={inputStyles} placeholder="E.g., Boys Boarding Near NSBM" />
            </InputGroup>
            
            <InputGroup label="Description">
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className={inputStyles} placeholder="Describe the boarding place, surroundings, and house rules..." />
            </InputGroup>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <InputGroup label="Price / Month">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pb-0.5">₨</span>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required className={`${inputStyles} pl-10`} placeholder="18000" />
                </div>
              </InputGroup>
              <InputGroup label="Currency">
                <input type="text" name="currency" value={formData.currency} onChange={handleChange} className={inputStyles} placeholder="LKR" />
              </InputGroup>
            </div>
          </div>

          {/* Location Info */}
          <SectionTitle>Location Details</SectionTitle>
          <div className="space-y-5">
            <InputGroup label="Full Address">
              <input type="text" name="address" value={formData.address} onChange={handleChange} required className={inputStyles} placeholder="123 High Level Road" />
            </InputGroup>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <InputGroup label="City">
                <input type="text" name="city" value={formData.city} onChange={handleChange} required className={inputStyles} placeholder="Homagama" />
              </InputGroup>
              <InputGroup label="District">
                <input type="text" name="district" value={formData.district} onChange={handleChange} required className={inputStyles} placeholder="Colombo" />
              </InputGroup>
            </div>
          </div>

          {/* Property Specs */}
          <SectionTitle>Room & Occupancy Details</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputGroup label="Property Type">
                <div className="relative">
                  <select name="propertyType" value={formData.propertyType} onChange={handleChange} className={selectStyles}>
                      <option value="Room">Room</option>
                      <option value="House">House</option>
                      <option value="Apartment">Apartment</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </InputGroup>
              
              <InputGroup label="Total Rooms">
                <input type="number" name="totalRooms" value={formData.totalRooms} onChange={handleChange} required className={inputStyles} placeholder="4" />
              </InputGroup>

              <InputGroup label="Available Rooms">
                <input type="number" name="availableRooms" value={formData.availableRooms} onChange={handleChange} required className={inputStyles} placeholder="2" />
              </InputGroup>

              <InputGroup label="Max Occupants Per Room">
                <input type="number" name="maxOccupantsPerRoom" value={formData.maxOccupantsPerRoom} onChange={handleChange} required className={inputStyles} placeholder="2" />
              </InputGroup>
          </div>

          {/* Amenities */}
          <SectionTitle>Amenities & Inclusions</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
            {['attachedBathroom', 'furnished', 'wifi', 'parking', 'kitchen', 'laundry', 'waterIncluded', 'electricityIncluded', 'smokingAllowed', 'petsAllowed'].map(field => (
              <label key={field} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name={field} 
                  checked={formData[field]} 
                  onChange={handleChange} 
                  className="w-5 h-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-colors"
                />
                <span className="text-gray-700 text-sm font-medium group-hover:text-gray-900 transition-colors select-none">
                  {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
              </label>
            ))}
          </div>

          {/* Preferences & Status */}
          <SectionTitle>Preferences & Status</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputGroup label="Gender Preference">
                <div className="relative">
                  <select name="genderPreference" value={formData.genderPreference} onChange={handleChange} className={selectStyles}>
                      <option value="Male">Male Only</option>
                      <option value="Female">Female Only</option>
                      <option value="Any">Anyone</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 pointer-events-none"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></div>
                </div>
              </InputGroup>
              
              <InputGroup label="Availability Status">
                 <div className="relative">
                  <select name="availabilityStatus" value={formData.availabilityStatus} onChange={handleChange} className={selectStyles}>
                      <option value="Available">Available</option>
                      <option value="Full">Full</option>
                      <option value="Under Maintenance">Under Maintenance</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 pointer-events-none"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></div>
                </div>
              </InputGroup>
          </div>

          {/* Contact Info */}
          <SectionTitle>Contact Details</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <InputGroup label="Owner Name">
                  <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required className={inputStyles} placeholder="Nimal Perera" />
              </InputGroup>
              <InputGroup label="Contact Number">
                  <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required className={inputStyles} placeholder="0771234567" />
              </InputGroup>
               <InputGroup label="Email Address">
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputStyles} placeholder="nimal@example.com" />
              </InputGroup>
          </div>

          {/* Images */}
          <SectionTitle>Property Images</SectionTitle>
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl px-6 py-10 text-center hover:bg-gray-100 transition-colors">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
            </svg>
            <div className="flex text-sm text-gray-600 justify-center">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 px-3 py-1 border border-gray-200 shadow-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500">
                <span>Upload files</span>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} required={images.length === 0} className="sr-only" />
              </label>
              <p className="pl-2 pt-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, WEBP up to 5MB each</p>
            {images.length > 0 && (
               <div className="mt-4 inline-block bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
                 {images.length} image{images.length !== 1 && 's'} selected
               </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-6 mt-8 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center text-lg font-semibold text-white shadow-sm transition-all duration-200
                ${loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-[0.99]'}
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </>
              ) : (
                'Publish Boarding Place'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminAddBoarding;
