import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import StatusBadge from '../components/StatusBadge';
import { getIncomingOrders, approveOrder, rejectOrder } from '../api/orders';
import { getErrorMessage } from '../api/client';

export default function IncomingOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  function load() {
    setLoading(true);
    getIncomingOrders()
      .then(setOrders)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleAction(id, action) {
    setBusyId(id);
    setError('');
    try {
      if (action === 'approve') await approveOrder(id);
      else await rejectOrder(id);
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
        <p className="page-eyebrow">Requests</p>
        <h1 className="page-title">Rental requests</h1>
        <p className="page-sub">Approve or decline requests for your listings.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && orders.length === 0 && (
        <div className="empty"><p>No rental requests yet.</p></div>
      )}

      {orders.length > 0 && (
        <div className="table-wrap">
          <table className="list-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Requested by</th>
                <th>Qty</th>
                <th>Days</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.productName}</td>
                  <td>{o.renterName}</td>
                  <td>{o.quantity}</td>
                  <td>{o.rentalDays}</td>
                  <td>${Number(o.totalPrice).toFixed(2)}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>
                    {o.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-success btn-sm"
                          disabled={busyId === o.id}
                          onClick={() => handleAction(o.id, 'approve')}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          disabled={busyId === o.id}
                          onClick={() => handleAction(o.id, 'reject')}
                        >
                          Decline
                        </button>
                      </div>
                    )}
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
