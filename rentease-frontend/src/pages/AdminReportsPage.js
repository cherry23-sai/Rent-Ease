import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { getAuditLogs } from '../api/admin';
import { getErrorMessage } from '../api/client';

export default function AdminReportsPage() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLogs()
      .then(setLogs)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="page-head">
        <p className="page-eyebrow">Admin</p>
        <h1 className="page-title">Audit log</h1>
        <p className="page-sub">Every approval and rental decision made on the platform.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && logs.length === 0 && (
        <div className="empty"><p>No activity recorded yet.</p></div>
      )}

      {logs.length > 0 && (
        <div className="table-wrap">
          <table className="list-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Action</th>
                <th>Performed by</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td>{new Date(l.timestamp).toLocaleString()}</td>
                  <td>{l.action}</td>
                  <td>{l.performedByEmail}</td>
                  <td>{l.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}
