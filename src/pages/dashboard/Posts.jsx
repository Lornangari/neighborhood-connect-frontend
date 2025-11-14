import React, { useState, useEffect } from "react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageSquare, Send, PenSquare } from "lucide-react";

const Posts = () => {
  const user = JSON.parse(localStorage.getItem("user")) || { id: "guest", name: "Guest", isAdmin: false };
  const token = localStorage.getItem("access");

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [expandedPost, setExpandedPost] = useState(null);
  const [newComment, setNewComment] = useState({});
  const [editingPostId, setEditingPostId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    if (!token) {
      setError("You are not authorized.");
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/posts/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = (res.data || []).map((p) => ({
          ...p,
          user: p.user || user.name,
          user_id: p.user_id || user.id,
          comments: (p.comments || []).map((c) => ({
            ...c,
            user: c.user || user.name,
          })),
        }));

        setPosts(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || "Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token, user.name, user.id]);

  // Create a new post
  const handleAddPost = async () => {
    if (!newPost.trim()) return;

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/posts/",
        { message: newPost },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts([
        {
          ...res.data,
          user: user.name,
          user_id: user.id,
          comments: [],
        },
        ...posts,
      ]);
      setNewPost("");
    } catch (err) {
      console.error(err);
      setError("Failed to create post.");
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/posts/${id}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(posts.map((p) => (p.id === id ? { ...p, likes: res.data.likes } : p)));
    } catch (err) {
      console.error(err);
    }
  };

  // Add comment
  const handleAddComment = async (postId) => {
    const commentText = newComment[postId]?.trim();
    if (!commentText) return;

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/comments/",
        { text: commentText, post: postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts(posts.map((p) =>
        p.id === postId
          ? { ...p, comments: [...p.comments, { ...res.data, user: user.name }] }
          : p
      ));

      setNewComment({ ...newComment, [postId]: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to add comment.");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/posts/${postId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete post.");
    }
  };

  const handleEditPost = (post) => {
    setEditingPostId(post.id);
    setEditText(post.message);
  };

  const handleSaveEdit = async (postId) => {
    if (!editText.trim()) return;

    try {
      const res = await axios.put(
        `http://127.0.0.1:8000/api/posts/${postId}/`,
        { message: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(posts.map((p) => (p.id === postId ? { ...p, message: res.data.message } : p)));
      setEditingPostId(null);
      setEditText("");
    } catch (err) {
      console.error(err);
      alert("Failed to update post.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading posts...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 relative overflow-hidden">

      <div className="absolute top-0 left-0 w-60 h-60 bg-cyan-200/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-100/50 rounded-full blur-3xl -z-10"></div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-cyan-800 to-cyan-600 text-white py-16 text-center shadow-lg rounded-b-[3rem]"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Community Feed 💬</h1>
        <p className="text-cyan-100/90 max-w-2xl mx-auto text-lg">
          Share updates, ask questions, and stay connected with your neighbors.
        </p>
      </motion.div>

      {/* New Post */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-3xl mx-auto -mt-12 bg-white shadow-2xl rounded-3xl border border-cyan-100 p-6 relative z-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-cyan-100 text-cyan-800 p-3 rounded-full">
            <PenSquare size={20} />
          </div>
          <h2 className="text-xl font-semibold text-cyan-800">Create a new post</h2>
        </div>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind today?"
          className="w-full bg-cyan-50 border border-cyan-200 rounded-2xl p-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 resize-none"
          rows="3"
        ></textarea>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-cyan-700/80">Posting as {user.name}</span>
          <button
            onClick={handleAddPost}
            className="flex items-center gap-2 bg-cyan-800 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-full font-medium transition"
          >
            <Send size={18} /> Post
          </button>
        </div>
      </motion.div>

      {/* Posts Feed */}
      <div className="max-w-3xl mx-auto flex flex-col gap-8 mt-16 px-4 pb-10">
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="bg-white shadow-md rounded-3xl border border-cyan-100 overflow-hidden hover:shadow-xl transition"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-cyan-100 text-cyan-800 font-bold w-9 h-9 flex items-center justify-center rounded-full uppercase">
                      {post.user ? post.user[0] : "?"}
                    </div>
                    <h3 className="font-semibold text-cyan-800">{post.user}</h3>
                  </div>
                  <span className="text-cyan-600/60 text-sm">{post.time}</span>
                </div>

                {/* Message */}
                {editingPostId === post.id ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full border border-cyan-200 rounded-2xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(post.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPostId(null)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-1 rounded-full text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed mb-4">{post.message}</p>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center text-cyan-700/80 text-sm">
                  <div className="flex gap-5">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1 hover:text-cyan-900 transition"
                    >
                      <Heart size={16} /> {post.likes || 0}
                    </button>
                    <button
                      onClick={() =>
                        setExpandedPost(expandedPost === post.id ? null : post.id)
                      }
                      className="flex items-center gap-1 hover:text-cyan-900 transition"
                    >
                      <MessageSquare size={16} /> {post.comments?.length || 0}
                    </button>

                    {(user.id === post.user_id || user.isAdmin) && (
                      <>
                        <button
                          onClick={() => handleEditPost(post)}
                          className="text-cyan-800 hover:text-cyan-900 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                  <span className="italic text-cyan-600/60">#TogetherWeGrow</span>
                </div>
              </div>

              {/* Comments */}
              <AnimatePresence>
                {expandedPost === post.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-cyan-50/70 border-t border-cyan-100 px-6 py-4"
                  >
                    <div className="space-y-3 mb-3">
                      {post.comments?.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-start gap-3 bg-white/70 rounded-2xl p-3 border border-cyan-100"
                        >
                          <div className="bg-cyan-100 text-cyan-800 font-bold w-7 h-7 flex items-center justify-center rounded-full uppercase">
                            {c.user ? c.user[0] : "?"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-cyan-800">{c.user}</p>
                            <p className="text-sm text-gray-700">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment */}
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={newComment[post.id] || ""}
                        onChange={(e) =>
                          setNewComment({ ...newComment, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddComment(post.id);
                        }}
                        className="flex-1 bg-white border border-cyan-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="bg-cyan-700 text-white px-4 py-2 rounded-full hover:bg-cyan-800 transition text-sm font-medium"
                      >
                        Send
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default Posts;
