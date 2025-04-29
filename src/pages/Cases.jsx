import React, { useEffect, useState } from "react";
import { authenticatedFetch } from "../utils/auth";
import API_BASE_URL from "../utils/Setup";
import {redirectIfIncomplete} from '../utils/navigation'
const Cases = () => {
  const [cases, setCases] = useState([]);
  useEffect((
    
  )=>{
    redirectIfIncomplete('/coming-soon',true)
  },[])
  useEffect(() => {
    authenticatedFetch(`${API_BASE_URL}/cases/list`, {
      method: "POST",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setCases(data))
      .catch(err => console.error("Error fetching cases:", err));
  }, []);

  return (
    <>
      <div className="p-6 text-white">
        <h2 className="text-xl font-bold mb-4">My Cases</h2>
        <ul className="space-y-4">
          {cases.length > 0 ? (
            cases.map((item, i) => (
              <li key={i} className="bg-black/30 p-4 rounded-xl border border-white/20 shadow">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.description}</p>
                <span className="text-xs text-gray-400">Status: {item.status}</span>
              </li>
            ))
          ) : (
            <li>No cases found.</li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Cases;
