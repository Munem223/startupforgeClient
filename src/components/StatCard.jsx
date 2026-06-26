export default function StatCard({ icon: Icon, label, value, note }) {
  return (
    <article className="stat-card surface-card">
      <span className="stat-icon">{Icon && <Icon size={22} />}</span>
      <div><p>{label}</p><strong>{value}</strong>{note && <small>{note}</small>}</div>
    </article>
  );
}
