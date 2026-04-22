import { useState } from 'react';
import { QRCodeCanvas } from '../../../node_modules/qrcode.react/lib/esm/index.js';

function BookingsTab({ myBookings, currentUser, formatDate, onCancelBooking }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterArea, setFilterArea] = useState('all');
  const [sort, setSort] = useState('newest');
  const [selectedBooking, setSelectedBooking] = useState(null);

  let displayBookings = [...myBookings];

  // Filter by Status
  if (filterStatus !== 'all') {
    displayBookings = displayBookings.filter(b => {
      const bookingEnd = new Date(`${b.date}T${b.endTime || '23:59'}`);
      const isExpired = bookingEnd < new Date();
      const isCancelled = b.status === 'cancelled';
      if (filterStatus === 'active') return !isCancelled && !isExpired;
      if (filterStatus === 'completed') return isExpired && !isCancelled;
      if (filterStatus === 'cancelled') return isCancelled;
      return true;
    });
  }

  // Filter by Area
  if (filterArea !== 'all') {
    displayBookings = displayBookings.filter(b => b.area === filterArea);
  }

  // Apply Sort
  if (sort === 'oldest') {
    displayBookings.reverse();
  }

  const uniqueAreas = [...new Set(myBookings.map(b => b.area))];

  const to12h = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h, 10);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    return `${hr % 12 || 12}:${m} ${ampm}`;
  };

  return (
    <div className="dashboard-card">
      <div className="dashboard-card__header">
        <h2>My Booked Seats</h2>
        <span className="dashboard-badge">{displayBookings.length} Total</span>
      </div>
      <div style={{ padding: '15px', background: '#f6f8fa', borderBottom: '1px solid #e1e4e8', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', flex: 1, minWidth: '150px' }}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={filterArea} onChange={e => setFilterArea(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', flex: 1, minWidth: '150px', textTransform: 'capitalize' }}>
          <option value="all">All Areas</option>
          {uniqueAreas.map(area => <option key={area} value={area}>{area}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', flex: 1, minWidth: '150px' }}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
      <div className="table-responsive">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>QR Code</th>
              <th>Date</th>
              <th>Time</th>
              <th style={{ minWidth: '160px' }}>Area ID</th>
              <th>Seats</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayBookings.length === 0 ? (
              <tr><td colSpan="7" className="empty-row">No bookings found matching your filters</td></tr>
            ) : (
              displayBookings.map(booking => {
                const bookingEnd = new Date(`${booking.date}T${booking.endTime || '23:59'}`);
                const isExpired = bookingEnd < new Date();
                const isCancelled = booking.status === 'cancelled';

                const getStatusLabel = () => {
                  if (isCancelled) return 'Cancelled';
                  if (isExpired) return 'Completed';
                  return 'Active';
                };
                const getStatusStyle = () => {
                  if (isCancelled) return { background: '#f8d7da', color: '#721c24' };
                  if (isExpired) return { background: '#e2e3e5', color: '#383d41' };
                  return { background: '#d4edda', color: '#155724' };
                };

                return (
                  <tr key={booking._id} style={isCancelled ? { opacity: 0.65 } : {}}>
                    <td style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setSelectedBooking({ ...booking, isExpired, isCancelled, to12h, getStatusLabel })} title="View QR">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="14" width="3" height="3" />
                        <line x1="21" y1="14" x2="21" y2="21" />
                        <line x1="14" y1="21" x2="21" y2="21" />
                      </svg>
                    </td>
                    <td><strong>{formatDate(booking.date)}</strong></td>
                    <td>{to12h(booking.time)}{booking.endTime ? ` - ${to12h(booking.endTime)}` : ''}</td>
                    <td><span className="level-tag" style={{textTransform: 'capitalize'}}>{booking.area}</span></td>
                    <td>{booking.seats.join(', ')}</td>
                    <td>
                      <span className="role-tag" style={getStatusStyle()}>
                        {getStatusLabel()}
                      </span>
                    </td>
                    <td>
                      {!isCancelled && !isExpired ? (
                        <button
                          onClick={() => onCancelBooking(booking._id)}
                          style={{ padding: '5px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                        >
                          Cancel
                        </button>
                      ) : (
                        <span style={{ color: '#999', fontSize: '12px' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedBooking && (
        <div onClick={() => setSelectedBooking(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '12px', padding: '30px', maxWidth: '350px', width: '90%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginBottom: '5px', color: '#24292e' }}>Booking QR Code</h3>
            <p style={{ fontSize: '13px', color: '#586069', marginBottom: '20px' }}>Scan with your phone camera</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <QRCodeCanvas
                id="qr-code-canvas"
                value={`UniHelp Booking\nStudent: ${currentUser?.name || 'N/A'}\nArea: ${selectedBooking.area}\nDate: ${selectedBooking.date}\nTime: ${selectedBooking.to12h(selectedBooking.time)} - ${selectedBooking.to12h(selectedBooking.endTime)}\nSeats: ${selectedBooking.seats.join(', ')}\nStatus: ${selectedBooking.getStatusLabel()}`}
                size={200}
                level="M"
              />
            </div>
            <div style={{ marginTop: '20px', fontSize: '14px', textAlign: 'left', background: '#f6f8fa', padding: '12px', borderRadius: '8px', lineHeight: '1.8' }}>
              <div><strong>Student:</strong> {currentUser?.name}</div>
              <div><strong>Area:</strong> <span style={{ textTransform: 'capitalize' }}>{selectedBooking.area}</span></div>
              <div><strong>Date:</strong> {formatDate(selectedBooking.date)}</div>
              <div><strong>Time:</strong> {selectedBooking.to12h(selectedBooking.time)} - {selectedBooking.to12h(selectedBooking.endTime)}</div>
              <div><strong>Seats:</strong> {selectedBooking.seats.join(', ')}</div>
              <div><strong>Status:</strong> {selectedBooking.getStatusLabel()}</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button onClick={() => {
                const canvas = document.getElementById("qr-code-canvas");
                if (!canvas) return;
                const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                const a = document.createElement("a");
                a.href = pngUrl;
                a.download = "unihelp-booking-qr.png";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }} style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Download QR</button>
              <button onClick={() => setSelectedBooking(null)} style={{ padding: '10px 30px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingsTab;
