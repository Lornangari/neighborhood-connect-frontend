import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/UseAuth.jsx";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Phone, Tag } from "lucide-react";

export default function Business() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [businesses, setBusinesses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "other",
    contact_info: "",
    image: null,
  });
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setError("You must be logged in to view businesses.");
      return;
    }
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/businesses/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBusinesses(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch businesses.");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");
    if (!token) {
      setError("You must be logged in to add a business.");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("contact_info", formData.contact_info);
      if (formData.image) data.append("image", formData.image);

      await axios.post("http://127.0.0.1:8000/api/businesses/", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData({
        name: "",
        description: "",
        category: "other",
        contact_info: "",
        image: null,
      });

      fetchBusinesses();
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to add business.");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("access");
    if (!token) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/businesses/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setConfirmDelete(null);
      fetchBusinesses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white p-6">

      {/* HEADER SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto mb-12 bg-gray-100 p-8 rounded-3xl shadow-lg"
      >
        <h1 className="text-5xl font-extrabold text-cyan-900 mb-3 text-center drop-shadow">
          Local Business Hub
        </h1>
        <p className="text-cyan-900 text-center text-lg">
          Discover, support, and connect with businesses around you.
        </p>
      </motion.div>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {/* ADMIN FORM */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg mb-10 border border-cyan-100"
        >
          <h2 className="text-2xl font-bold text-cyan-900 mb-4 flex items-center gap-2">
            <Building2 className="text-cyan-700" /> Add New Business
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Business Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-cyan-900 rounded-lg"
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-cyan-900 rounded-lg"
              rows="3"
              required
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-cyan-900 rounded-lg"
            >
              <option value="restaurant">Restaurant</option>
              <option value="retail">Retail</option>
              <option value="service">Service</option>
              <option value="other">Other</option>
            </select>

            <input
              type="text"
              name="contact_info"
              placeholder="Contact Info"
              value={formData.contact_info}
              onChange={handleChange}
              className="w-full p-2 border border-cyan-900 rounded-lg"
            />

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-sm"
            />

            <button
              type="submit"
              className="w-full py-2 bg-cyan-900 text-white rounded-lg hover:bg-cyan-700"
            >
              Add Business
            </button>
          </form>
        </motion.div>
      )}

      {/* BUSINESS CARDS */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {businesses.map((b, index) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col justify-between border border-cyan-100"
            >
              {b.image && (
                <img
                  src={b.image}
                  alt={b.name}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4 flex flex-col flex-grow space-y-2">
                <h3 className="text-xl font-semibold text-cyan-900 flex items-center gap-2">
                  <Building2 className="text-cyan-900" /> {b.name}
                </h3>

                <p className="text-cyan-800 text-sm flex-grow">{b.description}</p>

                <div className="flex justify-between items-center text-sm mt-3">
                  <span className="flex items-center gap-1 text-cyan-900">
                    <Tag size={14} /> {b.category}
                  </span>

                  {b.contact_info && (
                    <span className="flex items-center gap-1 text-cyan-900">
                      <Phone size={14} /> {b.contact_info}
                    </span>
                  )}
                </div>

                {isAdmin && (
                  <button
                    onClick={() => setConfirmDelete(b.id)}
                    className="mt-4 w-full py-2 bg-cyan-800 text-white rounded-lg hover:bg-cyan-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center"
            >
              <h2 className="text-xl font-bold text-cyan-900 mb-3">
                Confirm Delete
              </h2>
              <p className="text-gray-700">
                Are you sure you want to delete this business?
              </p>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="w-1/2 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="w-1/2 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-900"
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
