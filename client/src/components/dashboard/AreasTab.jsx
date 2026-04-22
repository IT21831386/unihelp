import { useState } from 'react';
import AreaLayoutEditor from '../AreaLayoutEditor';

function AreasTab({ areas, onAreasChange }) {
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [isAddingArea, setIsAddingArea] = useState(false);
  const [newAreaLabel, setNewAreaLabel] = useState('');
  const [newAreaId, setNewAreaId] = useState('');

  return (
    <div className="dashboard-card">
      <div className="dashboard-card__header">
        <h2>Area Layout Configurations</h2>
      </div>
      <div className="areas-admin-list" style={{ padding: '20px' }}>
        <p>Select an area below to view and edit its layout configuration.</p>

        <div className="dashboard-area-tabs" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
          {areas.map(area => (
            <button
              key={area.categoryId}
              className="dashboard-nav__btn"
              style={{
                background: selectedAreaId === area.categoryId ? 'var(--color-primary)' : '#f8f9fa',
                color: selectedAreaId === area.categoryId ? '#fff' : '#333'
              }}
              onClick={() => setSelectedAreaId(area.categoryId)}
            >
              {area.label}
            </button>
          ))}
          <button
            className="dashboard-nav__btn"
            style={{ background: '#28a745', color: '#fff', fontWeight: 'bold' }}
            onClick={() => setIsAddingArea(true)}
          >
            + Add Area
          </button>
        </div>

        {isAddingArea && (
          <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '20px', background: '#fdfdfd' }}>
            <h3 style={{ marginBottom: '15px' }}>Create New Area</h3>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{display: 'block', fontSize: '13px', marginBottom: '5px'}}>Area Name (Label)</label>
                <input
                  value={newAreaLabel}
                  onChange={e => {
                    setNewAreaLabel(e.target.value);
                    setNewAreaId(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }}
                  placeholder="e.g. Roof Deck"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{display: 'block', fontSize: '13px', marginBottom: '5px'}}>Area ID (No spaces)</label>
                <input
                  value={newAreaId}
                  onChange={e => setNewAreaId(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                  placeholder="e.g. roof-deck"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={async () => {
                  if (!newAreaId || !newAreaLabel) return alert('Fill out both fields');
                  if (areas.find(a => a.categoryId === newAreaId)) return alert('Area ID already exists!');
                  try {
                    const res = await fetch(`http://localhost:5000/api/areas/${newAreaId}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ label: newAreaLabel, layoutConfig: { left: [], right: [] } })
                    });
                    if (res.ok) {
                      const created = await res.json();
                      onAreasChange([...areas, created]);
                      setSelectedAreaId(created.categoryId);
                      setIsAddingArea(false);
                      setNewAreaLabel('');
                      setNewAreaId('');
                    } else {
                      alert('Failed to add area');
                    }
                  } catch(e) { alert(e.message) }
                }}
                style={{ padding: '8px 15px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Create
              </button>
              <button
                onClick={() => setIsAddingArea(false)}
                style={{ padding: '8px 15px', background: '#e1e4e8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {selectedAreaId && (() => {
          const area = areas.find(a => a.categoryId === selectedAreaId);
          if (!area) return null;
          return (
            <div key={area.categoryId} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
              <h3>{area.label} Block Editor</h3>
              <p style={{fontSize: '13px', color: '#666', marginBottom: '10px'}}>Add or remove tables entirely, and list the seat labels within each row to form the room geometry.</p>

              <AreaLayoutEditor
                initialConfig={area.layoutConfig}
                onSave={async (newLayoutConfig) => {
                  try {
                    const res = await fetch(`http://localhost:5000/api/areas/${area.categoryId}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ layoutConfig: newLayoutConfig })
                    });
                    if (res.ok) alert('Saved successfully!');
                    else alert('Failed to save configuration');
                  } catch(e) {
                    alert('Failed to save! ' + e.message);
                  }
                }}
              />
            </div>
          );
        })()}
      </div>
    </div>
  );
}

export default AreasTab;
