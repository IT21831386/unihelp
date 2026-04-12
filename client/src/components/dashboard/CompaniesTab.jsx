import { useState } from 'react';

function CompaniesTab({ companies, formatDate }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-card">
      <div className="dashboard-card__header">
        <h2>Associated Companies</h2>
        <span className="dashboard-badge">{filteredCompanies.length} Total</span>
      </div>
      <div style={{ padding: '15px', background: '#f6f8fa', borderBottom: '1px solid #e1e4e8' }}>
        <input
          type="text"
          placeholder="Search companies by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', width: '100%', maxWidth: '400px' }}
        />
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
