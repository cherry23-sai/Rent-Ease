import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { getPendingUsers, approveUserById, rejectUserById } from '../api/admin';
import { getErrorMessage } from '../api/client';

export default function AdminApprovalsPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  function load() {
    setLoading(true);
    getPendingUsers()
      .then(setUsers)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleAction(id, action) {
    setBusyId(id);
    setError('');
    try {
      if (action === 'approve') await approveUserById(id);
      else await rejectUserById(id);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AppLayout>
      <div className="page-head">
        <p className="page-eyebrow">Admin</p>
        <h1 className="page-title">Pending approvals</h1>
        <p className="page-sub">New users and clients waiting for sign-off.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && users.length === 0 && (
        <div className="empty"><p>Nothing waiting for approval right now.</p></div>
      )}

      {users.length > 0 && (
        <div className="table-wrap">
          <table className="list-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.phone}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-success btn-sm"
                        disabled={busyId === u.id}
                        onClick={() => handleAction(u.id, 'approve')}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={busyId === u.id}
                        onClick={() => handleAction(u.id, 'reject')}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}
