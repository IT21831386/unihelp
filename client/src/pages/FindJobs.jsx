import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './FindJobs.css';

const sampleJobs = [
  {
    id: 1,
    title: 'UI/UX Engineer',
    company: 'ABC Technologies',
    tags: ['Full-time', 'Entry Level', 'Remote'],
    description:
      'ABC is hiring a UI/UX Engineer to support in upcoming projects and if you\'re interested in this opportunity please apply through our website.',
  },
  {
    id: 2,
    title: 'UI/UX Engineer',
    company: 'ABC Technologies',
    tags: ['Full-time', 'Entry Level', 'Remote'],
    description:
      'ABC is hiring a UI/UX Engineer to support in upcoming projects and if you\'re interested in this opportunity please apply through our website.',
  },
  {
    id: 3,
    title: 'UI/UX Engineer',
    company: 'ABC Technologies',
    tags: ['Full-time', 'Entry Level', 'Remote'],
    description:
      'ABC is hiring a UI/UX Engineer to support in upcoming projects and if you\'re interested in this opportunity please apply through our website.',
  },
  {
    id: 4,
    title: 'UI/UX Engineer',
    company: 'ABC Technologies',
    tags: ['Full-time', 'Entry Level', 'Remote'],
    description:
      'ABC is hiring a UI/UX Engineer to support in upcoming projects and if you\'re interested in this opportunity please apply through our website.',
  },
];

function FindJobs() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState(90);
  const [filters, setFilters] = useState({
    location: '',
    internship: true,
    entryLevel: false,
    midSenior: false,
    senior: false,
    remote: true,
    onSite: false,
    hybrid: false,
  });

  const handleCheckbox = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      internship: false,
      entryLevel: false,
      midSenior: false,
      senior: false,
      remote: false,
      onSite: false,
      hybrid: false,
    });
    setSalary(90);
  };

  return (
    <>
      <Navbar />

      <div className="container">
        {/* Breadcrumb */}
        <nav className="find-jobs-breadcrumb">
          <Link to="/careers">Job opportunities</Link>
          <span>&gt;</span>
          Find a Job
        </nav>

        {/* Page Title */}
        <h1 className="find-jobs-title">Find best opportunities suits you</h1>

        {/* Layout */}
        <div className="find-jobs-layout">
          {/* Filters Sidebar */}
          <aside className="find-jobs-filters">
            <div className="find-jobs-filters__header">
              <h3>Filters</h3>
              <button className="find-jobs-filters__clear" onClick={clearFilters}>
                Clear All
              </button>
            </div>

            {/* Location */}
            <div className="filter-group">
              <label className="filter-group__label">Location</label>
              <select
                className="filter-group__select"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              >
                <option value="">Select</option>
                <option value="colombo">Colombo</option>
                <option value="kandy">Kandy</option>
                <option value="galle">Galle</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            {/* Job Level */}
            <div className="filter-group">
              <label className="filter-group__label">Job Level</label>
              <div className="filter-group__checkboxes">
                <label className="filter-checkbox">
                  <input type="checkbox" checked={filters.internship} onChange={() => handleCheckbox('internship')} />
                  Internship
                </label>
                <label className="filter-checkbox">
                  <input type="checkbox" checked={filters.entryLevel} onChange={() => handleCheckbox('entryLevel')} />
                  Entry Level
                </label>
                <label className="filter-checkbox">
                  <input type="checkbox" checked={filters.midSenior} onChange={() => handleCheckbox('midSenior')} />
                  Mid - Senior
                </label>
                <label className="filter-checkbox">
                  <input type="checkbox" checked={filters.senior} onChange={() => handleCheckbox('senior')} />
                  Senior
                </label>
              </div>
            </div>

            {/* Modality */}
            <div className="filter-group">
              <label className="filter-group__label">Modality</label>
              <div className="filter-group__checkboxes">
                <label className="filter-checkbox">
                  <input type="checkbox" checked={filters.remote} onChange={() => handleCheckbox('remote')} />
                  Remote
                </label>
                <label className="filter-checkbox">
                  <input type="checkbox" checked={filters.onSite} onChange={() => handleCheckbox('onSite')} />
                  On - Site
                </label>
                <label className="filter-checkbox">
                  <input type="checkbox" checked={filters.hybrid} onChange={() => handleCheckbox('hybrid')} />
                  Hybrid
                </label>
              </div>
            </div>

            {/* Salary */}
            <div className="filter-group">
              <div className="filter-salary__header">
                <label className="filter-group__label">Salary</label>
                <span className="filter-salary__value">{salary}K</span>
              </div>
              <input
                type="range"
                className="filter-salary__slider"
                min={30}
                max={200}
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
              />
              <div className="filter-salary__labels">
                <span>30K</span>
                <span>60K</span>
                <span>100K</span>
                <span>200K</span>
              </div>
            </div>
          </aside>

          {/* Right: Search + Jobs */}
          <div style={{ flex: 1 }}>
            {/* Search Bar */}
            <div className="find-jobs-search">
              <span className="find-jobs-search__icon">🔍</span>
              <input
                type="text"
                className="find-jobs-search__input"
                placeholder="Job title or keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <div className="find-jobs-search__divider" />
              <span className="find-jobs-search__icon">📍</span>
              <input
                type="text"
                className="find-jobs-search__input"
                placeholder="Colombo, Sri Lanka"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button className="find-jobs-search__btn">Search</button>
            </div>

            {/* Job Cards Grid */}
            <div className="find-jobs-grid">
              {sampleJobs.map((job) => (
                <div key={job.id} className="job-card">
                  <h3 className="job-card__title">{job.title}</h3>
                  <p className="job-card__company">{job.company}</p>
                  <div className="job-card__tags">
                    {job.tags.map((tag, i) => (
                      <span key={i} className="job-card__tag">{tag}</span>
                    ))}
                  </div>
                  <p className="job-card__description">{job.description}</p>
                  <button className="job-card__apply">Apply</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default FindJobs;
