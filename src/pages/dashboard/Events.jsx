import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/UseAuth.jsx";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

export default function Events() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: null,
  });
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/events/");
      setEvents(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch events.");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    if (!token) { setError("You must be logged in to add an event."); return; }

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if(formData[key]) data.append(key, formData[key]);
      });

      await axios.post("http://127.0.0.1:8000/api/events/", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData({ title: "", description: "", date: "", location: "", image: null });
      fetchEvents();
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to add event.");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("access");
    if (!token) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/events/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConfirmDelete(null);
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const isUpcoming = (date) => new Date(date) >= new Date();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row bg-gradient-to-r from-cyan-700 to-cyan-500 rounded-3xl shadow-xl overflow-hidden">
        <div className="flex-1 p-12 text-white">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
            Your Community, Your Events
          </h1>
          <p className="text-lg opacity-90">
            Explore upcoming events, connect with locals, and make your mark in the neighborhood.
          </p>
        </div>
        <div className="flex-1 relative hidden md:block">
          <motion.div
            className="absolute top-[-20%] right-[-10%] opacity-20 text-[18rem]"
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          >
            <Calendar size={400} />
          </motion.div>
        </div>
      </div>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {/* ADMIN FORM */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto mb-10 bg-white p-6 rounded-3xl shadow-xl border border-cyan-100"
        >
          <h2 className="text-2xl font-bold text-cyan-900 mb-4 text-center">Add New Event</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white border border-cyan-800 focus:ring-1 focus:ring-cyan-800 text-cyan-900"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white border border-cyan-800 focus:ring-1 focus:ring-cyan-800 text-cyan-900"
              rows="3"
              required
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white border border-cyan-800 focus:ring-1 focus:ring-cyan-800 text-cyan-900"
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white border border-cyan-800 focus:ring-1 focus:ring-cyan-800 text-cyan-900"
              required
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-cyan-900"
            />
            <button
              type="submit"
              className="w-full py-3 bg-cyan-800 text-white font-semibold rounded-2xl hover:bg-cyan-700 transition"
            >
              Add Event
            </button>
          </form>
        </motion.div>
      )}

      {/* EVENTS GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="relative rounded-3xl shadow-lg overflow-hidden border border-cyan-100 flex flex-col"
          >
            {event.image && (
              <div className="relative">
                <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            )}
            <div className="p-5 bg-white flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-cyan-900 flex items-center gap-2">
                <Calendar size={18} className="text-cyan-700" /> {event.title}
              </h3>
              <p className="text-gray-700 text-sm my-2 flex-1">{event.description}</p>
              <div className="flex justify-between items-center text-gray-600 text-sm">
                <span className="flex items-center gap-1"><MapPin size={14} /> {event.location}</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> {event.date}</span>
              </div>
              {isUpcoming(event.date) && (
                <span className="absolute top-3 left-3 px-3 py-1 bg-cyan-500 text-white rounded-2xl text-xs font-semibold shadow-md">
                  Upcoming
                </span>
              )}
              {isAdmin && (
                <button
                  onClick={() => setConfirmDelete(event.id)}
                  className="mt-4 w-full py-2 bg-cyan-700 text-white rounded-xl hover:bg-cyan-900 transition self-end"
                >
                  Delete
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center"
            >
              <h2 className="text-xl font-bold text-cyan-900 mb-3">Confirm Delete</h2>
              <p className="text-gray-700 mb-5">Are you sure you want to delete this event?</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="w-1/2 py-2 bg-gray-300 rounded-xl hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="w-1/2 py-2 bg-cyan-700 text-white rounded-xl hover:bg-cyan-900 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
