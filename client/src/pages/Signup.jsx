import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Auth.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, email, password }) {
  const errors = {};
  if (!name.trim()) {
    errors.name = 'Name is required';
  }
  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Enter a valid email address';
  }
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  return errors;
}

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the field error as the user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Client-side validation first
    const errors = validate(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem(
          'user',
          JSON.stringify({ name: data.name, role: data.role, email: data.email })
        );
        window.dispatchEvent(new Event('auth-change'));
        navigate('/');
      } else if (data.errors) {
        // Map express-validator field-level errors
        const mapped = {};
        data.errors.forEach((err) => {
          mapped[err.path] = err.msg;
        });
        setFieldErrors(mapped);
      } else {
        setServerError(data.message || 'Registration failed');
      }
    } catch {
      setServerError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Join UniHelp</h1>
            <p className="auth-subtitle">Create an account to get started</p>
          </div>

          {serverError && <div className="auth-error">{serverError}</div>}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name / Company Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-input${fieldErrors.name ? ' input-error' : ''}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                autoComplete="name"
              />
              {fieldErrors.name && (
                <span className="field-error">{fieldErrors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input${fieldErrors.email ? ' input-error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                autoComplete="email"
              />
              {fieldErrors.email && (
                <span className="field-error">{fieldErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-input${fieldErrors.password ? ' input-error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
              />
              {fieldErrors.password && (
                <span className="field-error">{fieldErrors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="role">
                I am a...
              </label>
              <select
                id="role"
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">Student / User</option>
                <option value="employer">Employer / Recruiter</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
