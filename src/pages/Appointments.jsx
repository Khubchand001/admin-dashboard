import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Appointments() {
  const [data, setData] = useState([]);

  const load = () => {
    API.get("/appointments/").then(res => setData(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const deleteAppointment = (id) => {
    API.delete(`/appointments/${id}`).then(() => load());
  };

  return (
    <div className="p-6">
      <h1>Appointments</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Date</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map(a => (
            <tr key={a.id}>
              <td>{a.patient_name}</td>
              <td>{a.date}</td>
              <td>{a.time}</td>
              <td>
                <button onClick={() => deleteAppointment(a.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}