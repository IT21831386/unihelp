function AdminsTab({ admins, formatDate }) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card__header">
        <h2>Administrators</h2>
        <span className="dashboard-badge">{admins.length} Total</span>
      </div>
      <div className="table-responsive">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email Address</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr><td colSpan="4" className="empty-row">No administrators found</td></tr>
            ) : (
              admins.map(admin => (
                <tr key={admin._id}>
                  <td><strong>{admin.name}</strong></td>
                  <td>{admin.email}</td>
                  <td><span className="role-tag" style={{ background: 'rgba(255, 107, 53, 0.1)', color: 'var(--color-accent)' }}>Admin</span></td>
                  <td>{formatDate(admin.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminsTab;
