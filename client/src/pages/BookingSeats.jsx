import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './BookingSeats.css';



// Some seats marked as unavailable for demo
const unavailableSeats = ['TA3', 'TB2', 'TD4', 'TE3', 'TF1', 'C1-3', 'C4-2', 'L1-1', 'L6-5'];

const categoryLabels = {
  canteen: 'Canteen',
  'study-area': 'Study area',
  library: 'Library',
};

function BookingSeats() {
  const { categoryId } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [area, setArea] = useState('Study Area 1');
  
  // Get current date (YYYY-MM-DD) and time (HH:MM) for initial state
  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0];
  let hNum = now.getHours();
  if (hNum < 8) hNum = 8;
  if (hNum > 21) hNum = 21; // Prevent defaulting past the closing boundary
  const h = String(hNum).padStart(2, '0');
  const m = now.getMinutes() >= 30 ? '30' : '00';
  const defaultTime = `${h}:${m}`;

  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [duration, setDuration] = useState(1);
  const [numSeats, setNumSeats] = useState(4);
  const [dailyBookings, setDailyBookings] = useState([]);
  
  const getEndTime = (startStr, durHours) => {
    if (!startStr) return '';
    const parts = startStr.split(':');
    if (parts.length < 2) return '';
    const totalMins = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10) + durHours * 60;
    const endH = Math.floor(totalMins / 60);
    const endM = totalMins % 60;
    if (endH >= 24) return '23:59';
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };
  const endTime = getEndTime(time, duration);
  
  const isTimeValid = () => {
    if (!time || !endTime) return false;
    if (time < '08:00') return false;
    if (endTime > '22:00') return false;
    return true;
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
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

  const isSeatUnavailable = (seatId) => {
    return unavailableSeats.includes(seatId) || unavailableSeatsList.includes(seatId);
  };

  const toggleSeat = (seatId) => {
    if (isSeatUnavailable(seatId)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((s) => s !== seatId);
      }
      if (prev.length >= numSeats) return prev;
      return [...prev, seatId];
    });
  };

  const getSeatClass = (seatId) => {
    if (isSeatUnavailable(seatId)) return 'seat unavailable';
    if (selectedSeats.includes(seatId)) return 'seat selected';
    return 'seat';
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
          user: currentUser ? currentUser._id : null
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to book seats');
      }
      
      setSuccessMsg(`Successfully booked your spot for ${duration} hour(s)!`);
      setSelectedSeats([]);
      setDailyBookings(prev => [...prev, data]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTableGroup = (group) => (
    <div className="table-group" key={group.id}>
      {group.rows.map((row, ri) => (
        <div className="table-group__row" key={ri}>
          {row.map((seatId) => (
            <button
              key={seatId}
              className={getSeatClass(seatId)}
              onClick={() => toggleSeat(seatId)}
              title={isSeatUnavailable(seatId) ? 'Unavailable' : seatId}
            >
              {seatId}
            </button>
          ))}
        </div>
      ))}
      <span className="table-group__label">{group.label}</span>
    </div>
  );

  const chevronDown = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );

  return (
    <>
      <Navbar />

      <div className="container">
        {/* Breadcrumb */}
        <nav className="booking-seats-breadcrumb">
          <Link to="/bookings">Bookings</Link>
          <span>&gt;</span>
          {categoryLabel}
        </nav>

        {/* Main Content */}
        <section className="booking-seats-main">
          <h1 className="booking-seats-main__title">Make a new booking</h1>

          <div className="booking-seats-layout">
            {/* Left: Form */}
            <div className="booking-seats-form">
              <div className="booking-seats-form__group">
                <label className="booking-seats-form__label">
                  Area
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
                      setSelectedSeats([]); // clear selections if layout switches
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
                  Start Time
                </label>
                <div className="booking-seats-form__row">
                  <input
                    type="date"
                    className="booking-seats-form__input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <input
                    type="time"
                    className="booking-seats-form__input"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="booking-seats-form__group">
                <label className="booking-seats-form__label">Duration</label>
                <select
                  className="booking-seats-form__select"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                >
                  {[...Array(11)].map((_, i) => {
                    const val = 1 + (i * 0.5); // Starts at 1, goes to 6
                    return <option key={val} value={val}>{val} Hour{val > 1 ? 's' : ''} (Ends {getEndTime(time, val)})</option>;
                  })}
                </select>
              </div>

              <div className="booking-seats-form__group">
                <label className="booking-seats-form__label">Number of seats</label>
                <input
                  type="number"
                  className="booking-seats-form__input"
                  value={numSeats}
                  min={1}
                  max={20}
                  onChange={(e) => setNumSeats(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Right: Seat Map and Sidebar */}
            <div style={{ display: 'flex', gap: '20px', flex: 1, flexWrap: 'wrap' }}>
              <div className="seat-map" style={{ flex: 2, minWidth: '300px' }}>
                <h2 className="seat-map__title">Choose your spot ({time} - {endTime})</h2>
                <div className="seat-map__grid">
                  {/* Left column */}
                  <div className="seat-map__column">
                    {currentLayout ? currentLayout.left.map(renderTableGroup) : <div>Loading layout...</div>}
                  </div>
                  {/* Right column */}
                  <div className="seat-map__column">
                    {currentLayout ? currentLayout.right.map(renderTableGroup) : <div>Loading layout...</div>}
                    <p className="seat-map__entrance">Entrance here</p>
                  </div>
                </div>
              </div>
              
              <div className="booking-sidebar" style={{ flex: 1, minWidth: '220px', background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e1e4e8', alignSelf: 'flex-start' }}>
                <h3 style={{ fontSize: '15px', borderBottom: '2px solid #e1e4e8', paddingBottom: '10px', marginBottom: '15px', color: '#24292e' }}>Today's Reserved Times</h3>
                {dailyBookings.length === 0 ? (
                  <p style={{ fontSize: '13px', color: '#586069' }}>No seats are currently booked here today.</p>
                ) : (
                   <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                     {[...dailyBookings].sort((a,b) => a.time.localeCompare(b.time)).map(b => (
                       <li key={b._id} style={{ marginBottom: '10px', fontSize: '13px', background: '#fff', padding: '10px', borderRadius: '6px', border: '1px solid #eaecef', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                         <strong style={{ color: 'var(--color-primary)', display: 'block', fontSize: '14px', marginBottom: '4px' }}>{b.time} to {b.endTime}</strong>
                         <span style={{ color: '#555', display: 'block', lineHeight: '1.4' }}><strong style={{color: '#24292e'}}>Seats:</strong> {b.seats.join(', ')}</span>
                       </li>
                     ))}
                   </ul>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="booking-seats-cta">
          {error && <p className="booking-seats-error" style={{color: 'red', marginBottom: '10px'}}>{error}</p>}
          {successMsg && <p className="booking-seats-success" style={{color: 'green', marginBottom: '10px'}}>{successMsg}</p>}
          
          {!currentUser ? (
             <p style={{color: 'var(--color-primary)', fontWeight: 'bold', marginBottom: '10px', fontSize: '14px'}}>
               <Link to="/login" style={{textDecoration: 'underline'}}>Log in as a student</Link> to book a seat.
             </p>
          ) : currentUser.role !== 'user' ? (
             <p style={{color: 'red', fontWeight: 'bold', marginBottom: '10px', fontSize: '14px'}}>Only students can book seats. You are logged in as an {currentUser.role}.</p>
          ) : !isTimeValid() ? (
             <p style={{color: 'red', fontWeight: 'bold', marginBottom: '10px', fontSize: '14px'}}>Bookings must strictly fall between 08:00 AM and 10:00 PM. Please adjust your start time or duration!</p>
          ) : null}

          <button
            className="booking-seats-cta__btn"
            disabled={selectedSeats.length === 0 || loading || !currentUser || currentUser.role !== 'user' || !isTimeValid()}
            onClick={handleBookSpot}
          >
            {loading ? 'Booking...' : (!currentUser ? 'Login Required' : 'Book your spot')}
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default BookingSeats;
