import { useState } from 'react';
import { QRCodeCanvas } from '../../../node_modules/qrcode.react/lib/esm/index.js';

function BookingsTab({ myBookings, boardingBookings = [], currentUser, formatDate, onCancelBooking, onCancelBoardingBooking }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterArea, setFilterArea] = useState('all');
  const [sort, setSort] = useState('newest');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedBoardingBooking, setSelectedBoardingBooking] = useState(null);

  // Seat Bookings Logic
  let displayBookings = [...myBookings];
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
  if (filterArea !== 'all') displayBookings = displayBookings.filter(b => b.area === filterArea);
  if (sort === 'oldest') displayBookings.reverse();

  // Boarding Bookings Logic
  let displayBoardingBookings = [...boardingBookings];
  if (filterStatus !== 'all') {
    displayBoardingBookings = displayBoardingBookings.filter(b => {
      const statusLower = b.status.toLowerCase();
      if (filterStatus === 'active') return statusLower === 'pending' || statusLower === 'confirmed';
      if (filterStatus === 'completed') return statusLower === 'completed';
      if (filterStatus === 'cancelled') return statusLower === 'cancelled';
      return true;
    });
  }
  if (sort === 'oldest') displayBoardingBookings.reverse();

  const uniqueAreas = [...new Set(myBookings.map(b => b.area))];

  const to12h = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h, 10);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    return `${hr % 12 || 12}:${m} ${ampm}`;
  };

  return (
    <div className="bookings-tab-container">
      {/* ── Section 1: Boarding Place Bookings ── */}
      <div className="dashboard-card mb-5">
        <div className="dashboard-card__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🏠</span>
            <h2 style={{ margin: 0 }}>Boarding Place Bookings</h2>
          </div>
          <span className="dashboard-badge">{displayBoardingBookings.length} Total</span>
        </div>
        
        <div className="table-responsive">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Booking Date</th>
                <th>City</th>
                <th>Owner</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayBoardingBookings.length === 0 ? (
                <tr><td colSpan="6" className="empty-row">No boarding place bookings found</td></tr>
              ) : (
                displayBoardingBookings.map(bb => {
                  const boarding = bb.boarding || {};
                  const statusClass = bb.status === 'Confirmed' ? 'badge-available' : 
                                     bb.status === 'Cancelled' ? 'badge-full' : 'badge-other';
                  
                  return (
                    <tr key={bb._id}>
                      <td>
                        <div style={{ fontWeight: '700' }}>{boarding.title || 'Unknown Property'}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{boarding.propertyType}</div>
                      </td>
                      <td>{formatDate(bb.bookingDate || bb.createdAt)}</td>
                      <td>{boarding.city}</td>
                      <td>{boarding.ownerName}</td>
                      <td>
                        <div className={`status-badge-premium ${statusClass}`} style={{ fontSize: '11px', padding: '4px 10px' }}>
                          <span className="dot-indicator"></span>
                          {bb.status}
                        </div>
                      </td>
                      <td className="text-end">
                        {bb.status !== 'Cancelled' && bb.status !== 'Completed' ? (
                          <button 
                            onClick={() => onCancelBoardingBooking(bb._id)}
                            className="btn btn-outline-danger btn-sm rounded-pill px-3"
                            style={{ fontSize: '11px', fontWeight: '700' }}
                          >
                            Cancel
                          </button>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Processed</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 2: Booked Seats ── */}
      <div className="dashboard-card">
        <div className="dashboard-card__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🪑</span>
            <h2 style={{ margin: 0 }}>Booked Seats (Study Areas)</h2>
          </div>
          <span className="dashboard-badge">{displayBookings.length} Total</span>
        </div>

        <div style={{ padding: '15px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 500 }}>
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={filterArea} onChange={e => setFilterArea(e.target.value)} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 500, textTransform: 'capitalize' }}>
            <option value="all">All Areas</option>
            {uniqueAreas.map(area => <option key={area} value={area}>{area}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 500 }}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>QR</th>
                <th>Date</th>
                <th>Time</th>
                <th>Area</th>
                <th>Seats</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayBookings.length === 0 ? (
                <tr><td colSpan="7" className="empty-row">No seat bookings found</td></tr>
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
                    if (isCancelled) return { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
                    if (isExpired) return { background: 'rgba(100, 116, 139, 0.1)', color: '#64748b' };
                    return { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
                  };

                  return (
                    <tr key={booking._id} style={isCancelled ? { opacity: 0.65 } : {}}>
                      <td style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setSelectedBooking({ ...booking, isExpired, isCancelled, to12h, getStatusLabel })} title="View QR">
                        <i className="bi bi-qr-code" style={{ fontSize: '1.2rem', color: '#5938B6' }}></i>
                      </td>
                      <td><strong>{formatDate(booking.date)}</strong></td>
                      <td>{to12h(booking.time)}{booking.endTime ? ` - ${to12h(booking.endTime)}` : ''}</td>
                      <td><span className="level-tag" style={{textTransform: 'capitalize'}}>{booking.area}</span></td>
                      <td>{booking.seats.join(', ')}</td>
                      <td>
                        <span className="status-badge-premium" style={{ ...getStatusStyle(), fontSize: '10px' }}>
                          <span className="dot-indicator"></span>
                          {getStatusLabel()}
                        </span>
                      </td>
                      <td className="text-end">
                        {!isCancelled && !isExpired ? (
                          <button
                            onClick={() => onCancelBooking(booking._id)}
                            className="btn btn-outline-danger btn-sm rounded-pill px-3"
                            style={{ fontSize: '11px', fontWeight: '700' }}
                          >
                            Cancel
                          </button>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '11px' }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
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

