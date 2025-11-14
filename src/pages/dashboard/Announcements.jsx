import { useEffect, useState } from "react";
import axios from "axios";
import { Megaphone } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

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
  const [expandedId, setExpandedId] = useState(null);

  const token = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/announcements/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAnnouncements(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load announcements");
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, [token]);

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

  const handleEdit = (announcement) => {
    setNewAnnouncement({
      title: announcement.title,
      message: announcement.message,
      by: "Management",
    });
    setEditingId(announcement.id);
  };

  const isNew = (date) => {
    const posted = new Date(date);
    const now = new Date();
    return (now - posted) / (1000 * 60 * 60) < 24;
  };

  return (
    <div className="p-6">
      {/* ===== Page Header ===== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl p-6 mb-8 shadow-lg flex items-center gap-4 bg-white border-l-8 border-cyan-800"
      >
        <Megaphone size={28} className="text-cyan-800" />
        <div>
          <h1 className="text-3xl font-bold text-cyan-900">Community Announcements</h1>
          <p className="text-cyan-900 mt-1">
            Stay up-to-date with the latest events, news, and announcements in your neighborhood.
          </p>
        </div>
      </motion.div>

      {loading ? (
        <p className="text-gray-500">Loading announcements...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Admin Form */}
          {user?.is_staff && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white text-cyan-900 border border-cyan-100 rounded-2xl p-6 mb-8 shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-4">
                {editingId ? "Edit Announcement" : "Create Announcement"}
              </h3>
              <input
                type="text"
                placeholder="Title"
                value={newAnnouncement.title}
                onChange={(e) =>
                  setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                }
                className="w-full border border-cyan-800 p-3 rounded mb-3 focus:ring-1 focus:ring-cyan-800 focus:outline-none text-cyan-900"
              />
              <textarea
                placeholder="Message"
                value={newAnnouncement.message}
                onChange={(e) =>
                  setNewAnnouncement({ ...newAnnouncement, message: e.target.value })
                }
                className="w-full border border-cyan-800 p-3 rounded mb-3 focus:ring-1 focus:ring-cyan-800 focus:outline-none text-cyan-900"
              ></textarea>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-cyan-800 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg font-semibold transition"
                >
                  {editingId ? "Update" : "Post"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setNewAnnouncement({ title: "", message: "", by: "Management" });
                    }}
                    className="bg-gray-300 text-cyan-800 px-5 py-2 rounded-lg hover:bg-cyan-700 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.form>
          )}

          {/* Announcements Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {announcements.map((a) => {
              const isExpanded = expandedId === a.id;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-3xl shadow-xl border border-cyan-200 overflow-hidden flex flex-col justify-between h-full transition transform hover:-translate-y-1"
                >
                  {/* Card Header */}
                  <div className="bg-cyan-50 p-4 flex items-center justify-between border-b border-cyan-800">
                    <h3 className="text-lg font-bold line-clamp-1 text-cyan-900">{a.title}</h3>
                    {isNew(a.created_at) && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>

                  {/* Message Body */}
                  <div className="p-4 flex-1">
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
                        onClick={() => setExpandedId(isExpanded ? null : a.id)}
                        className="text-cyan-800 hover:underline text-sm mt-2"
                      >
                        {isExpanded ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="bg-gray-50 p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {a.by}</span>
                      <span>{new Date(a.created_at).toLocaleString()}</span>
                    </div>
                    {user?.is_staff && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(a)}
                          className="flex-1 bg-cyan-800 hover:bg-cyan-700 text-white px-4 py-2 rounded-full transition font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="flex-1 bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-2 rounded-full transition font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Announcements;
