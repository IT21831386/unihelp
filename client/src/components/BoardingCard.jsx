import React from 'react';
import { MapPin, Wifi, Car, Bath, Coffee, CheckCircle2 } from 'lucide-react';

const BoardingCard = ({ boarding }) => {
  // Determine the display image
  const displayImage = boarding.imageUrls && boarding.imageUrls.length > 0 
    ? boarding.imageUrls[0] 
    : 'https://images.unsplash.com/photo-1522771731470-ea44358153a5?q=80&w=2070&auto=format&fit=crop'; // fallback image

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer">
      
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={displayImage} 
          alt={boarding.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md ${
          boarding.availabilityStatus === 'Available' ? 'bg-emerald-500/90 text-white' : 
          boarding.availabilityStatus === 'Full' ? 'bg-red-500/90 text-white' : 
          'bg-amber-500/90 text-white'
        }`}>
          {boarding.availabilityStatus}
        </div>
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md text-gray-800 rounded-full text-xs font-medium shadow-sm">
          {boarding.propertyType}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900 line-clamp-1 flex-1 pr-2" title={boarding.title}>
            {boarding.title}
          </h3>
        </div>

        <div className="flex items-start text-gray-500 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0 text-gray-400" />
          <span className="line-clamp-2">
            {boarding.city}, {boarding.district}
          </span>
        </div>

        <div className="mt-auto">
          {/* Amenities Row */}
          <div className="flex flex-wrap gap-2 mb-4 pt-3 border-t border-gray-100">
            {boarding.wifi && (
              <div className="flex items-center text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md" title="WiFi Included">
                <Wifi className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> WiFi
              </div>
            )}
            {boarding.parking && (
              <div className="flex items-center text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md" title="Parking Available">
                <Car className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Parking
              </div>
            )}
            {boarding.attachedBathroom && (
              <div className="flex items-center text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md" title="Attached Bathroom">
                <Bath className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Bath
              </div>
            )}
            {boarding.kitchen && (
              <div className="flex items-center text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md" title="Kitchen Access">
                <Coffee className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Kitchen
              </div>
            )}
          </div>

          {/* Price & Action */}
          <div className="flex items-end justify-between pt-1">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">Price / month</p>
              <div className="flex items-baseline text-blue-600 group-hover:text-blue-700 transition-colors">
                <span className="text-sm font-semibold mr-1">{boarding.currency === 'LKR' ? '₨' : boarding.currency}</span>
                <span className="text-xl font-bold">{boarding.price.toLocaleString()}</span>
              </div>
            </div>
            <button className="text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white p-2.5 rounded-xl transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardingCard;
