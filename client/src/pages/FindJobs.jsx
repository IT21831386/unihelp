import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './FindJobs.css';

const PAGE_SIZE = 10;

const LEVEL_LABELS = {
  internship: 'Internship',
  entry: 'Entry Level',
  'mid-senior': 'Mid-Senior',
  senior: 'Senior',
};

const MODALITY_LABELS = {
  remote: 'Remote',
  'on-site': 'On-Site',
  hybrid: 'Hybrid',
};

const LOCATION_LABELS = {
  colombo: 'Colombo',
  kandy: 'Kandy',
  galle: 'Galle',
  remote: 'Remote',
};

function FindJobs() {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Search
  const [keyword, setKeyword] = useState('');
  const [locationSearch, setLocationSearch] = useState('');

  // Filters
  const [filters, setFilters] = useState({
    location: '',
    internship: false,
    entryLevel: false,
    midSenior: false,
    senior: false,
    remote: false,
    onSite: false,
    hybrid: false,
  });
  const [salary, setSalary] = useState(600);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/jobs');
        const data = await res.json();
        if (res.ok) {
          // jobController returns the array directly via res.json(jobs)
          setAllJobs(Array.isArray(data) ? data : (data.jobs || []));
        } else {
          setError(data.message || 'Failed to load jobs');
        }
      } catch {
        setError('Failed to connect to the server');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter + search logic
  const filteredJobs = allJobs.filter((job) => {
    // Keyword search
    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      const matchesKeyword =
        job.title.toLowerCase().includes(kw) ||
        job.company.toLowerCase().includes(kw) ||
        job.description.toLowerCase().includes(kw);
      if (!matchesKeyword) return false;
    }

    // Location search bar
    if (locationSearch.trim()) {
      const loc = locationSearch.toLowerCase();
      if (!LOCATION_LABELS[job.location]?.toLowerCase().includes(loc)) return false;
    }

    // Location dropdown filter
    if (filters.location && job.location !== filters.location) return false;

    // Level filters (if any checked, only show matching)
    const levelFilters = [];
    if (filters.internship) levelFilters.push('internship');
    if (filters.entryLevel) levelFilters.push('entry');
    if (filters.midSenior) levelFilters.push('mid-senior');
    if (filters.senior) levelFilters.push('senior');
    if (levelFilters.length > 0 && !levelFilters.includes(job.level)) return false;

    // Modality filters
    const modalityFilters = [];
    if (filters.remote) modalityFilters.push('remote');
    if (filters.onSite) modalityFilters.push('on-site');
    if (filters.hybrid) modalityFilters.push('hybrid');
    if (modalityFilters.length > 0 && !modalityFilters.includes(job.modality)) return false;

    // Salary filter (salary slider is in K, job.salary is in LKR)
    if (job.salary > salary * 1000) return false;

    return true;
  });

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [keyword, locationSearch, filters, salary]);

  const visibleJobs = filteredJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredJobs.length;

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
    setSalary(600);
    setKeyword('');
    setLocationSearch('');
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const formatSalary = (val) => {
    return Number(val).toLocaleString() + ' LKR';
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
                max={600}
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
              />
              <div className="filter-salary__labels">
                <span>30K</span>
                <span>150K</span>
                <span>300K</span>
                <span>600K</span>
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
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
              />
              <button className="find-jobs-search__btn" onClick={() => setVisibleCount(PAGE_SIZE)}>
                Search
              </button>
            </div>

            {/* Results count */}
            <div className="find-jobs-results-info">
              Showing {visibleJobs.length} of {filteredJobs.length} jobs
            </div>

            {/* Loading state */}
            {loading && (
              <div className="find-jobs-loading">
                <div className="find-jobs-spinner" />
                <p>Loading jobs...</p>
              </div>
            )}

            {/* Error state */}
            {error && <div className="find-jobs-error">⚠️ {error}</div>}

            {/* Empty state */}
            {!loading && !error && filteredJobs.length === 0 && (
              <div className="find-jobs-empty">
                <div className="find-jobs-empty__icon">🔍</div>
                <p>No jobs match your filters</p>
                <span>Try adjusting your search criteria or clearing filters</span>
              </div>
            )}

            {/* Job Cards Grid */}
            <div className="find-jobs-grid">
              {visibleJobs.map((job) => (
                <div key={job._id} className="job-card">
                  <h3 className="job-card__title">{job.title}</h3>
                  <p className="job-card__company">{job.company}</p>
                  <div className="job-card__tags">
                    <span className="job-card__tag">{LEVEL_LABELS[job.level] || job.level}</span>
                    <span className="job-card__tag">{MODALITY_LABELS[job.modality] || job.modality}</span>
                    <span className="job-card__tag">{LOCATION_LABELS[job.location] || job.location}</span>
                  </div>
                  <div className="job-card__salary">{formatSalary(job.salary)}</div>
                  <p className="job-card__description">{job.description}</p>
                  <a href={`mailto:${job.contactEmail}`} className="job-card__apply">
                    Apply
                  </a>
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && !loading && (
              <div className="find-jobs-load-more">
                <button className="find-jobs-load-more__btn" onClick={handleLoadMore}>
                  Load More ({filteredJobs.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default FindJobs;
