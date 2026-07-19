import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import Modal from '../components/Modal';
import { browseProducts } from '../api/products';
import { createOrder } from '../api/orders';
import { getErrorMessage } from '../api/client';

const CATEGORIES = ['ELECTRONICS', 'TOOLS', 'FURNITURE', 'APPLIANCES', 'OUTDOOR', 'OTHER'];

export default function ProductsBrowsePage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [renting, setRenting] = useState(null);

  function load() {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    browseProducts(params)
      .then(setProducts)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  return (
    <AppLayout>
      <div className="page-head">
        <p className="page-eyebrow">Catalog</p>
        <h1 className="page-title">Browse gear to rent</h1>
        <p className="page-sub">Everything here is available today from other members.</p>
      </div>

      <div className="field-row" style={{ marginBottom: 24 }}>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Search</label>
          <input
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && products.length === 0 && (
        <div className="empty">
          <p>No products match your search yet.</p>
        </div>
      )}

      <div className="grid">
        {products.map((p) => (
          <div className="tag-card" key={p.id}>
            <div
              className="tag-card-image"
              style={p.imageUrl ? { backgroundImage: `url(${p.imageUrl})` } : undefined}
            >
              {!p.imageUrl && p.category}
            </div>
            <div className="tag-card-body">
              <span className="tag-card-cat">{p.category}</span>
              <h3 className="tag-card-title">{p.name}</h3>
              <div className="tag-card-price">
                ${Number(p.pricePerDay).toFixed(2)} <span>/ day · {p.quantity} in stock</span>
              </div>
              <div className="tag-card-foot">
                <span style={{ fontSize: 12, color: 'var(--slate-soft)' }}>Listed by {p.ownerName}</span>
                <button className="btn btn-primary btn-sm" onClick={() => setRenting(p)}>Rent</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {renting && (
        <RentModal
          product={renting}
          onClose={() => setRenting(null)}
          onDone={() => { setRenting(null); load(); }}
        />
      )}
    </AppLayout>
  );
}

function RentModal({ product, onClose, onDone }) {
  const [quantity, setQuantity] = useState(1);
  const [rentalDays, setRentalDays] = useState(1);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const total = (Number(product.pricePerDay) * quantity * rentalDays) || 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await createOrder({ productId: product.id, quantity: Number(quantity), rentalDays: Number(rentalDays) });
      onDone();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title={`Rent ${product.name}`} onClose={onClose}>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field-row">
          <div className="field">
            <label>Quantity</label>
            <input
              type="number"
              min={1}
              max={product.quantity}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Rental days</label>
            <input
              type="number"
              min={1}
              value={rentalDays}
              onChange={(e) => setRentalDays(e.target.value)}
            />
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 18 }}>
          Total: ${total.toFixed(2)}
        </p>
        <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
          {submitting ? 'Sending request…' : 'Send rental request'}
        </button>
      </form>
    </Modal>
  );
}
