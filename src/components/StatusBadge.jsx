export default function StatusBadge({ status = "pending" }) {
  const normalized = String(status).toLowerCase();
  return <span className={`status-badge status-${normalized}`}>{normalized}</span>;
}
