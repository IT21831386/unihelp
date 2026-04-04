import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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
  const defaultTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [numSeats, setNumSeats] = useState(4);
  const [bookedSeatsFromDB, setBookedSeatsFromDB] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const categoryLabel = categoryLabels[categoryId] || 'Study area';
  const [currentLayout, setCurrentLayout] = useState(null);

  useEffect(() => {
    const fetchLayoutConfig = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/areas');
        if (res.ok) {
          const areas = await res.json();
          const targetArea = areas.find(a => a.categoryId === (categoryId || 'study-area'));
          if (targetArea) setCurrentLayout(targetArea.layoutConfig);
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
        const query = new URLSearchParams({
          category: categoryId || 'study-area',
          area,
          date,
          time
        }).toString();
        const res = await fetch(`http://localhost:5000/api/bookings?${query}`);
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        const seats = data.flatMap(b => b.seats);
        setBookedSeatsFromDB(seats);
        
        // Remove currently selected seats if they just became unavailable
        setSelectedSeats(prev => prev.filter(s => !seats.includes(s)));
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookings();
  }, [categoryId, area, date, time]);

  const isSeatUnavailable = (seatId) => {
    return unavailableSeats.includes(seatId) || bookedSeatsFromDB.includes(seatId);
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
          category: categoryId || 'study-area',
          area,
          date,
          time,
          seats: selectedSeats
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to book seats');
      }
      
      setSuccessMsg('Successfully booked your spot!');
      setSelectedSeats([]);
      setBookedSeatsFromDB(prev => [...prev, ...selectedSeats]);
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
                  Area {chevronDown}
                </label>
                <select
                  className="booking-seats-form__select"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                >
                  <option>Study Area 1</option>
                  <option>Study Area 2</option>
                  <option>Study Area 3</option>
                </select>
              </div>

              <div className="booking-seats-form__group">
                <label className="booking-seats-form__label">
                  Date &amp; Time {chevronDown}
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

            {/* Right: Seat Map */}
            <div className="seat-map">
              <h2 className="seat-map__title">Chose your spot</h2>
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
          </div>
        </section>

        {/* CTA */}
        <div className="booking-seats-cta">
          {error && <p className="booking-seats-error" style={{color: 'red', marginBottom: '10px'}}>{error}</p>}
          {successMsg && <p className="booking-seats-success" style={{color: 'green', marginBottom: '10px'}}>{successMsg}</p>}
          <button
            className="booking-seats-cta__btn"
            disabled={selectedSeats.length === 0 || loading}
            onClick={handleBookSpot}
          >
            {loading ? 'Booking...' : 'Book your spot'}
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default BookingSeats;
