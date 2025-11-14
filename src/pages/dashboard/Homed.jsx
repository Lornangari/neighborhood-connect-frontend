import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Bell, Heart, Calendar, Users, PlusCircle, MessageSquare } from "lucide-react";

const Homed = () => {
  const user = { name: "Lorna" };

  const stats = [
    { title: "Community Members", value: 120, icon: <Users size={22} /> },
    { title: "Active Events", value: 3, icon: <Calendar size={22} /> },
    { title: "Recent Posts", value: 8, icon: <MessageSquare size={22} /> },
    { title: "New Announcements", value: 5, icon: <Bell size={22} /> },
  ];

  const highlights = [
    {
      id: 1,
      user: "James N.",
      title: "Tree planting this Saturday ",
      time: "2 hrs ago",
      likes: 12,
      comments: 3,
    },
    {
      id: 2,
      user: "Community Admin",
      title: "Monthly clean-up event ",
      time: "1 day ago",
      likes: 23,
      comments: 6,
    },
  ];

  // Framer Motion variants for staggered animation
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/*  Hero  Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-cyan-800 to-cyan-600 text-white rounded-2xl shadow-md p-8 mb-10"
      >
        <h1 className="text-3xl font-bold">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-cyan-100 mt-2">
          Stay connected — here’s what’s happening in your neighborhood today.
        </p>

        {/*  Floating Add New Post Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
          onClick={() => (window.location.href = "/dashboard/posts")}
          className="mt-5 bg-white text-cyan-800 font-semibold px-5 py-2 rounded-lg shadow hover:bg-cyan-50 transition flex items-center gap-2"
        >
          <PlusCircle className="inline" size={18} />
          Add New Post
        </motion.button>
      </motion.div>

      {/* Quick Stats with Staggered Animation  */}
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
            whileHover={{ scale: 1.03 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3 text-cyan-800 font-semibold">
              {item.icon}
              <span>{item.title}</span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-3">{item.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Community Highlights with Staggered Animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Community Highlights</h2>
          <button className="text-cyan-800 hover:underline text-sm">View all</button>
        </div>

        <div className="space-y-6">
          {highlights.map((post) => (
            <motion.div
              key={post.id}
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
              className="p-4 rounded-lg border border-gray-100 hover:bg-cyan-50 transition"
            >
              <h3 className="font-medium text-gray-800">{post.title}</h3>
              <p className="text-sm text-gray-500">
                by <span className="text-cyan-800">{post.user}</span> • {post.time}
              </p>
              <div className="flex gap-5 mt-2 text-gray-500 text-sm">
                <span className="flex items-center gap-1 hover:text-cyan-800 cursor-pointer">
                  <Heart size={16} /> {post.likes}
                </span>
                <span className="flex items-center gap-1 hover:text-cyan-800 cursor-pointer">
                  <MessageSquare size={16} /> {post.comments}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/*  Footer */}
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
