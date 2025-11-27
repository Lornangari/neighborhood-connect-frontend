import React, { useState, useEffect, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Bell,
  Calendar,
  Users,
  PlusCircle,
  MessageSquare,
  Megaphone,
  Sparkles
} from "lucide-react";
import axios from "axios";

const Homed = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const user = storedUser?.username || storedUser?.name || "Guest";
  const token = localStorage.getItem("access");

  const [stats, setStats] = useState([
    { title: "Community Members", value: 120, icon: <Users size={22} /> },
    { title: "Active Events", value: 0, icon: <Calendar size={22} /> },
    { title: "Recent Posts", value: 0, icon: <MessageSquare size={22} /> },
    { title: "New Announcements", value: 0, icon: <Bell size={22} /> },
  ]);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [postsRes, eventsRes, annRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/posts/", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://127.0.0.1:8000/api/events/", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://127.0.0.1:8000/api/announcements/", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setPosts(postsRes.data || []);
        setEvents(eventsRes.data || []);
        setAnnouncements(annRes.data || []);

        // Update stats immediately
        setStats(prev => [
          prev[0],
          { ...prev[1], value: (eventsRes.data || []).length },
          { ...prev[2], value: (postsRes.data || []).length },
          { ...prev[3], value: (annRes.data || []).length },
        ]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, [token]);

  
  const highlights = useMemo(() => {
    if (!posts.length && !events.length && !announcements.length) return [];

    let formatted = [];

   
    posts.slice(0, 2).forEach(p => formatted.push({ id: `post-${p.id}`, type: "post", user: p.user, title: p.message }));
    if (announcements[0]) formatted.push({ id: `announcement-${announcements[0].id}`, type: "announcement", user: announcements[0].user || "Admin", title: announcements[0].title });
    if (events[0]) formatted.push({ id: `event-${events[0].id}`, type: "event", user: events[0].organizer || "Event Admin", title: events[0].title });

    
    if (expanded) {
      if (posts[2]) formatted.push({ id: `post-${posts[2].id}`, type: "post", user: posts[2].user, title: posts[2].message });
      if (announcements[1]) formatted.push({ id: `announcement-${announcements[1].id}`, type: "announcement", user: announcements[1].user || "Admin", title: announcements[1].title });
    }

    return formatted;
  }, [posts, events, announcements, expanded]);

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
  const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-cyan-800 to-cyan-600 text-white rounded-2xl shadow-xl p-8 mb-10 relative overflow-hidden border border-white/10 backdrop-blur"
      >
        <Sparkles className="absolute top-4 right-4 text-white opacity-40" size={28} />
        <h1 className="text-3xl font-bold tracking-wide">Welcome back, {user}!</h1>
        <p className="text-cyan-100 mt-2">
          Stay connected — here’s what’s happening in your neighborhood today.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => (window.location.href = "/dashboard/posts")}
          className="mt-5 bg-white text-cyan-800 font-semibold px-5 py-2 rounded-lg shadow hover:bg-cyan-50 transition flex items-center gap-2"
        >
          <PlusCircle size={18} /> Add New Post
        </motion.button>
      </motion.div>

      {/* STATS */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {stats.map((item, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            whileHover={{ scale: 1.04 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-2xl transition relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-100 rounded-bl-full opacity-30" />
            <div className="flex items-center gap-3 text-cyan-800 font-semibold relative z-10">
              {item.icon}
              <span>{item.title}</span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-3 relative z-10">{item.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* COMMUNITY HIGHLIGHTS */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-cyan-900">Community Highlights</h2>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-cyan-800 hover:underline text-sm font-medium"
          >
            {expanded ? "Hide" : "View all"}
          </button>
        </div>

        <div className="space-y-6">
          {highlights.map(item => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
              className="p-5 rounded-xl border border-gray-100 bg-white hover:bg-cyan-50 transition shadow-sm hover:shadow-xl"
            >
              <div className="flex items-center gap-3 mb-1">
                {item.type === "announcement" && <Megaphone className="text-cyan-700" size={18} />}
                {item.type === "event" && <Calendar className="text-cyan-700" size={18} />}
                {item.type === "post" && <MessageSquare className="text-cyan-700" size={18} />}
                <h3 className="font-semibold text-cyan-900">{item.title}</h3>
              </div>
              <p className="text-sm text-cyan-800 font-medium">{item.user}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-400 text-sm text-center mt-12"
      >
        Empowering communities — Neighborhood Connect
      </motion.p>
    </div>
  );
};

export default Homed;
