import React, { useState, useEffect } from 'react';
import api from '../api';
import NoticeCard from '../components/NoticeCard';
import NoticeForm from '../components/NoticeForm';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const AdminTableTab = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentNotice, setCurrentNotice] = useState(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notices');
      setNotices(res.data);
    } catch (err) {
      showToast('Failed to fetch notices', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      setLoading(true);
      if (currentNotice) {
        await api.put(`/notices/${currentNotice._id}`, formData);
        showToast('Notice updated successfully.', 'success');
      } else {
        await api.post('/notices', formData);
        showToast('Notice added successfully.', 'success');
      }
      setIsFormOpen(false);
      setCurrentNotice(null);
      fetchNotices();
    } catch (err) {
      showToast('An error occurred. Please try again.', 'error');
      setLoading(false);
    }
  };

  const handleToggleArchive = async (notice) => {
    try {
      setLoading(true);
      const updatedStatus = !notice.isArchived;
      await api.put(`/notices/${notice._id}`, { ...notice, isArchived: updatedStatus });
      showToast(updatedStatus ? 'Notice archived successfully.' : 'Notice activated successfully.', 'success');
      fetchNotices();
    } catch (err) {
      showToast('Failed to update status.', 'error');
      setLoading(false);
    }
  };

  const initiateDelete = (id) => {
    setNoticeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/notices/${noticeToDelete}`);
      showToast('Notice deleted successfully.', 'success');
      setIsDeleteModalOpen(false);
      fetchNotices();
    } catch (err) {
      showToast('Failed to delete notice.', 'error');
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>

      {toast.message && (
        <div className={`alert alert-${toast.type}`}>
          {toast.message}
        </div>
      )}

      {!isFormOpen ? (
        <>
          <div className="page-header">
            <div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
              <p style={{ color: 'var(--text-muted)' }}>Manage notices and events across the entire system</p>
            </div>
            <button className="btn btn-primary" onClick={() => { setCurrentNotice(null); setIsFormOpen(true); }}>
              <Plus size={20} /> Add Notice
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }}></div>
            </div>
          ) : notices.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '4rem', gridColumn: '1 / -1' }}>
              <h3 style={{ color: 'var(--text-muted)' }}>Add a notice to display it on the Notice Board.</h3>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#1e293b' }}>
                    <th style={{ padding: '1.25rem 1rem' }}>No</th>
                    <th style={{ padding: '1.25rem 1rem' }}>Title</th>
                    <th style={{ padding: '1.25rem 1rem' }}>Date</th>
                    <th style={{ padding: '1.25rem 1rem' }}>Expiry</th>
                    <th style={{ padding: '1.25rem 1rem' }}>Description</th>
                    <th style={{ padding: '1.25rem 1rem' }}>Category</th>
                    <th style={{ padding: '1.25rem 1rem' }}>Contact</th>
                    <th style={{ padding: '1.25rem 1rem' }}>Photo</th>
                    <th style={{ padding: '1.25rem 1rem' }}>Status</th>
                    <th style={{ padding: '1.25rem 1rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.map((n, idx) => {
                    const isExpired = n.expiryDate && n.expiryDate < today;
                    const isArchived = n.isArchived || isExpired;

                    return (
                      <tr key={n._id} style={{ 
                        borderBottom: '1px solid #e2e8f0', 
                        backgroundColor: isArchived ? '#f1f5f9' : 'transparent',
                        opacity: isArchived ? 0.8 : 1
                      }}>
                        <td style={{ padding: '1rem' }}>{idx + 1}</td>
                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>{n.title}</td>
                        <td style={{ padding: '1rem' }}>{n.date}</td>
                        <td style={{ padding: '1rem', color: isExpired ? '#ef4444' : 'inherit' }}>{n.expiryDate || '-'}</td>
                        <td style={{ padding: '1rem', maxWidth: '300px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{n.description}</td>
                        <td style={{ padding: '1rem' }}>{n.category}</td>
                        <td style={{ padding: '1rem' }}>{n.audience}</td>
                        <td style={{ padding: '1rem' }}>
                          {n.attachments && n.attachments !== 'none' ? (
                            <img src={n.attachments} alt="Thumb" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                          ) : 'none'}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ 
                            padding: '3px 8px', 
                            borderRadius: '12px', 
                            fontSize: '0.7rem', 
                            fontWeight: '800',
                            background: isArchived ? '#94a3b830' : '#22c55e20',
                            color: isArchived ? '#64748b' : '#15803d'
                          }}>
                            {isArchived ? 'ARCHIVED' : 'ACTIVE'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', flexDirection: 'column' }}>
                            <button 
                              onClick={() => { setCurrentNotice(n); setIsFormOpen(true); }}
                              style={{ background: '#1976d2', color: '#fff', border: 'none', padding: '0.4rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}>
                              EDIT
                            </button>
                            
                            {!isArchived && (
                              <button 
                                onClick={() => handleToggleArchive(n)}
                                style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '0.4rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                ARCHIVE
                              </button>
                            )}

                            <button 
                              onClick={() => initiateDelete(n._id)}
                              style={{ background: '#d32f2f', color: '#fff', border: 'none', padding: '0.4rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}>
                              DELETE
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <NoticeForm 
            initialData={currentNotice} 
            onSubmit={handleCreateOrUpdate} 
            onCancel={() => { setIsFormOpen(false); setCurrentNotice(null); }}
            isLoading={loading}
          />
        </div>
      )}

      <Modal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Notice"
        message="Are you sure you want to delete this notice? This action cannot be undone."
        isLoading={loading}
      />

    </div>
  );
};

export default AdminTableTab;
