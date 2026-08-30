import { useState } from 'react';
import { QRCodeCanvas } from '../../../node_modules/qrcode.react/lib/esm/index.js';
import toast from 'react-hot-toast';

function BookingsTab({ myBookings, boardingBookings = [], currentUser, formatDate, onCancelBooking, onCancelBoardingBooking }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterArea, setFilterArea] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('newest');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const to12h = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h, 10);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    return `${hr % 12 || 12}:${m} ${ampm}`;
  };

  // Google Calendar URL Generator
  const generateGoogleCalendarUrl = (booking) => {
    if (!booking) return '#';
    const startIso = `${booking.date.replace(/-/g, '')}T${booking.time.replace(':', '')}00`;
    const endIso = `${booking.date.replace(/-/g, '')}T${(booking.endTime || '22:00').replace(':', '')}00`;
    const title = encodeURIComponent(`UniHelp Study Seat: ${booking.area} (Seats ${booking.seats.join(', ')})`);
    const details = encodeURIComponent(`UniHelp Campus Seat Reservation\nArea: ${booking.area}\nSeats: ${booking.seats.join(', ')}\nBooked by: ${currentUser?.name || 'Student'}`);
    const location = encodeURIComponent(`UniHelp Campus - ${booking.area}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  };

  // .ics File Generator
  const downloadIcsFile = (booking) => {
    if (!booking) return;
    const startFormatted = `${booking.date.replace(/-/g, '')}T${booking.time.replace(':', '')}00`;
    const endFormatted = `${booking.date.replace(/-/g, '')}T${(booking.endTime || '22:00').replace(':', '')}00`;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//UniHelp//Campus Booking System//EN',
      'BEGIN:VEVENT',
      `UID:${booking._id || Date.now()}@unihelp.edu`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${startFormatted}`,
      `DTEND:${endFormatted}`,
      `SUMMARY:UniHelp Booking: ${booking.area} (Seats ${booking.seats.join(', ')})`,
      `DESCRIPTION:Campus Seat Booking at UniHelp.\\nSeats: ${booking.seats.join(', ')}\\nStudent: ${currentUser?.name || 'Student'}`,
      `LOCATION:UniHelp Campus - ${booking.area}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `unihelp-booking-${booking.date}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('📅 Calendar (.ics) file downloaded!');
  };

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
  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    displayBookings = displayBookings.filter(b => 
      (b.area && b.area.toLowerCase().includes(q)) ||
      (b.date && b.date.includes(q)) ||
      (b.seats && b.seats.some(s => s.toLowerCase().includes(q)))
    );
  }
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
            <h2 style={{ margin: 0 }}>Booked Seats & Study Spaces</h2>
          </div>
          <span className="dashboard-badge">{displayBookings.length} Total</span>
        </div>

        <div style={{ padding: '15px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search date, area, seat ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', minWidth: '200px' }}
          />
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
                <th style={{ width: '40px' }}>Pass</th>
                <th>Date</th>
                <th>Time</th>
                <th>Area</th>
                <th>Seats</th>
                <th>Calendar</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayBookings.length === 0 ? (
                <tr><td colSpan="8" className="empty-row">No seat bookings found</td></tr>
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
                      <td style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setSelectedBooking({ ...booking, isExpired, isCancelled, to12h, getStatusLabel })} title="View Digital QR Pass">
                        <span style={{ fontSize: '1.2rem', padding: '4px 8px', background: '#eef2ff', borderRadius: '8px', display: 'inline-block' }}>🎫</span>
                      </td>
                      <td><strong>{formatDate(booking.date)}</strong></td>
                      <td>{to12h(booking.time)}{booking.endTime ? ` - ${to12h(booking.endTime)}` : ''}</td>
                      <td><span className="level-tag" style={{textTransform: 'capitalize'}}>{booking.area}</span></td>
                      <td><strong>{booking.seats.join(', ')}</strong></td>
                      <td>
                        {!isCancelled && !isExpired ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <a
                              href={generateGoogleCalendarUrl(booking)}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Add to Google Calendar"
                              style={{ textDecoration: 'none', fontSize: '11px', background: '#eef2ff', color: '#4f46e5', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}
                            >
                              + Google
                            </a>
                            <button
                              onClick={() => downloadIcsFile(booking)}
                              title="Download Apple / Outlook .ics"
                              style={{ border: 'none', background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                            >
                              .ics
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: '#cbd5e1', fontSize: '11px' }}>—</span>
                        )}
                      </td>
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
        <div onClick={() => setSelectedBooking(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', padding: '28px', maxWidth: '380px', width: '90%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#4f46e5', letterSpacing: '0.8px' }}>🎫 UNIHELP DIGITAL PASS</span>
              <button onClick={() => setSelectedBooking(null)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '15px' }}>
              <QRCodeCanvas
                id="qr-code-canvas"
                value={`UniHelp Booking\nStudent: ${currentUser?.name || 'N/A'}\nArea: ${selectedBooking.area}\nDate: ${selectedBooking.date}\nTime: ${selectedBooking.to12h(selectedBooking.time)} - ${selectedBooking.to12h(selectedBooking.endTime)}\nSeats: ${selectedBooking.seats.join(', ')}\nStatus: ${selectedBooking.getStatusLabel()}`}
                size={180}
                level="M"
              />
            </div>

            <div style={{ fontSize: '13px', textAlign: 'left', background: '#f8fafc', padding: '14px', borderRadius: '12px', lineHeight: '1.8', border: '1px solid #e2e8f0' }}>
              <div><strong>Student:</strong> {currentUser?.name}</div>
              <div><strong>Area:</strong> <span style={{ textTransform: 'capitalize' }}>{selectedBooking.area}</span></div>
              <div><strong>Date:</strong> {formatDate(selectedBooking.date)}</div>
              <div><strong>Time:</strong> {selectedBooking.to12h(selectedBooking.time)} - {selectedBooking.to12h(selectedBooking.endTime)}</div>
              <div><strong>Seats:</strong> <span style={{ color: '#4f46e5', fontWeight: 'bold' }}>{selectedBooking.seats.join(', ')}</span></div>
              <div><strong>Status:</strong> {selectedBooking.getStatusLabel()}</div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '18px', flexWrap: 'wrap' }}>
              <a
                href={generateGoogleCalendarUrl(selectedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '8px 14px', background: '#eef2ff', color: '#4f46e5', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}
              >
                📅 Google Calendar
              </a>
              <button
                onClick={() => {
                  const canvas = document.getElementById("qr-code-canvas");
                  if (!canvas) return;
                  const pngUrl = canvas.toDataURL("image/png");
                  const a = document.createElement("a");
                  a.href = pngUrl;
                  a.download = `unihelp-pass-${selectedBooking.date}.png`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  toast.success('Pass QR code downloaded!');
                }}
                style={{ padding: '8px 14px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
              >
                ⬇️ Download QR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingsTab;


