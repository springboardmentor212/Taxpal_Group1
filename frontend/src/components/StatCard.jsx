export default function StatCard({ title, value }) {
  return (
    <div className="chart-card">
      <p style={{ color: "#9aa3b2", marginBottom: 6 }}>{title}</p>
      <h2 style={{ margin: 0 }}>{value}</h2>
    </div>
  );
}
