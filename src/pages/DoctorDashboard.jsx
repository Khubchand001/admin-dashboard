import { useEffect, useState } from "react";
import API from "../api/axios";

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    API.get("/appointments/my").then(res => setPatients(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">My Patients</h1>

      <table className="w-full mt-4 border">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {patients.map(p => (
            <tr key={p.id}>
              <td>{p.patient_name}</td>
              <td>{p.date}</td>
              <td>{p.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}