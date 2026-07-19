import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { getProfile, updateProfile, changePassword } from '../api/profile';
import { getErrorMessage } from '../api/client';

export default function ProfilePage() {
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    getProfile()
      .then((p) => {
        setMeta(p);
        setForm({ name: p.name || '', phone: p.phone || '', address: p.address || '' });
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await updateProfile(form);
      setSuccess('Profile updated.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    setPwSaving(true);
    try {
      await changePassword(pwForm);
      setPwSuccess('Password updated.');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPwError(getErrorMessage(err));
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <AppLayout>
      <div className="page-head">
        <p className="page-eyebrow">Account</p>
        <h1 className="page-title">Profile</h1>
        <p className="page-sub">{meta?.email} · {meta?.role?.replace('_', ' ')}</p>
      </div>

      {!loading && (
        <>
          <div className="card" style={{ maxWidth: 480, marginBottom: 24 }}>
            <p className="section-title">Personal details</p>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSave}>
              <div className="field">
                <label>Name</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="field">
                <label>Phone</label>
                <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="field">
                <label>Address</label>
                <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
              </div>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </form>
          </div>

          <div className="card" style={{ maxWidth: 480 }}>
            <p className="section-title">Change password</p>
            {pwError && <div className="alert alert-error">{pwError}</div>}
            {pwSuccess && <div className="alert alert-success">{pwSuccess}</div>}
            <form onSubmit={handlePasswordChange}>
              <div className="field">
                <label>Current password</label>
                <input
                  type="password"
                  required
                  value={pwForm.currentPassword}
                  onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>New password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={pwForm.newPassword}
                  onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={pwSaving}>
                {pwSaving ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </div>
        </>
      )}
    </AppLayout>
  );
}
