import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  UserCircle,
  MessageCircle,
  Handshake,
  HelpCircle,
  X,
  Edit,
  Trash2,
} from "lucide-react";

//  axios with auth token
const api = axios.create({
  baseURL: "http://localhost:8000/api/",
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Avatar Component
const UserAvatar = ({ username, profile_image }) => {
  if (profile_image) {
    return (
      <img
        src={profile_image}
        alt={username}
        className="w-8 h-8 rounded-full object-cover border"
      />
    );
  }
  const colors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-yellow-500",
  ];
  const colorIndex = (username?.charCodeAt?.(0) ?? 0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div
      className={`w-8 h-8 flex items-center justify-center rounded-full ${bgColor} text-white font-bold`}
    >
      {username ? username[0].toUpperCase() : "U"}
    </div>
  );
};

//  user object
function normalizeUser(u) {
  if (!u) return { id: null, username: null, profile_image: null };
  if (typeof u === "string")
    return { id: null, username: u, profile_image: null };
  return {
    id: u.id ?? null,
    username: u.username ?? null,
    profile_image: u.profile_image ?? (u.profile?.avatar ?? null),
  };
}

export default function HelpExchange() {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState("");
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch posts + current user
  const fetchPosts = async () => {
    try {
      const res = await api.get("help/");
      setPosts(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const fetchReplies = async (postId) => {
    try {
      const res = await api.get(`help/${postId}/replies/`);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, replies: res.data, reply_count: res.data.length }
            : p
        )
      );
    } catch (err) {
      console.error("Error fetching replies:", err.response?.data || err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchPosts();
      try {
        const me = await api.get("users/me/");
        setCurrentUser(me.data);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    };
    fetchData();
  }, []);

  // Modal handlers
  const openModal = (type) => {
    setFormType(type);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ title: "", description: "" });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("help/", { ...formData, type: formType });
      setPosts([res.data, ...posts]);
      closeModal();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  // Edit Post
  const handleEditSubmit = async (postId, updatedData) => {
    try {
      const res = await api.put(`help/${postId}/`, updatedData);
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? res.data : post))
      );
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  // Delete Post
  const handleDeletePost = async (id) => {
    try {
      await api.delete(`help/${id}/`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  // Delete Reply
  const handleDeleteComment = async (postId, replyId) => {
    try {
      await api.delete(`help/${postId}/replies/${replyId}/`);
      await fetchReplies(postId); // auto-refresh replies
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const askPosts = posts.filter((p) => p.type === "ask");
  const offerPosts = posts.filter((p) => p.type === "offer");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-cyan-900 mb-6">
        Help Exchange
      </h1>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <button
          onClick={() => openModal("ask")}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-800 text-white font-semibold rounded-2xl shadow-lg hover:bg-cyan-700 transition"
        >
          <HelpCircle className="w-5 h-5" /> Ask for Help
        </button>
        <button
          onClick={() => openModal("offer")}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-800 text-white font-semibold rounded-2xl shadow-lg hover:bg-cyan-700 transition"
        >
          <Handshake className="w-5 h-5" /> Offer Help
        </button>
      </div>

      {/* Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-cyan-900 mb-2">Asks</h2>
          {askPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onDeletePost={handleDeletePost}
              onDeleteComment={handleDeleteComment}
              onEditPost={handleEditSubmit}
              fetchReplies={fetchReplies}
            />
          ))}
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-green-600 mb-2">Offers</h2>
          {offerPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onDeletePost={handleDeletePost}
              onDeleteComment={handleDeleteComment}
              onEditPost={handleEditSubmit}
              fetchReplies={fetchReplies}
            />
          ))}
        </div>
      </div>

      {/* Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-cyan-900 hover:text-cyan-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-cyan-600">
              {formType === "ask" ? "Ask for Help" : "Offer Help"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                rows="4"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// PostCard
function PostCard({
  post,
  currentUser,
  onDeletePost,
  onDeleteComment,
  onEditPost,
  fetchReplies,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: post.title,
    description: post.description,
    type: post.type,
  });
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const postUser = normalizeUser(post.user);
  const isAdmin = currentUser?.role === "admin";

  const isOwner =
    currentUser &&
    ((postUser.id && currentUser.id === postUser.id) ||
      (postUser.username && currentUser.username === postUser.username));

  const handleSave = async () => {
    await onEditPost(post.id, editData);
    setIsEditing(false);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`help/${post.id}/replies/`, { message: replyContent });
      setReplyContent("");
      await fetchReplies(post.id);
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
      {/* User Info */}
      <div className="flex items-center gap-2 mb-3">
        <UserAvatar
          username={postUser.username}
          profile_image={postUser.profile_image}
        />
        <Link
          to={
            postUser.username
              ? `/profile/${postUser.username}`
              : `/profile/${postUser.id || ""}`
          }
          className="text-sm font-medium text-cyan-900 hover:underline"
        >
          {postUser.username || "deleted"}
        </Link>

        {(isAdmin || isOwner) && (
          <div className="ml-auto flex gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-cyan-600 hover:text-cyan-800"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onDeletePost(post.id)}
              className="text-cyan-500 hover:text-cyan-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Edit Mode */}
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <textarea
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-cyan-600 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2
            className={`font-bold text-lg ${
              post.type === "ask" ? "text-cyan-800" : "text-green-600"
            }`}
          >
            {post.title}
          </h2>
          <p className="text-gray-700 mb-3">{post.description}</p>
        </>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center text-sm">
        <span
          className={`font-semibold px-3 py-1 rounded-full ${
            post.type === "ask"
              ? "bg-cyan-100 text-cyan-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {post.type === "ask" ? "Help Request" : "Offer"}
        </span>
        <button
          onClick={() => {
            if (!showReplies) fetchReplies(post.id);
            setShowReplies(!showReplies);
          }}
          className="flex items-center gap-1 text-cyan-900 hover:text-cyan-800"
        >
          <MessageCircle className="w-4 h-4" />
          {post.reply_count ?? 0}
        </button>
      </div>

      {/* Replies Section */}
      {showReplies && (
        <div className="mt-4 border-t pt-3 space-y-3">
          {/* Reply Input */}
          <form onSubmit={handleReplySubmit} className="flex gap-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 p-2 border rounded-lg text-sm"
              rows="2"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-800 text-white rounded-lg hover:bg-cyan-700 transition"
            >
              Post
            </button>
          </form>

          {/* List of Replies */}
          {Array.isArray(post.replies) &&
            post.replies.map((reply) => {
              const rUser = normalizeUser(reply.user);
              const canDeleteReply =
                currentUser &&
                (isAdmin ||
                  (rUser.id && currentUser.id === rUser.id) ||
                  (rUser.username && currentUser.username === rUser.username));

              return (
                <div
                  key={reply.id}
                  className="flex gap-2 items-start bg-gray-50 p-2 rounded-lg"
                >
                  <UserAvatar
                    username={rUser.username}
                    profile_image={rUser.profile_image}
                  />
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm">{reply.message}</p>
                  </div>
                  {canDeleteReply && (
                    <button
                      onClick={() => onDeleteComment(post.id, reply.id)}
                      className="ml-auto text-xs text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
