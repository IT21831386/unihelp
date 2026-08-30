import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { QRCodeCanvas } from '../../node_modules/qrcode.react/lib/esm/index.js';
import toast from 'react-hot-toast';
import './BookingSeats.css';

const categoryLabels = {
  canteen: 'Canteen',
  'study-area': 'Study area',
  library: 'Library',
};

function BookingSeats() {
  const { categoryId } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [area, setArea] = useState('study-area');
  
  // Get current date (YYYY-MM-DD) and time (HH:MM) for initial state
  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0];
  let hNum = now.getHours();
  let defaultTime;
  if (hNum < 8) {
    defaultTime = '08:00';
  } else if (hNum > 21) {
    defaultTime = '21:00';
  } else {
    defaultTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  }

  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  
  // Create a default end time 1 hour after start time
  const getDefaultEndTime = (startStr) => {
    if (!startStr) return '09:00';
    const parts = startStr.split(':');
    let endH = parseInt(parts[0], 10) + 1;
    if (endH > 22) endH = 22;
    return `${String(endH).padStart(2, '0')}:${parts[1] || '00'}`;
  };
  const [endTime, setEndTime] = useState(getDefaultEndTime(defaultTime));
  
  const [numSeats, setNumSeats] = useState(1);
  const [dailyBookings, setDailyBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);
  const [showPassModal, setShowPassModal] = useState(false);
  
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  const categoryLabel = categoryLabels[categoryId] || 'Study area';
  const [currentLayout, setCurrentLayout] = useState(null);
  const [allAreas, setAllAreas] = useState([]);

  useEffect(() => {
    const fetchLayoutConfig = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/areas');
        if (res.ok) {
          const areasData = await res.json();
          setAllAreas(areasData);
          const targetArea = areasData.find(a => a.categoryId === (categoryId || 'study-area'));
          if (targetArea) {
            setCurrentLayout(targetArea.layoutConfig);
            setArea(targetArea.categoryId);
          } else if (areasData.length > 0) {
            setCurrentLayout(areasData[0].layoutConfig);
            setArea(areasData[0].categoryId);
          }
        }
      } catch (err) {
        console.error('Failed to load layout configs:', err);
      }
    };
    fetchLayoutConfig();
  }, [categoryId]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const query = new URLSearchParams({ category: area, area, date }).toString();
        const res = await fetch(`http://localhost:5000/api/bookings?${query}`);
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        setDailyBookings(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookings();
  }, [area, date]);

  const [unavailableSeatsList, setUnavailableSeatsList] = useState([]);

  useEffect(() => {
    const overlapping = dailyBookings.filter(b => {
      return (time < b.endTime && endTime > b.time);
    });
    const bookedSeats = overlapping.flatMap(b => b.seats);
    setUnavailableSeatsList(bookedSeats);
    
    // Remove currently selected seats if they just became unavailable
    setSelectedSeats(prev => prev.filter(s => !bookedSeats.includes(s)));
  }, [time, endTime, dailyBookings]);

  const isTimeValid = () => {
    if (!time || !endTime) return false;
    if (time >= endTime) return false;
    if (time < '08:00') return false;
    if (endTime > '22:00') return false;
    return true;
  };

  const isSeatUnavailable = (seatId) => {
    return unavailableSeatsList.includes(seatId);
  };

  const toggleSeat = (seatId) => {
    if (isSeatUnavailable(seatId)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((s) => s !== seatId);
      }
      if (prev.length >= numSeats) {
        // If single seat mode, replace choice
        if (numSeats === 1) return [seatId];
        return prev;
      }
      return [...prev, seatId];
    });
  };

  // Smart Auto-Select Adjacent Seats feature
  const handleAutoSelectSeats = () => {
    if (!currentLayout) return;

    const allGroups = [...(currentLayout.left || []), ...(currentLayout.right || [])];
    let bestAdjacentMatch = null;
    let fallbackAvailable = [];

    // Search table rows for consecutive/adjacent seats
    for (const group of allGroups) {
      if (!group.rows) continue;
      for (const row of group.rows) {
        const availableInRow = row.filter(s => !isSeatUnavailable(s));
        
        // Check for exact adjacent sequence in row
        for (let i = 0; i <= row.length - numSeats; i++) {
          const slice = row.slice(i, i + numSeats);
          if (slice.every(s => !isSeatUnavailable(s))) {
            bestAdjacentMatch = slice;
            break;
          }
        }
        if (bestAdjacentMatch) break;
        fallbackAvailable.push(...availableInRow);
      }
      if (bestAdjacentMatch) break;
    }

    if (bestAdjacentMatch) {
      setSelectedSeats(bestAdjacentMatch);
      toast.success(`✨ Found and selected ${numSeats} adjacent seat${numSeats > 1 ? 's' : ''}!`);
    } else if (fallbackAvailable.length >= numSeats) {
      const selected = fallbackAvailable.slice(0, numSeats);
      setSelectedSeats(selected);
      toast.success(`Selected ${numSeats} available seat${numSeats > 1 ? 's' : ''} in the area.`);
    } else {
      toast.error(`Could not find ${numSeats} open seat${numSeats > 1 ? 's' : ''} at this time slot.`);
    }
  };

  const getSeatClass = (seatId) => {
    if (isSeatUnavailable(seatId)) return 'seat unavailable';
    if (selectedSeats.includes(seatId)) return 'seat selected';
    return 'seat';
  };

  const to12h = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h, 10);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    return `${hr % 12 || 12}:${m} ${ampm}`;
  };

  const handleBookSpot = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: area,
          area,
          date,
          time,
          endTime,
          seats: selectedSeats,
          user: currentUser ? currentUser.id : null
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to book seats');
      }
      
      const confirmed = {
        ...data,
        categoryName: allAreas.find(a => a.categoryId === area)?.label || categoryLabel,
        studentName: currentUser ? currentUser.name : 'Student',
        studentEmail: currentUser ? currentUser.email : 'N/A'
      };

      setConfirmedBookingData(confirmed);
      setShowPassModal(true);
      setSuccessMsg(`Successfully booked your spot for ${to12h(time)} to ${to12h(endTime)}!`);
      setSelectedSeats([]);
      setDailyBookings(prev => [...prev, data]);
      toast.success('🎉 Booking confirmed! Digital pass generated.');
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  // Google Calendar URL Generator
  const generateGoogleCalendarUrl = (booking) => {
    if (!booking) return '#';
    const startIso = `${booking.date.replace(/-/g, '')}T${booking.time.replace(':', '')}00`;
    const endIso = `${booking.date.replace(/-/g, '')}T${booking.endTime.replace(':', '')}00`;
    const title = encodeURIComponent(`UniHelp Study Seat: ${booking.categoryName || area} (Seat ${booking.seats.join(', ')})`);
    const details = encodeURIComponent(`UniHelp Campus Seat Reservation\nArea: ${booking.categoryName || area}\nSeats: ${booking.seats.join(', ')}\nBooked by: ${booking.studentName || 'Student'}`);
    const location = encodeURIComponent(`UniHelp Campus - ${booking.categoryName || area}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  };

  // .ics File Generator (Apple Calendar / Outlook)
  const downloadIcsFile = (booking) => {
    if (!booking) return;
    const startFormatted = `${booking.date.replace(/-/g, '')}T${booking.time.replace(':', '')}00`;
    const endFormatted = `${booking.date.replace(/-/g, '')}T${booking.endTime.replace(':', '')}00`;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//UniHelp//Campus Booking System//EN',
      'BEGIN:VEVENT',
      `UID:${booking._id || Date.now()}@unihelp.edu`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${startFormatted}`,
      `DTEND:${endFormatted}`,
      `SUMMARY:UniHelp Booking: ${booking.categoryName || area} (Seats ${booking.seats.join(', ')})`,
      `DESCRIPTION:Campus Seat Booking at UniHelp.\\nSeats: ${booking.seats.join(', ')}\\nStudent: ${booking.studentName || 'Student'}`,
      `LOCATION:UniHelp Campus - ${booking.categoryName || area}`,
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

  const renderTableGroup = (group) => (
    <div className="table-group" key={group.id}>
      {group.rows.map((row, ri) => (
        <div className="table-group__row" key={ri}>
          {row.map((seatId) => (
            <button
              key={seatId}
              type="button"
              className={getSeatClass(seatId)}
              onClick={() => toggleSeat(seatId)}
              title={isSeatUnavailable(seatId) ? `${seatId} - Currently Reserved` : `${seatId} - Click to select`}
            >
              <span className="seat-id-label">{seatId}</span>
              <span className="seat-icon-type">🪑</span>
            </button>
          ))}
        </div>
      ))}
      <span className="table-group__label">{group.label}</span>
    </div>
  );

  return (
    <div className="booking-seats-page-wrapper">
      <Navbar />

      <div className="container booking-seats-container">
        {/* Breadcrumb */}
        <nav className="booking-seats-breadcrumb">
          <Link to="/bookings">Bookings</Link>
          <span>&gt;</span>
          <span>{allAreas.find(a => a.categoryId === area)?.label || categoryLabel}</span>
        </nav>

        {/* Main Content */}
        <section className="booking-seats-main">
          <div className="bk-seats-heading-row">
            <div>
              <h1 className="booking-seats-main__title">Reserve Your Campus Space</h1>
              <p className="booking-seats-main__subtitle">
                Select your preferred date, session time, and pick seats directly on the interactive floor map.
              </p>
            </div>

            <div className="bk-smart-actions-pill">
              <button
                type="button"
                className="bk-auto-find-btn"
                onClick={handleAutoSelectSeats}
                title="Automatically find and choose adjacent seats for your group"
              >
                ✨ Auto-Select {numSeats} Seat{numSeats > 1 ? 's' : ''}
              </button>
            </div>
          </div>

          <div className="booking-seats-layout">
            {/* Left: Form Controls */}
            <div className="booking-seats-form">
              <div className="booking-seats-form__group">
                <label className="booking-seats-form__label">
                  📍 Study Area Zone
                </label>
                <select
                  className="booking-seats-form__select"
                  value={area}
                  onChange={(e) => {
                    const selectedCat = e.target.value;
                    setArea(selectedCat);
                    const found = allAreas.find(a => a.categoryId === selectedCat);
                    if (found) {
                      setCurrentLayout(found.layoutConfig);
                      setSelectedSeats([]);
                    }
                  }}
                >
                  <option value="" disabled>Select an Area</option>
                  {allAreas.map(a => (
                    <option key={a.categoryId} value={a.categoryId}>{a.label}</option>
                  ))}
                </select>
              </div>

              <div className="booking-seats-form__group">
                <label className="booking-seats-form__label">
                  📅 Reservation Date
                </label>
                <input
                  type="date"
                  min={defaultDate}
                  className="booking-seats-form__input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="booking-seats-form__group">
                <label className="booking-seats-form__label">
                  ⏰ Session Start & End Time
                </label>
                <div className="booking-seats-form__row">
                  <div className="bk-time-col">
                    <span className="bk-time-sub">Start</span>
                    <input
                      type="time"
                      className="booking-seats-form__input"
                      value={time}
                      onChange={(e) => {
                        const newStart = e.target.value;
                        setTime(newStart);
                        setEndTime(getDefaultEndTime(newStart));
                      }}
                    />
                  </div>
                  <div className="bk-time-col">
                    <span className="bk-time-sub">End</span>
                    <input
                      type="time"
                      className="booking-seats-form__input"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="booking-seats-form__group">
                <div className="bk-label-with-counter">
                  <label className="booking-seats-form__label">👥 Number of seats</label>
                  <span className="bk-seat-count-tag">{selectedSeats.length}/{numSeats} Chosen</span>
                </div>
                <div className="bk-seat-counter-row">
                  <button
                    type="button"
                    className="bk-counter-btn"
                    onClick={() => setNumSeats(Math.max(1, numSeats - 1))}
                    disabled={numSeats <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="booking-seats-form__input text-center"
                    value={numSeats}
                    min={1}
                    max={15}
                    onChange={(e) => setNumSeats(Math.max(1, Math.min(15, Number(e.target.value))))}
                  />
                  <button
                    type="button"
                    className="bk-counter-btn"
                    onClick={() => setNumSeats(Math.min(15, numSeats + 1))}
                    disabled={numSeats >= 15}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Legend */}
              <div className="bk-seat-legend">
                <span className="bk-legend-item">
                  <span className="bk-legend-dot available"></span> Free
                </span>
                <span className="bk-legend-item">
                  <span className="bk-legend-dot selected"></span> Selected
                </span>
                <span className="bk-legend-item">
                  <span className="bk-legend-dot reserved"></span> Booked
                </span>
              </div>
            </div>

            {/* Right: Seat Map and Live Schedule Sidebar */}
            <div className="bk-map-and-sidebar-row">
              <div className="seat-map-wrapper">
                <div className="seat-map-header">
                  <h2 className="seat-map__title">
                    Interactive Layout ({to12h(time)} - {to12h(endTime)})
                  </h2>
                  <span className="seat-map__subinfo">
                    {selectedSeats.length > 0 ? `Selected: ${selectedSeats.join(', ')}` : 'Click available seats to select'}
                  </span>
                </div>

                <div className="seat-map">
                  <div className="seat-map__grid">
                    {/* Left column */}
                    <div className="seat-map__column">
                      {currentLayout ? currentLayout.left.map(renderTableGroup) : <div>Loading layout...</div>}
                    </div>
                    {/* Right column */}
                    <div className="seat-map__column">
                      {currentLayout ? currentLayout.right.map(renderTableGroup) : <div>Loading layout...</div>}
                      <p className="seat-map__entrance">🚪 Main Entrance</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="booking-sidebar">
                <h3 className="booking-sidebar-title">📅 Today's Slot Schedule</h3>
                {dailyBookings.length === 0 ? (
                  <div className="bk-empty-schedule">
                    <span style={{ fontSize: '1.8rem' }}>✨</span>
                    <p>No reservations currently booked here for {date}. Great spot availability!</p>
                  </div>
                ) : (
                   <ul className="bk-schedule-list">
                     {[...dailyBookings].sort((a,b) => a.time.localeCompare(b.time)).map(b => (
                       <li key={b._id} className="bk-schedule-card">
                         <div className="bk-schedule-time">{to12h(b.time)} – {to12h(b.endTime)}</div>
                         <div className="bk-schedule-seats"><strong>Seats:</strong> {b.seats.join(', ')}</div>
                       </li>
                     ))}
                   </ul>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Bar */}
        <div className="booking-seats-cta">
          {error && <p className="booking-seats-error">{error}</p>}
          {successMsg && <p className="booking-seats-success">{successMsg}</p>}
          
          {!currentUser ? (
             <p className="bk-cta-alert">
               <Link to="/login">Log in with your student account</Link> to reserve seats.
             </p>
          ) : currentUser.role !== 'user' ? (
             <p className="bk-cta-alert text-danger">Only students can book seats. You are logged in as an {currentUser.role}.</p>
          ) : numSeats <= 0 ? (
             <p className="bk-cta-alert text-danger">Number of seats must be at least 1.</p>
          ) : date < defaultDate ? (
             <p className="bk-cta-alert text-danger">You cannot select a past date.</p>
          ) : !isTimeValid() ? (
             <p className="bk-cta-alert text-danger">Bookings must be between 08:00 AM and 10:00 PM, and End Time must be strictly after Start Time.</p>
          ) : null}

          <div className="bk-cta-bottom-actions">
            <div className="bk-selection-summary">
              <span className="bk-sum-label">Selected Space:</span>
              <strong>{allAreas.find(a => a.categoryId === area)?.label || categoryLabel}</strong>
              <span className="bk-sum-divider">|</span>
              <span className="bk-sum-seats">
                {selectedSeats.length > 0 ? `Seats (${selectedSeats.join(', ')})` : 'No seats chosen'}
              </span>
            </div>

            <button
              type="button"
              className="booking-seats-cta__btn"
              disabled={selectedSeats.length < numSeats || numSeats <= 0 || date < defaultDate || loading || !currentUser || currentUser.role !== 'user' || !isTimeValid()}
              onClick={handleBookSpot}
            >
              {loading ? 'Confirming Reservation...' : (!currentUser ? 'Login Required' : (selectedSeats.length < numSeats ? `Select ${numSeats - selectedSeats.length} more seat${numSeats - selectedSeats.length > 1 ? 's' : ''}` : 'Confirm & Reserve Spot'))}
            </button>
          </div>
        </div>
      </div>

      {/* ── Digital Booking Pass Modal ── */}
      {showPassModal && confirmedBookingData && (
        <div className="bk-pass-modal-overlay" onClick={() => setShowPassModal(false)}>
          <div className="bk-pass-modal-card" onClick={e => e.stopPropagation()}>
            <div className="bk-pass-header">
              <div className="bk-pass-badge">🎫 UNIHELP DIGITAL CAMPUS PASS</div>
              <button className="bk-pass-close" onClick={() => setShowPassModal(false)}>✕</button>
            </div>

            <div className="bk-pass-ticket">
              <div className="bk-ticket-top">
                <div className="bk-ticket-logo">
                  <span className="bk-logo-u">U</span>
                  <div>
                    <h4>{confirmedBookingData.categoryName || area}</h4>
                    <p>UniHelp Campus Space Reservation</p>
                  </div>
                </div>
                <div className="bk-ticket-status">CONFIRMED</div>
              </div>

              <div className="bk-ticket-body">
                <div className="bk-ticket-qr-wrap">
                  <QRCodeCanvas
                    id="digital-pass-qr-canvas"
                    value={`UniHelp Pass\nStudent: ${confirmedBookingData.studentName}\nArea: ${confirmedBookingData.categoryName || area}\nDate: ${confirmedBookingData.date}\nTime: ${to12h(confirmedBookingData.time)} - ${to12h(confirmedBookingData.endTime)}\nSeats: ${confirmedBookingData.seats.join(', ')}`}
                    size={160}
                    level="H"
                  />
                  <span className="bk-qr-caption">Scan at Entry Scanner</span>
                </div>

                <div className="bk-ticket-grid">
                  <div className="bk-ticket-row">
                    <span>Student</span>
                    <strong>{confirmedBookingData.studentName}</strong>
                  </div>
                  <div className="bk-ticket-row">
                    <span>Date</span>
                    <strong>{confirmedBookingData.date}</strong>
                  </div>
                  <div className="bk-ticket-row">
                    <span>Session Time</span>
                    <strong>{to12h(confirmedBookingData.time)} – {to12h(confirmedBookingData.endTime)}</strong>
                  </div>
                  <div className="bk-ticket-row">
                    <span>Allocated Seats</span>
                    <strong className="bk-seat-pill-text">{confirmedBookingData.seats.join(', ')}</strong>
                  </div>
                </div>
              </div>

              <div className="bk-ticket-tear-line">
                <div className="bk-tear-notch left"></div>
                <div className="bk-tear-dashed"></div>
                <div className="bk-tear-notch right"></div>
              </div>

              <div className="bk-ticket-footer">
                <span>Pass ID: #{confirmedBookingData._id ? confirmedBookingData._id.slice(-8).toUpperCase() : 'PASS-OK'}</span>
                <span>• Valid on reservation day only</span>
              </div>
            </div>

            {/* Quick Export Actions */}
            <div className="bk-pass-actions">
              <a
                href={generateGoogleCalendarUrl(confirmedBookingData)}
                target="_blank"
                rel="noopener noreferrer"
                className="bk-btn-action google-cal"
              >
                📅 Google Calendar
              </a>
              <button
                type="button"
                onClick={() => downloadIcsFile(confirmedBookingData)}
                className="bk-btn-action ics-cal"
              >
                📆 Apple / Outlook (.ics)
              </button>
              <button
                type="button"
                onClick={() => {
                  const canvas = document.getElementById("digital-pass-qr-canvas");
                  if (!canvas) return;
                  const pngUrl = canvas.toDataURL("image/png");
                  const a = document.createElement("a");
                  a.href = pngUrl;
                  a.download = `unihelp-pass-${confirmedBookingData.date}.png`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  toast.success('Pass QR code downloaded!');
                }}
                className="bk-btn-action download-pass"
              >
                ⬇️ Download QR Pass
              </button>
            </div>

            <div className="bk-pass-bottom-links">
              <Link to="/dashboard?tab=bookings" className="bk-link-dash">
                Go to My Bookings Dashboard &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default BookingSeats;

