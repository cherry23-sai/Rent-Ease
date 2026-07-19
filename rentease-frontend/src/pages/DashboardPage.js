import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import { getDashboard } from '../api/dashboard';
import { getErrorMessage } from '../api/client';

function money(v) {
  return '$' + Number(v || 0).toFixed(2);
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  return (
    <AppLayout>
      <div className="page-head">
        <p className="page-eyebrow">Overview</p>
        <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="page-sub">Here's what's happening with your account today.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {data && data.role === 'SUPER_ADMIN' && (
        <div className="stat-grid">
          <Stat label="Total users" value={data.totalUsers} />
          <Stat label="Clients" value={data.totalClients} />
          <Stat label="Pending approvals" value={data.pendingApprovals} />
        </div>
      )}

      {data && data.role === 'CLIENT' && (
        <div className="stat-grid">
          <Stat label="My listings" value={data.totalProducts} />
          <Stat label="Currently available" value={data.availableProducts} />
          <Stat label="Pending requests" value={data.pendingIncomingOrders} />
          <Stat label="Total earnings" value={money(data.totalEarnings)} />
        </div>
      )}

      {data && data.role === 'USER' && (
        <div className="stat-grid">
          <Stat label="Pending requests" value={data.pendingOrders} />
          <Stat label="Approved rentals" value={data.approvedOrders} />
          <Stat label="Total spent" value={money(data.totalSpent)} />
        </div>
      )}
    </AppLayout>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value ?? '—'}</p>
    </div>
  );
}
