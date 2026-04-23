import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Bookings from './pages/Bookings';
import BookingSeats from './pages/BookingSeats';
import Careers from './pages/Careers';
import FindJobs from './pages/FindJobs';
import PostJob from './pages/PostJob';
import ViewJob from './pages/ViewJob';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ApplyJob from './pages/ApplyJob';
import AdminAddBoarding from './pages/AdminAddBoarding';
import BoardingsList from './pages/BoardingsList';
import BoardingDetails from './pages/BoardingDetails';
import AdminAllBoardings from './pages/AdminAllBoardings';
import AdminEditBoarding from './pages/AdminEditBoarding';
import Marketplace from './components/MarketPlace/MarketPlace.jsx';
import BuyItems from './components/BuyItems/BuyItems.jsx';
import SellItems from './components/SellItems/SellItems.jsx';
import AddItem from './components/AddItem/AddItem.jsx';
import UpdateItem from './components/UpdateItem/UpdateItem.jsx';
import ItemDetail from './components/ItemDetail/ItemDetail.jsx';
import Chat from './components/Chat/Chat.jsx';
import OwnerReviews from './pages/OwnerReviews';

// Notices
import { NotificationProvider } from './context/NotificationContext';
import NoticesPage from './pages/notices/NoticesPage';
import SpecialNoticesPage from './pages/notices/SpecialNoticesPage';
import EventsPage from './pages/notices/EventsPage';
import LostFoundPage from './pages/notices/LostFoundPage';
import NotificationToast from './components/notices/NotificationToast';
import NoticeDetailModal from './components/notices/NoticeDetailModal';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Toaster position="top-right" reverseOrder={false} />
        <NotificationToast />
        <NoticeDetailModal />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/bookings/:categoryId" element={<BookingSeats />} />
          <Route path="/boarding" element={<ProtectedRoute><BoardingsList /></ProtectedRoute>} />
          <Route path="/boarding/:id" element={<ProtectedRoute><BoardingDetails /></ProtectedRoute>} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/find-jobs" element={<FindJobs />} />
          <Route path="/careers/post-job" element={<PostJob />} />
          <Route path="/careers/job/:id" element={<ViewJob />} />
          <Route path="/careers/job/:id/apply" element={<ApplyJob />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/addboarding" element={<AdminAddBoarding />} />
          <Route path="/admin/allboardings" element={<AdminAllBoardings />} />
          <Route path="/admin/editboarding/:id" element={<AdminEditBoarding />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/buy" element={<BuyItems />} />
          <Route path="/marketplace/sell" element={<SellItems />} />
          <Route path="/marketplace/sell/add" element={<AddItem />} />
          <Route path="/marketplace/sell/update/:id" element={<UpdateItem />} />
          <Route path="/marketplace/item/:id" element={<ItemDetail />} />
          <Route path="/marketplace/chats" element={<Chat />} />
          <Route path="/owner/reviews" element={<OwnerReviews />} />
          
          {/* Notices Routes */}
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/special-notices" element={<SpecialNoticesPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/lost-found" element={<LostFoundPage />} />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
