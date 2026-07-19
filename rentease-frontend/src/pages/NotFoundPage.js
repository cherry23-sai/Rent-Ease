import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 12, background: 'var(--paper)'
    }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--slate-soft)' }}>404</p>
      <h1 style={{ margin: 0 }}>Page not found</h1>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 12 }}>Go home</Link>
    </div>
  );
}
