import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/UseAuth"; // adjust path

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    avatar: "",
    date_joined: "",
  });
  const [stats, setStats] = useState({ posts: 0, comments: 0 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("access");
        const res = await axios.get("http://127.0.0.1:8000/api/user/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Check backend URL or server.");
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      if (!user?.id) return;

      try {
        const token = localStorage.getItem("access");
        const [postsRes, commentsRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/posts/?user=" + user.id, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://127.0.0.1:8000/api/comments/?user=" + user.id, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setStats({ posts: postsRes.data.length, comments: commentsRes.data.length });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchProfile();
    fetchStats();
  }, [user?.id]);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setProfile({ ...profile, avatar: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("access");
      const formData = new FormData();
      formData.append("username", profile.username);
      formData.append("first_name", profile.first_name);
      formData.append("last_name", profile.last_name);
      formData.append("email", profile.email);
      if (fileInputRef.current?.files[0]) {
        formData.append("avatar", fileInputRef.current.files[0]);
      }

      await axios.put("http://127.0.0.1:8000/api/user/profile/", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setMessage("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    }
  };

  if (loading) return <p className="text-cyan-900 p-4">Loading profile...</p>;
  if (error) return <p className="text-red-600 p-4">{error}</p>;

  const avatarContent = profile.avatar ? (
    <img src={profile.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
  ) : (
    <div className="w-24 h-24 rounded-full bg-cyan-800 text-white flex items-center justify-center text-3xl font-bold">
      {profile.username?.[0]?.toUpperCase() || "U"}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white rounded-lg shadow-lg">
      {/* Profile Header */}
      <div className="flex items-center p-6 border-b border-gray-200">
        <div className="mr-6">{avatarContent}</div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-cyan-900">{profile.username}</h1>
          <p className="text-cyan-900">{profile.first_name} {profile.last_name}</p>
          <p className="text-cyan-900">{profile.email}</p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 bg-cyan-800 text-white rounded hover:bg-cyan-700"
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Editable Form */}
      {editing && (
        <div className="p-6 border-b border-gray-200 space-y-4">
          {message && <p className="text-cyan-900">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}
          <div className="flex flex-col space-y-4">
            {["username", "first_name", "last_name", "email"].map((field) => (
              <div key={field}>
                <label className="block text-cyan-900 font-medium">{field.replace("_", " ").toUpperCase()}</label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={profile[field]}
                  onChange={handleChange}
                  className="w-full p-2 border border-cyan-800 rounded-md"
                />
              </div>
            ))}
            <div>
              <label className="block text-cyan-900 font-medium">Upload Avatar</label>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="w-full" />
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-cyan-800 text-white rounded hover:bg-cyan-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Profile Summary */}
      <div className="p-6 border-t border-gray-200">
        <h2 className="text-cyan-900 font-semibold mb-4">Profile Summary</h2>
        <div className="flex space-x-8 text-cyan-900">
          <div>
            <p className="font-medium text-cyan-900">Posts</p>
            <p className="font-bold text-cyan-900">{stats.posts}</p>
          </div>
          <div>
            <p className="font-medium text-cyan-900">Comments</p>
            <p className="font-bold text-cyan-900">{stats.comments}</p>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default Profile;
