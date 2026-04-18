import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import NoticesPage from './pages/NoticesPage'; // Wrapper component
import EventDetailsPage from './pages/EventDetailsPage';
import EventsPage from './pages/EventsPage';
import SpecialNoticesPage from './pages/SpecialNoticesPage';
import LostFoundPage from './pages/LostFoundPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/notices" replace />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/special-notices" element={<SpecialNoticesPage />} />
          <Route path="/lost-found" element={<LostFoundPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
