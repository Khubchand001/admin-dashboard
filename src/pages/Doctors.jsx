import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Doctors() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/doctors").then(res => setData(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Doctors</h1>

      <table className="w-full mt-4 border">
        <thead className="bg-gray-200">
          <tr>
            <th>Name</th>
            <th>Specialization</th>
            <th>Experience</th>
            <th>Export</th>
          </tr>
        </thead>

        <tbody>
          {data.map(d => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.specialization}</td>
              <td>{d.experience}</td>
              <td>
                <button
                  onClick={() =>
                    window.open(`http://127.0.0.1:8000/export/doctor/${d.id}`)
                  }
                  className="bg-green-500 text-white px-2 py-1"
                >
                  Export
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}