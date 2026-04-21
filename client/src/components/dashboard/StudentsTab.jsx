import { useState } from 'react';

function StudentsTab({ students, formatDate, onDeleteUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="dashboard-card">
      <div className="dashboard-card__header">
        <h2>Registered Students</h2>
        <span className="dashboard-badge">{filteredStudents.length} Total</span>
      </div>
      <div style={{ padding: '15px', background: 'rgba(255, 255, 255, 0.3)', borderBottom: '1px solid rgba(0, 0, 0, 0.05)', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search students by name or email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', flex: '1', minWidth: '200px', maxWidth: '400px' }}
        />
        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '14px' }}
        >
          <option value="newest">Sort by Date: Newest First</option>
          <option value="oldest">Sort by Date: Oldest First</option>
        </select>
      </div>
      <div className="table-responsive">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email Address</th>
              <th>Role</th>
              <th>Joined</th>
              <th style={{ minWidth: '200px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr><td colSpan="5" className="empty-row">No students found matching your search</td></tr>
            ) : (
              filteredStudents.map(student => (
                <tr key={student._id}>
                  <td><strong>{student.name}</strong></td>
                  <td>{student.email}</td>
                  <td><span className="role-tag role-student">Student</span></td>
                  <td>{formatDate(student.createdAt)}</td>
                  <td>
                    <button onClick={() => setSelectedStudent(student)} style={{ padding: '5px 12px', background: '#e1e4e8', color: '#24292e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', marginRight: '5px', fontWeight: 'bold' }}>View</button>
                    <button onClick={async () => {
                      if (!window.confirm('Are you sure you want to delete this student?')) return;
                      try {
                        const res = await fetch(`http://localhost:5000/api/auth/users/${student._id}`, { method: 'DELETE' });
                        if (res.ok) {
                          onDeleteUser(student._id);
                        } else {
                          alert('Failed to delete student');
                        }
                      } catch (e) {
                        alert(e.message);
                      }
                    }} style={{ padding: '5px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedStudent && (
        <div onClick={() => setSelectedStudent(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '12px', padding: '30px', maxWidth: '350px', width: '90%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <div style={{ width: '60px', height: '60px', background: 'var(--color-primary)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', margin: '0 auto 15px' }}>
              {selectedStudent.name.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ marginBottom: '5px', color: '#24292e' }}>{selectedStudent.name}</h3>
            <p style={{ fontSize: '13px', color: '#586069', marginBottom: '20px' }}><span className="role-tag role-student">Student</span></p>
            
            <div style={{ textAlign: 'left', background: '#f6f8fa', padding: '15px', borderRadius: '8px', lineHeight: '1.8', fontSize: '14px' }}>
              <div><strong>Email:</strong> <a href={`mailto:${selectedStudent.email}`} style={{ color: 'var(--color-primary)' }}>{selectedStudent.email}</a></div>
              <div><strong>Joined:</strong> {formatDate(selectedStudent.createdAt)}</div>
              <div><strong>Account ID:</strong> <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>{selectedStudent._id}</span></div>
            </div>
            
            <button onClick={() => setSelectedStudent(null)} style={{ marginTop: '20px', padding: '10px 30px', background: '#e1e4e8', color: '#24292e', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', width: '100%' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentsTab;
