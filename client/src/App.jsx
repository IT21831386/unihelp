import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Bookings from './pages/Bookings';
import BookingSeats from './pages/BookingSeats';
import Careers from './pages/Careers';
import FindJobs from './pages/FindJobs';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/bookings/:categoryId" element={<BookingSeats />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/careers/find-jobs" element={<FindJobs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
