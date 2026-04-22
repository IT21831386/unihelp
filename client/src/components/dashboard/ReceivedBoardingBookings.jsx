import React from 'react';
import { Check, X, Mail, Phone } from 'lucide-react';

function ReceivedBoardingBookings({ bookings, onUpdateStatus, formatDate }) {
  return (
    <div className="dashboard-card premium-table-card border-0">
      <div className="dashboard-card__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', background: 'linear-gradient(135deg, #10b981, #3b82f6)', borderRadius: '10px', color: '#fff' }}>
            <Mail size={20} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Property Booking Requests</h2>
        </div>
        <span className="dashboard-badge" style={{ background: '#10b981' }}>{bookings.length} Total</span>
      </div>

      <div className="table-responsive">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Applicant Details</th>
              <th>Date Received</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan="5" className="empty-row">No booking requests received yet</td></tr>
            ) : (
              bookings.map((booking) => {
                const b = booking.boarding || {};
                const u = booking.user || {};
                const statusClass = booking.status === 'Confirmed' ? 'badge-available' : 
                                   booking.status === 'Cancelled' ? 'badge-full' : 'badge-other';

                return (
                  <tr key={booking._id}>
                    <td>
                      <div style={{ fontWeight: '800', color: '#1e1b4b' }}>{b.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{b.city} • {b.propertyType}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '700' }}>{u.name || 'Anonymous Student'}</div>
                      <div style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b' }}>
                        <Mail size={12} /> {u.email || 'No email'}
                      </div>
                    </td>
                    <td>{formatDate(booking.createdAt)}</td>
                    <td>
                      <div className={`status-badge-premium ${statusClass}`}>
                        <span className="dot-indicator"></span>
                        {booking.status}
                      </div>
                    </td>
                    <td className="text-end">
                      {booking.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={() => onUpdateStatus(booking._id, 'Confirmed')}
                            className="premium-action-btn" 
                            style={{ background: '#dcfce7', color: '#16a34a', border: 'none' }}
                            title="Confirm Booking"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => onUpdateStatus(booking._id, 'Cancelled')}
                            className="premium-action-btn" 
                            style={{ background: '#fee2e2', color: '#dc2626', border: 'none' }}
                            title="Reject Booking"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>Decision Made</span>
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
  );
}

export default ReceivedBoardingBookings;
