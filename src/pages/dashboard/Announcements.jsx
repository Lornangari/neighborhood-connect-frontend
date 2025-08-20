import { useEffect, useState } from "react";
import axios from "axios";
import { Megaphone } from "lucide-react"; 

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    by: "Management",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null); // track expanded announcement

  const token = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user")); // must contain is_staff

  // Fetch announcements once
  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/announcements/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnnouncements(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load announcements");
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, [token]);

  // Create or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await axios.put(
          `http://127.0.0.1:8000/api/announcements/${editingId}/`,
          newAnnouncement,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAnnouncements(
          announcements.map((a) => (a.id === editingId ? res.data : a))
        );
        setEditingId(null);
      } else {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/announcements/",
          newAnnouncement,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAnnouncements([res.data, ...announcements]);
      }
      setNewAnnouncement({ title: "", message: "", by: "Management" });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create announcement");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/announcements/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(announcements.filter((a) => a.id !== id));
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete announcement");
    }
  };

  // Edit
  const handleEdit = (announcement) => {
    setNewAnnouncement({
      title: announcement.title,
      message: announcement.message,
      by: "Management",
    });
    setEditingId(announcement.id);
  };

  // Check if announcement is "new" (within last 24h)
  const isNew = (date) => {
    const posted = new Date(date);
    const now = new Date();
    return (now - posted) / (1000 * 60 * 60) < 24;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-cyan-900 mb-4 flex items-center gap-2">
        <Megaphone className="w-6 h-6 text-cyan-800" />
        Announcements
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Admin form */}
          {user?.is_staff && (
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow p-4 rounded mb-6"
            >
              <h3 className="text-lg font-semibold mb-3">
                {editingId ? "Edit Announcement" : "Create Announcement"}
              </h3>
              <input
                type="text"
                placeholder="Title"
                value={newAnnouncement.title}
                onChange={(e) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    title: e.target.value,
                  })
                }
                className="w-full border p-2 rounded mb-3"
              />
              <textarea
                placeholder="Message"
                value={newAnnouncement.message}
                onChange={(e) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    message: e.target.value,
                  })
                }
                className="w-full border p-2 rounded mb-3"
              ></textarea>
              <button
                type="submit"
                className="bg-cyan-900 text-white px-4 py-2 rounded"
              >
                {editingId ? "Update" : "Post"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setNewAnnouncement({
                      title: "",
                      message: "",
                      by: "Management",
                    });
                  }}
                  className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              )}
            </form>
          )}

          {/* Display announcements */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {announcements.map((a) => {
              const isExpanded = expandedId === a.id;
              return (
                <div
                  key={a.id}
                  className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col justify-between h-full"
                >
                  {/* Title */}
                  <div className="flex items-center gap-2 mb-2">
                    <h3
                      className="text-xl font-bold text-cyan-900 line-clamp-2"
                      title={a.title}
                    >
                      {a.title}
                    </h3>

                    {isNew(a.created_at) && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>

                  {/* Message (expandable inline) */}
                  <p className="text-gray-700 leading-relaxed">
                    {isExpanded
                      ? a.message
                      : a.message.length > 120
                      ? `${a.message.slice(0, 120)}...`
                      : a.message}
                  </p>
                  {a.message.length > 120 && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : a.id)
                      }
                      className="text-cyan-900 hover:underline text-sm mt-2 self-start"
                    >
                      {isExpanded ? "Show Less" : "Read More"}
                    </button>
                  )}

                  {/* Footer pinned bottom */}
                  <div className="mt-auto pt-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {a.by}</span>
                      <span>{new Date(a.created_at).toLocaleString()}</span>
                    </div>

                    {/* Admin controls */}
                    {user?.is_staff && (
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() => handleEdit(a)}
                          className="flex-1 bg-cyan-800 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="flex-1 bg-cyan-800 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Announcements;
