import { useState } from 'react';
import { Link } from 'react-router-dom';

function MarketplaceTab({ marketplaceItems, onDeleteItem, onUpdateItem, formatDate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  const filteredItems = marketplaceItems.filter(item =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updated = await onUpdateItem(editingItem);
    if (updated) setEditingItem(null);
  };

  return (
    <div className="dashboard-card">
      <div className="dashboard-card__header">
        <h2>Marketplace Management</h2>
        <span className="dashboard-badge">{filteredItems.length} Items</span>
      </div>
      <div style={{ padding: '15px', background: 'rgba(255, 255, 255, 0.3)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <input
          type="text"
          placeholder="Search items by name or category..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', width: '100%', maxWidth: '400px' }}
        />
      </div>
      <div className="table-responsive">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Price (LKR)</th>
              <th>Condition</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr><td colSpan="6" className="empty-row">No marketplace items found</td></tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item._id}>
                  <td><strong>{item.itemName}</strong></td>
                  <td><span className="level-tag">{item.category}</span></td>
                  <td>{item.price?.toLocaleString()}</td>
                  <td>{item.condition}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                      backgroundColor: item.status === 'active' ? '#dcffe4' : '#f6f8fa',
                      color: item.status === 'active' ? '#22863a' : '#586069'
                    }}>
                      {item.status || 'Active'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setEditingItem({ ...item })} title="Edit" style={{ background: '#0366d6', color: '#fff', border: 'none', borderRadius: '4px', padding: '5px 8px', cursor: 'pointer' }}>
                        Edit
                      </button>
                      <button onClick={() => onDeleteItem(item._id)} title="Delete" style={{ background: '#cb2431', color: '#fff', border: 'none', borderRadius: '4px', padding: '5px 8px', cursor: 'pointer' }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingItem && (
        <div onClick={() => setEditingItem(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '12px', padding: '30px', maxWidth: '450px', width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginBottom: '20px' }}>Edit Marketplace Item</h3>
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Item Name</label>
                <input type="text" value={editingItem.itemName} onChange={e => setEditingItem({ ...editingItem, itemName: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Price (LKR)</label>
                <input type="number" value={editingItem.price} onChange={e => setEditingItem({ ...editingItem, price: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Status</label>
                <select value={editingItem.status} onChange={e => setEditingItem({ ...editingItem, status: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px' }}>
                  <option value="active">Active</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setEditingItem(null)} style={{ padding: '8px 15px', background: '#e1e4e8', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 15px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketplaceTab;
