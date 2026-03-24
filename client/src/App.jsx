import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Bookings from './pages/Bookings';
import Careers from './pages/Careers';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminAddBoarding from './pages/AdminAddBoarding';
import BoardingsList from './pages/BoardingsList';
import BoardingDetails from './pages/BoardingDetails';
import AdminAllBoardings from './pages/AdminAllBoardings';
import AdminEditBoarding from './pages/AdminEditBoarding';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/boarding" element={<BoardingsList />} />
        <Route path="/boarding/:id" element={<BoardingDetails />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/addboarding" element={<AdminAddBoarding />} />
        <Route path="/admin/allboardings" element={<AdminAllBoardings />} />
        <Route path="/admin/editboarding/:id" element={<AdminEditBoarding />} />
      </Routes>
    </Router>
  );
}

export default App;
