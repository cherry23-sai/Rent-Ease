import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { getProduct, createProduct, updateProduct } from '../api/products';
import { getErrorMessage } from '../api/client';

const CATEGORIES = ['ELECTRONICS', 'TOOLS', 'FURNITURE', 'APPLIANCES', 'OUTDOOR', 'OTHER'];

const EMPTY = {
  name: '',
  description: '',
  category: 'ELECTRONICS',
  pricePerDay: '',
  quantity: 1,
  imageUrl: '',
};

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    getProduct(id)
      .then((p) => setForm({
        name: p.name,
        description: p.description || '',
        category: p.category,
        pricePerDay: p.pricePerDay,
        quantity: p.quantity,
        imageUrl: p.imageUrl || '',
      }))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const payload = {
      ...form,
      pricePerDay: Number(form.pricePerDay),
      quantity: Number(form.quantity),
    };
    try {
      if (isEdit) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate('/my-products');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <p className="page-sub">Loading…</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="page-head">
        <p className="page-eyebrow">Inventory</p>
        <h1 className="page-title">{isEdit ? 'Edit listing' : 'New listing'}</h1>
        <p className="page-sub">{isEdit ? 'Update the details renters will see.' : 'Add an item for others to rent.'}</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card form-card" style={{ maxWidth: 520 }}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Item name</label>
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} />
          </div>
          <div className="field-row">
            <div className="field">
              <label>Category</label>
              <select value={form.category} onChange={(e) => update('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Price per day ($)</label>
              <input type="number" step="0.01" min="0" required value={form.pricePerDay} onChange={(e) => update('pricePerDay', e.target.value)} />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Quantity available</label>
              <input type="number" min="0" required value={form.quantity} onChange={(e) => update('quantity', e.target.value)} />
            </div>
            <div className="field">
              <label>Image URL (optional)</label>
              <input value={form.imageUrl} onChange={(e) => update('imageUrl', e.target.value)} placeholder="https://…" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create listing'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/my-products')}>Cancel</button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
