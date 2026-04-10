import { useEffect, useState } from "react";
import API from "../api/axios";
import Card from "../components/Card";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [chart, setChart] = useState([]);

  // ✅ ALWAYS TOP LEVEL
  useEffect(() => {
    API.get("/analytics/dashboard").then(res => setData(res.data));
    API.get("/analytics/appointments-per-day").then(res => setChart(res.data));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4 mt-6">
        <Card title="Doctors" value={data.overview.total_doctors} color="bg-blue-500"/>
        <Card title="Appointments" value={data.overview.total_appointments} color="bg-green-500"/>
        <Card title="Revenue" value={`₹${data.overview.revenue}`} color="bg-purple-500"/>
        <Card title="Rating" value={data.ratings.average_rating} color="bg-yellow-500"/>
      </div>

      {/* 📊 Chart */}
      <div className="mt-10">
        <LineChart width={600} height={300} data={chart}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" />
        </LineChart>
      </div>
    </div>
  );
}