const LABELS = {
  AVAILABLE: 'Available',
  UNAVAILABLE: 'Unavailable',
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
};

export default function StatusBadge({ status }) {
  const cls = 'stamp stamp-' + String(status).toLowerCase();
  return <span className={cls}>{LABELS[status] || status}</span>;
}
