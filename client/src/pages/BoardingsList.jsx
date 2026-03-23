import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, SlidersHorizontal, MapPin, X } from 'lucide-react';
import BoardingCard from '../components/BoardingCard';

const BoardingsList = () => {
  const [boardings, setBoardings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [propertyType, setPropertyType] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');
  const [amenities, setAmenities] = useState({
    wifi: false,
    attachedBathroom: false,
    parking: false,
    furnished: false,
  });

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetchBoardings();
  }, []);

  const fetchBoardings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/boardings');
      if (response.data && response.data.success) {
        setBoardings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching boardings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAmenityChange = (e) => {
    setAmenities({
      ...amenities,
      [e.target.name]: e.target.checked
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPropertyType('All');
    setMaxPrice('');
    setAmenities({ wifi: false, attachedBathroom: false, parking: false, furnished: false });
  };

  // Filter Logic
  const filteredBoardings = boardings.filter(b => {
    // 1. Search Query (Location, Title, City)
    const matchesSearch = searchQuery === '' || 
      b.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Property Type
    const matchesType = propertyType === 'All' || b.propertyType === propertyType;
    
    // 3. Max Price
    const matchesPrice = maxPrice === '' || b.price <= Number(maxPrice);
    
    // 4. Amenities
    const matchesWifi = !amenities.wifi || b.wifi;
    const matchesBathroom = !amenities.attachedBathroom || b.attachedBathroom;
    const matchesParking = !amenities.parking || b.parking;
    const matchesFurnished = !amenities.furnished || b.furnished;

    return matchesSearch && matchesType && matchesPrice && matchesWifi && matchesBathroom && matchesParking && matchesFurnished;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full max-w-2xl mx-auto flex items-center">
              <div className="absolute left-4 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Search by city, district, or address..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100/50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
              />
              <button 
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden ml-3 p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                aria-label="Open Filters"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
            
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters (Desktop) */}
        <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-white shadow-2xl lg:shadow-none lg:bg-transparent lg:border-none lg:w-64 lg:static lg:block transform transition-transform duration-300 ease-in-out ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="h-full flex flex-col pt-5 pb-4 overflow-y-auto lg:h-auto lg:pt-0 lg:pb-0 lg:overflow-visible">
            
            <div className="px-6 lg:px-0 flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                <Filter className="w-5 h-5 text-blue-600" />
                Filters
              </div>
              <button onClick={() => setIsMobileFiltersOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 lg:px-0 space-y-8">
              {/* Property Type */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Property Type</h3>
                <div className="space-y-3">
                  {['All', 'Room', 'House', 'Apartment'].map(type => (
                    <label key={type} className="flex items-center cursor-pointer group">
                      <input 
                        type="radio" 
                        name="propertyType" 
                        value={type}
                        checked={propertyType === type}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Max Price (LKR)</h3>
                 <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₨</span>
                  <input 
                    type="number" 
                    placeholder="Any price" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Must Include</h3>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer group">
                    <input type="checkbox" name="wifi" checked={amenities.wifi} onChange={handleAmenityChange} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                    <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">WiFi access</span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input type="checkbox" name="attachedBathroom" checked={amenities.attachedBathroom} onChange={handleAmenityChange} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                    <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">Attached Bathroom</span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input type="checkbox" name="parking" checked={amenities.parking} onChange={handleAmenityChange} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                    <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">Parking Space</span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input type="checkbox" name="furnished" checked={amenities.furnished} onChange={handleAmenityChange} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                    <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">Fully Furnished</span>
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="border-t border-gray-200 pt-6">
                 <button 
                  onClick={clearFilters}
                  className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear all filters
                </button>
              </div>

            </div>
          </div>
        </aside>

        {/* Mobile filter backdrop */}
        {isMobileFiltersOpen && (
          <div 
            className="fixed inset-0 bg-gray-900/50 z-20 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
          ></div>
        )}

        {/* Results Grid */}
        <main className="flex-1 w-full min-w-0">
          <div className="mb-6 flex items-end justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {filteredBoardings.length} {filteredBoardings.length === 1 ? 'place' : 'places'} found
            </h1>
          </div>
          
          {loading ? (
             <div className="w-full h-64 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-medium">Loading amazing places...</p>
             </div>
          ) : filteredBoardings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBoardings.map(boarding => (
                <div key={boarding._id || boarding.id || Math.random()} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
                    <BoardingCard boarding={boarding} />
                </div>
              ))}
            </div>
          ) : (
             <div className="w-full h-auto py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-300 text-center px-4">
                <MapPin className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No places found</h3>
                <p className="text-gray-500 max-w-sm mb-6">We couldn't find any boarding places matching your exact search and filters.</p>
                <button 
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Clear filters and try again
                </button>
             </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BoardingsList;
