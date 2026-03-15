import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './BookingSeats.css';

// Seat layout config for each table group
const tableGroups = {
  left: [
    { id: 'TA', label: 'TA', rows: [['TA1', 'TA2', 'TA3'], ['TA4', 'TA5', 'TA6']] },
    { id: 'TB', label: 'TB', rows: [['TB1', 'TB2', 'TB3'], ['TB4', 'TB5', 'TB6']] },
    { id: 'TC', label: 'TC', rows: [['TC1', 'TC2', 'TC3'], ['TC4', 'TC5', 'TC6']] },
  ],
  right: [
    { id: 'TD', label: 'TD', rows: [['TD1', 'TD2', 'TD3', 'TD4'], ['TD5', 'TD6', 'TD7', 'TD8']] },
    { id: 'TE', label: 'TE', rows: [['TE1', 'TE2', 'TE3'], ['TE4', 'TE5', 'TE6']] },
    { id: 'TF', label: 'TF', rows: [['TF1', 'TF2', 'TF3'], ['TF4', 'TF5', 'TF6']] },
  ],
};

// Some seats marked as unavailable for demo
const unavailableSeats = ['TA3', 'TB2', 'TD4', 'TE3', 'TF1'];

const categoryLabels = {
  canteen: 'Canteen',
  'study-area': 'Study area',
  library: 'Library',
};

function BookingSeats() {
  const { categoryId } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [area, setArea] = useState('Study Area 1');
  const [date, setDate] = useState('2026-03-02');
  const [time, setTime] = useState('09:00');
  const [numSeats, setNumSeats] = useState(4);

  const categoryLabel = categoryLabels[categoryId] || 'Study area';

  const toggleSeat = (seatId) => {
    if (unavailableSeats.includes(seatId)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((s) => s !== seatId);
      }
      if (prev.length >= numSeats) return prev;
      return [...prev, seatId];
    });
  };

  const getSeatClass = (seatId) => {
    if (unavailableSeats.includes(seatId)) return 'seat unavailable';
    if (selectedSeats.includes(seatId)) return 'seat selected';
    return 'seat';
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
              title={unavailableSeats.includes(seatId) ? 'Unavailable' : seatId}
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
                  {tableGroups.left.map(renderTableGroup)}
                </div>
                {/* Right column */}
                <div className="seat-map__column">
                  {tableGroups.right.map(renderTableGroup)}
                  <p className="seat-map__entrance">Entrance here</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="booking-seats-cta">
          <button
            className="booking-seats-cta__btn"
            disabled={selectedSeats.length === 0}
          >
            Book your spot
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default BookingSeats;
