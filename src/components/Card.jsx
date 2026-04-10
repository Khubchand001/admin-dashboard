export default function Card({ title, value, color }) {
  return (
    <div className={`p-4 rounded text-white ${color}`}>
      <h2>{title}</h2>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}