import { useAuth } from "../../context/UseAuth";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/user/me/", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPosts(res.data))
    .catch(err => console.error(err));
  }, [token]);

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  const initial = user.username?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center bg-white shadow rounded p-4 mb-6">
        {/* Profile Initial Circle */}
        <div className="w-16 h-16 rounded-full bg-cyan-900 flex items-center justify-center text-white text-2xl font-bold mr-4">
          {initial}
        </div>

        {/* Username & Email */}
        <div className="flex flex-col">
          <span className="text-lg font-semibold">{user.username}</span>
          <span className="text-cyan-900">{user.email}</span>
        </div>

        {/* Edit Button */}
        <div className="ml-auto">
          <button className="bg-red-600 hover:bg-red-700 text-white py-1 px-1 rounded">
            Edit Profile
          </button>
        </div>
      </div>

      <h3 className="text-xl text-cyan-900 font-semibold mb-2">My Posts</h3>
      {posts.length === 0 ? (
        <p className="text-cyan-900">No posts found.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="p-4 bg-gray-50 rounded shadow">
              <h4 className="font-bold">{post.title}</h4>
              <p>{post.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
