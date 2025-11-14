import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/UseAuth.jsx";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

export default function AnonymousPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formText, setFormText] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [error, setError] = useState("");

  const token = localStorage.getItem("access");

  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/anonymous-posts/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch posts.");
    }
  }, [token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!formText.trim()) return;

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/anonymous-posts/",
        { text: formText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormText("");
      setShowForm(false);
      fetchPosts();
    } catch (err) {
      console.error(err);
      setError("Failed to create post.");
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/anonymous-posts/${postId}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts();
    } catch (err) {
      console.error(err);
      setError("Failed to like/unlike post.");
    }
  };

  const handleComment = async (postId) => {
    const commentText = commentInputs[postId];
    if (!commentText?.trim()) return;

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/anonymous-posts/${postId}/comments/`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      fetchPosts();
    } catch (err) {
      console.error(err);
      setError("Failed to add comment.");
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 p-6 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-60 h-60 bg-cyan-200/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-100/40 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <h1 className="text-4xl font-extrabold text-center text-cyan-900 mb-8 tracking-wide">
         Anonymous Thoughts?
      </h1>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {/* Create Post Button */}
      {user && (
        <div className="max-w-md mx-auto mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full py-3 bg-cyan-800 text-white rounded-xl shadow-lg hover:bg-cyan-700 transition font-semibold transform hover:scale-105"
          >
            {showForm ? "Cancel" : "Share Anonymously"}
          </button>

          {showForm && (
            <motion.form
              onSubmit={handleCreatePost}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 space-y-3 bg-white p-5 rounded-3xl shadow-2xl border border-cyan-50"
            >
              <textarea
                placeholder="Share your thoughts without revealing your identity..."
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                className="w-full p-3 border border-cyan-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-900 resize-none text-cyan-900"
                rows={4}
                required
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-2 bg-cyan-800 text-white rounded-2xl hover:bg-cyan-700 transition font-semibold"
              >
                Post Anonymously
              </motion.button>
            </motion.form>
          )}
        </div>
      )}

      {/* Posts List */}
      <div className="max-w-3xl mx-auto space-y-6">
        {Array.isArray(posts) && posts.map((post) => {
          const liked = post.liked_by_user;

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
              className="bg-white p-5 rounded-3xl shadow-2xl border border-cyan-100 relative overflow-hidden"
            >
              <p className="text-cyan-900 text-lg font-medium mb-4">{post.text}</p>

              {/* Actions */}
              <div className="flex items-center justify-between mt-3 text-cyan-900">
                <div className="flex items-center space-x-4">
                  <motion.div
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() => handleLike(post.id)}
                    whileTap={{ scale: 1.2 }}
                  >
                    {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    <span>{post.likes_count || 0}</span>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() => toggleComments(post.id)}
                    whileTap={{ scale: 1.1 }}
                  >
                    <FaComment />
                    <span>{post.comments_count || 0}</span>
                  </motion.div>
                </div>
                <span className="italic text-cyan-500 text-sm">#ShareFreely</span>
              </div>

              {/* Comment Input & Display */}
              <AnimatePresence>
                {expandedComments[post.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-4 space-y-3"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        className="flex-1 p-2 border border-cyan-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-900 text-cyan-900"
                      />
                      <motion.button
                        onClick={() => handleComment(post.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-cyan-900 text-white rounded-2xl hover:bg-cyan-800 transition font-medium"
                      >
                        Send
                      </motion.button>
                    </div>

                    <div className="space-y-2">
                      {Array.isArray(post.comments) && post.comments.map((comment) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className=" p-3 rounded-2xl text-cyan-900 text-md font-semi-bold shadow-sm"
                        >
                          {comment.text}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
