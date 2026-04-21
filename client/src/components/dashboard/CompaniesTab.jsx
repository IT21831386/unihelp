import { useState } from 'react';

function CompaniesTab({ companies, formatDate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const dateA = new Date(a.latestJob).getTime();
    const dateB = new Date(b.latestJob).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="dashboard-card">
      <div className="dashboard-card__header">
        <h2>Associated Companies</h2>
        <span className="dashboard-badge">{filteredCompanies.length} Total</span>
      </div>
      <div style={{ padding: '15px', background: 'rgba(255, 255, 255, 0.3)', borderBottom: '1px solid rgba(0, 0, 0, 0.05)', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search companies by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', flex: '1', minWidth: '200px', maxWidth: '400px' }}
        />
        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '14px' }}
        >
          <option value="newest">Sort by Last Active: Newest First</option>
          <option value="oldest">Sort by Last Active: Oldest First</option>
        </select>
      </div>
      <div className="table-responsive">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Active Job Listings</th>
              <th>Last Active</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.length === 0 ? (
              <tr><td colSpan="3" className="empty-row">No companies found matching your search</td></tr>
            ) : (
              filteredCompanies.map((company, index) => (
                <tr key={index}>
                  <td><strong>{company.name}</strong></td>
                  <td>{company.jobCount} jobs</td>
                  <td>{formatDate(company.latestJob)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CompaniesTab;
