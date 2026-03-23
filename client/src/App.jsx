import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Bookings from './pages/Bookings';
import Careers from './pages/Careers';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminAddBoarding from './pages/AdminAddBoarding';
import BoardingsList from './pages/BoardingsList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/boarding" element={<BoardingsList />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/addboarding" element={<AdminAddBoarding />} />
      </Routes>
    </Router>
  );
}

export default App;
