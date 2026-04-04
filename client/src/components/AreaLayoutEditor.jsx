import { useState } from 'react';

function RowEditor({ rowSeats, onUpdateRow, onRemoveRow }) {
  const [newSeat, setNewSeat] = useState('');

  const handleAddSeat = (e) => {
    e.preventDefault();
    if (newSeat.trim()) {
      onUpdateRow([...rowSeats, newSeat.trim()]);
      setNewSeat('');
    }
  };

  const removeSeat = (sIdx) => {
    const next = [...rowSeats];
    next.splice(sIdx, 1);
    onUpdateRow(next);
  };

  return (
    <div style={{ padding: '10px', background: '#fafbfc', border: '1px solid #e1e4e8', borderRadius: '6px', marginBottom: '8px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
        {rowSeats.map((seat, sIdx) => (
          <div key={sIdx} style={{ display: 'flex', alignItems: 'center', background: '#0366d6', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '13px' }}>
            <span>{seat}</span>
            <button onClick={() => removeSeat(sIdx)} style={{ background: 'transparent', color: '#fff', border: 'none', marginLeft: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>&times;</button>
          </div>
        ))}
        {rowSeats.length === 0 && <span style={{ fontSize: '12px', color: '#6a737d' }}>No seats in this row</span>}
      </div>
      <form onSubmit={handleAddSeat} style={{ display: 'flex', gap: '8px' }}>
        <input 
          value={newSeat}
          onChange={(e) => setNewSeat(e.target.value)}
          placeholder="New seat label..."
          style={{ width: '130px', padding: '6px 8px', border: '1px solid #e1e4e8', borderRadius: '4px', fontSize: '13px' }}
        />
        <button type="submit" style={{ padding: '6px 10px', background: '#e1e4e8', color: '#24292e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Add</button>
        <button type="button" onClick={onRemoveRow} style={{ padding: '6px 10px', background: '#ffeef0', color: '#cb2431', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Remove Row</button>
      </form>
    </div>
  );
}

function AreaLayoutEditor({ initialConfig, onSave }) {
  const [layout, setLayout] = useState(() => {
    if (!initialConfig) return { left: [], right: [] };
    return JSON.parse(JSON.stringify(initialConfig));
  });

  const handleTableChange = (col, tIdx, field, value) => {
    const newLayout = { ...layout };
    newLayout[col][tIdx][field] = value;
    setLayout(newLayout);
  };

  const handleRowChange = (col, tIdx, rIdx, newRowArr) => {
    const newLayout = { ...layout };
    newLayout[col][tIdx].rows[rIdx] = newRowArr;
    setLayout(newLayout);
  };

  const addRow = (col, tIdx) => {
    const newLayout = { ...layout };
    newLayout[col][tIdx].rows.push([]);
    setLayout(newLayout);
  };

  const removeRow = (col, tIdx, rIdx) => {
    const newLayout = { ...layout };
    newLayout[col][tIdx].rows.splice(rIdx, 1);
    setLayout(newLayout);
  };

  const addTable = (col) => {
    const newLayout = { ...layout };
    if (!newLayout[col]) newLayout[col] = [];
    newLayout[col].push({ id: `T_${Math.floor(Math.random()*1000)}`, label: 'New Table', rows: [[]] });
    setLayout(newLayout);
  };

  const removeTable = (col, tIdx) => {
    const newLayout = { ...layout };
    newLayout[col].splice(tIdx, 1);
    setLayout(newLayout);
  };

  const renderColumn = (col) => (
    <div style={{ flex: 1, minWidth: 0, padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e1e4e8' }}>
      <h4 style={{ textTransform: 'capitalize', marginBottom: '15px', color: '#333' }}>{col} Column</h4>
      {(layout[col] || []).map((table, tIdx) => (
        <div key={tIdx} style={{ background: '#fff', border: '1px solid #d1d5da', padding: '15px', marginBottom: '15px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', color: '#586069' }}>Table ID</label>
              <input 
                value={table.id} 
                onChange={(e) => handleTableChange(col, tIdx, 'id', e.target.value)} 
                style={{ width: '100%', padding: '8px', border: '1px solid #e1e4e8', borderRadius: '4px' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', color: '#586069' }}>Table Label</label>
              <input 
                value={table.label} 
                onChange={(e) => handleTableChange(col, tIdx, 'label', e.target.value)} 
                style={{ width: '100%', padding: '8px', border: '1px solid #e1e4e8', borderRadius: '4px' }}
              />
            </div>
            <button onClick={() => removeTable(col, tIdx)} style={{ alignSelf: 'flex-end', padding: '8px 12px', background: '#cb2431', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
          </div>
          
          <div style={{ paddingLeft: '15px', borderLeft: '3px solid #e1e4e8' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#24292e', display: 'block', marginBottom: '8px' }}>Rows</label>
            {table.rows.map((row, rIdx) => (
              <RowEditor 
                key={rIdx} 
                rowSeats={row} 
                onUpdateRow={(newArr) => handleRowChange(col, tIdx, rIdx, newArr)} 
                onRemoveRow={() => removeRow(col, tIdx, rIdx)}
              />
            ))}
            <button onClick={() => addRow(col, tIdx)} style={{ marginTop: '5px', fontSize: '12px', padding: '6px 12px', background: '#f1f8ff', color: '#0366d6', border: '1px solid #c8e1ff', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>+ Add Row</button>
          </div>
        </div>
      ))}
      <button onClick={() => addTable(col)} style={{ width: '100%', padding: '10px', cursor: 'pointer', background: '#fff', color: '#0366d6', border: '1px dashed #0366d6', borderRadius: '6px', fontWeight: 'bold' }}>
        + Add Table to {col}
      </button>
    </div>
  );

  return (
    <div className="area-layout-editor" style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'nowrap' }}>
        {renderColumn('left')}
        {renderColumn('right')}
      </div>
      <button 
        onClick={() => onSave(layout)}
        style={{ padding: '12px 24px', fontSize: '15px', fontWeight: 'bold', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', margin: '0 auto', boxShadow: '0 4px 6px rgba(40,167,69,0.3)' }}
      >
        Save Layout
      </button>
    </div>
  );
}

export default AreaLayoutEditor;
