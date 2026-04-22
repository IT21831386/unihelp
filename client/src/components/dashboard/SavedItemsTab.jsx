import { Link } from 'react-router-dom';

function SavedItemsTab({ savedMarketplaceItems, onUnsaveItem, currentUser }) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card__header">
        <h2>My Saved Items</h2>
        <span className="dashboard-badge">{savedMarketplaceItems.length} Total</span>
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
            {savedMarketplaceItems.length === 0 ? (
              <tr><td colSpan="6" className="empty-row">No saved items yet. Browse the marketplace and save some!</td></tr>
            ) : (
              savedMarketplaceItems.map(item => (
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
                      {item.status === 'active' ? 'Active' : 'Sold'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/marketplace/item/${item._id}`} className="dashboard-link">View</Link>
                      <button 
                        onClick={() => onUnsaveItem(item._id)}
                        style={{ background: '#cb2431', color: '#fff', border: 'none', borderRadius: '4px', padding: '5px 10px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SavedItemsTab;
