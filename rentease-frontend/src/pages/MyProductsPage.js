import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StatusBadge from '../components/StatusBadge';
import { getMyProducts, deleteProduct, setProductStatus } from '../api/products';
import { getErrorMessage } from '../api/client';

export default function MyProductsPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    getMyProducts()
      .then(setProducts)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await deleteProduct(id);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleToggle(product) {
    const next = product.status === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
    try {
      await setProductStatus(product.id, next);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <AppLayout>
      <div className="page-head" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <p className="page-eyebrow">Inventory</p>
          <h1 className="page-title">My listings</h1>
          <p className="page-sub">Manage the items you're renting out.</p>
        </div>
        <Link to="/my-products/new" className="btn btn-primary">+ New listing</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && products.length === 0 && (
        <div className="empty">
          <p>You haven't listed anything yet.</p>
          <Link to="/my-products/new" className="btn btn-primary">List your first item</Link>
        </div>
      )}

      {products.length > 0 && (
        <div className="table-wrap">
          <table className="list-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Price / day</th>
                <th>Qty</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>${Number(p.pricePerDay).toFixed(2)}</td>
                  <td>{p.quantity}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleToggle(p)}>
                        {p.status === 'AVAILABLE' ? 'Deactivate' : 'Activate'}
                      </button>
                      <Link className="btn btn-ghost btn-sm" to={`/my-products/${p.id}/edit`}>Edit</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
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
