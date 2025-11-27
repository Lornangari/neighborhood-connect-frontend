import { useState, useEffect } from "react";
import axios from "axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("access");

  const fetchNotifications = async () => {
    if (!token) {
      setError("You must be logged in to view notifications.");
      return;
    }
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/notifications/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch notifications.");
    }
  };

  const markAllRead = async () => {
    if (!token) return;
    try {
      await axios.post("http://127.0.0.1:8000/api/notifications/mark-all-read/", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // refresh every 10s
    return () => clearInterval(interval);
    
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-cyan-900">Notifications</h1>
        <button
          onClick={markAllRead}
          className="py-2 px-4 bg-cyan-700 text-white rounded-lg hover:bg-cyan-900"
        >
          Mark All Read
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {notifications.length === 0 && !error && <p className="text-cyan-700">No notifications yet.</p>}

      <div className="grid gap-4">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`p-4 border-l-4 bg-white shadow-md rounded-md ${
              n.read ? "border-cyan-300" : "border-cyan-500"
            }`}
          >
            <p className="font-semibold text-cyan-800">{n.title || "Notification"}</p>
            <p className="text-cyan-700">{n.message}</p>
            <p className="text-sm text-cyan-400 mt-2">{new Date(n.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
