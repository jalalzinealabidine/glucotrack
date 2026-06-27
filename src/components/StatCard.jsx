function StatCard({ label, value, helper }) {
  return (
    <section className="stat-card">
      <p>{label}</p>
      <strong>{value}</strong>
      {helper && <span>{helper}</span>}
    </section>
  );
}

export default StatCard;
