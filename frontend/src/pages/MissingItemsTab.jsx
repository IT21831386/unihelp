import React, { useState, useEffect } from 'react';
import api from '../api';
import LostFoundForm from '../components/LostFoundForm';
import { Search, Package, Phone, MapPin, Calendar, Clock } from 'lucide-react';

const MissingItemsTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formType, setFormType] = useState(null); // 'lost', 'found', or null
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notices');
      const today = new Date().toISOString().split('T')[0];
      
      // Filter for Missing/Lost/Found Items AND exclude Archived/Expired
      const missingItems = res.data.filter(n => 
        (n.category === 'Missing Items' || 
         n.category === 'Lost Item' || 
         n.category === 'Found Item') &&
        !n.isArchived &&
        (!n.expiryDate || n.expiryDate >= today)
      );
      setItems(missingItems);
    } catch (err) {
      console.error('Failed to fetch items', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (formData) => {
    try {
      setSubmitting(true);
      await api.post('/notices', formData);
      setFormType(null);
      fetchItems();
      showToast(`${formData.category} reported successfully!`, 'success');
    } catch (err) {
      console.error('Failed to report item', err);
      showToast('Failed to report item.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const [activeFilter, setActiveFilter] = useState('all');

  const filteredItems = items.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'lost') return item.category === 'Lost Item';
    if (activeFilter === 'found') return item.category === 'Found Item';
    return true;
  });

  return (
    <div style={{ padding: '1rem 0' }}>
      {toast.message && (
        <div className={`alert alert-${toast.type}`} style={{ zIndex: 9999 }}>
          {toast.message}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', letterSpacing: '-0.5px' }}>Lost & Found Items</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Bringing items back to their rightful owners.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setFormType(formType === 'lost' ? null : 'lost')}
            style={{ 
              padding: '0.8rem 1.5rem', 
              fontSize: '1rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '800',
              backgroundColor: formType === 'lost' ? '#991b1b' : '#ef4444',
              color: '#fff',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.25)',
              transition: 'all 0.2s'
            }}
          >
            <Search size={20} />
            {formType === 'lost' ? 'Cancel' : 'Report Lost Item'}
          </button>
          
          <button 
            onClick={() => setFormType(formType === 'found' ? null : 'found')}
            style={{ 
              padding: '0.8rem 1.5rem', 
              fontSize: '1rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '800',
              backgroundColor: formType === 'found' ? '#065f46' : '#10b981',
              color: '#fff',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)',
              transition: 'all 0.2s'
            }}
          >
            <Package size={20} />
            {formType === 'found' ? 'Cancel' : 'Report Found Item'}
          </button>
        </div>
      </div>

      {formType && (
        <div style={{ marginBottom: '5rem' }}>
          <LostFoundForm 
            type={formType}
            onSubmit={handleCreateItem}
            onCancel={() => setFormType(null)}
            isLoading={submitting}
          />
        </div>
      )}

      {/* Filter Bar */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2.5rem', 
        padding: '0.5rem', 
        background: '#f1f5f9', 
        borderRadius: '16px', 
        width: 'fit-content' 
      }}>
        {[
          { id: 'all', label: 'All Items', color: '#64748b' },
          { id: 'lost', label: 'Lost Only', color: '#ef4444' },
          { id: 'found', label: 'Found Only', color: '#10b981' }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem',
              transition: 'all 0.2s',
              backgroundColor: activeFilter === f.id ? f.color : 'transparent',
              color: activeFilter === f.id ? '#ffffff' : '#64748b',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
          <div className="spinner" style={{ width: '50px', height: '50px', borderColor: '#e2e8f0', borderTopColor: '#f59e0b' }}></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #cbd5e1' }}>
          <h3 style={{ color: '#64748b', fontSize: '1.2rem' }}>
            {activeFilter === 'all' 
              ? 'No items reported in the community board yet.' 
              : `No ${activeFilter} items found.`}
          </h3>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
          gap: '2.5rem' 
        }}>
          {filteredItems.map((item) => {
            const isLost = item.category === 'Lost Item';
            const themeColor = isLost ? '#ef4444' : '#10b981';
            
            return (
              <div key={item._id} style={{ 
                background: '#ffffff', 
                borderRadius: '20px', 
                padding: '2rem', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.04)', 
                border: `1px solid ${themeColor}20`,
                borderTop: `6px solid ${themeColor}`,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.2s'
              }}>
                
                <div style={{ 
                  position: 'absolute', 
                  top: '1.2rem', 
                  right: '1.2rem', 
                  backgroundColor: themeColor, 
                  color: '#fff', 
                  padding: '4px 14px', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem', 
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {isLost ? 'Lost' : 'Found'}
                </div>

                {item.attachments && item.attachments !== 'none' && (
                  <div style={{ width: '100%', height: '180px', marginBottom: '1.5rem', overflow: 'hidden', borderRadius: '14px' }}>
                    <img 
                      src={item.attachments} 
                      alt="Item" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}

                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.2rem', lineHeight: '1.3' }}>
                  {item.title}
                </h3>
                
                <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem', flex: '1' }}>
                  {item.description}
                </p>

                <div style={{ 
                  background: '#f8fafc', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.8rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.9rem' }}>
                    <MapPin size={16} color={themeColor} />
                    <strong>Location:</strong> {item.location || 'Not specified'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.9rem' }}>
                    <Calendar size={16} color={themeColor} />
                    <strong>Date:</strong> {item.date}
                  </div>
                  {item.time && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.9rem' }}>
                      <Clock size={16} color={themeColor} />
                      <strong>Time:</strong> {item.time}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1.2rem', borderTop: '2px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: themeColor + '15', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <Phone size={20} color={themeColor} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Contact Info</div>
                    <div style={{ color: '#1e293b', fontSize: '1.05rem', fontWeight: '800' }}>{item.audience || 'Campus Security'}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MissingItemsTab;
