import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { authenticatedFetch } from "../utils/auth";
import API_BASE_URL from "../utils/Setup";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    authenticatedFetch(`${API_BASE_URL}/notification/`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Notification data:", data);
        if (Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        } else {
          setError("Invalid response structure");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch notifications");
        setLoading(false);
      });
  }, []); // <- Important to avoid infinite loop

  return (
    <>
      <Navbar />
      <div className="p-4 text-white">
        <h2 className="text-2xl font-bold mb-4">Notifications</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && notifications.length === 0 && (
          <p>No notifications found.</p>
        )}

        <ul className="space-y-2">
          {notifications.map((n, index) => (
            <li
              key={index}
              className={`p-3 rounded-lg ${
                n.read ? "bg-gray-700" : "bg-blue-600"
              }`}
            >
              <p>{n.message}</p>
              <span className="text-sm text-gray-300">{n.timestamp}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
