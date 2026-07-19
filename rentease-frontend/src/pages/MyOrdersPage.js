import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import StatusBadge from '../components/StatusBadge';
import { getMyOrders, cancelOrder } from '../api/orders';
import { getErrorMessage } from '../api/client';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    getMyOrders()
      .then(setOrders)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCancel(id) {
    try {
      await cancelOrder(id);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <AppLayout>
      <div className="page-head">
        <p className="page-eyebrow">Rentals</p>
        <h1 className="page-title">My orders</h1>
        <p className="page-sub">Track the status of everything you've requested to rent.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && orders.length === 0 && (
        <div className="empty"><p>You haven't requested anything yet.</p></div>
      )}

      {orders.length > 0 && (
        <div className="table-wrap">
          <table className="list-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Owner</th>
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
                  <td>{o.ownerName}</td>
                  <td>{o.quantity}</td>
                  <td>{o.rentalDays}</td>
                  <td>${Number(o.totalPrice).toFixed(2)}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>
                    {o.status === 'PENDING' && (
                      <button className="btn btn-ghost btn-sm" onClick={() => handleCancel(o.id)}>Cancel</button>
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
