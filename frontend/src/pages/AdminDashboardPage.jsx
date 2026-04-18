import React from 'react';
import AdminTableTab from './AdminTableTab';
import { Shield } from 'lucide-react';

const AdminDashboardPage = () => {
  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem', minHeight: '80vh' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        marginBottom: '2rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          backgroundColor: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          <Shield size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#1e293b', margin: 0, lineHeight: 1.2 }}>Admin Dashboard</h2>
          <p style={{ color: '#64748b', margin: 0, marginTop: '4px', fontWeight: '500' }}>Manage all system notices, events, and lost & found items.</p>
        </div>
      </div>
      
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        <AdminTableTab />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardPage;
