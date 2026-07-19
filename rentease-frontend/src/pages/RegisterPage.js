import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authApi from '../api/auth';
import { getErrorMessage } from '../api/client';
import './AuthPages.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('USER');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const call = role === 'CLIENT' ? authApi.registerClient : authApi.registerUser;
      const message = await call(form);
      setSuccess(typeof message === 'string' ? message : 'Registered. Awaiting approval.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="auth-brand">RENT<span className="dot">·</span>EASE</p>
        <p className="auth-tagline">Create an account to rent gear or list your own.</p>

        <div className="auth-tabs">
          <button
            type="button"
            className={'auth-tab' + (role === 'USER' ? ' active' : '')}
            onClick={() => setRole('USER')}
          >
            I want to rent
          </button>
          <button
            type="button"
            className={'auth-tab' + (role === 'CLIENT' ? ' active' : '')}
            onClick={() => setRole('CLIENT')}
          >
            I want to list items
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" required value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" required minLength={6} value={form.password} onChange={(e) => update('password', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="address">Address</label>
            <input id="address" value={form.address} onChange={(e) => update('address', e.target.value)} />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-foot">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
