import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/UseAuth.jsx";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      setError("Username and password are required.");
      return;
    }

    try {
      
      const response = await axios.post("http://127.0.0.1:8000/api/token/", formData);

      
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      //  Set Authorization header globally after login
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;

      // Fetch logged-in user info with access token
      const userRes = await axios.get("http://127.0.0.1:8000/api/user/me/", {
        headers: { Authorization: `Bearer ${response.data.access}` },
      });

      const userData = userRes.data;
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 bg-white shadow z-10">
        <nav className="bg-cyan-900 shadow p-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">
            Neighborhood Connect
          </Link>
          <Link to="/" className="text-xl text-white hover:underline">
            Back to Home
          </Link>
        </nav>
      </header>

      {/* Login form */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl text-cyan-900 font-bold mb-6 text-center">Login</h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-cyan-900 mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-800"
              />
            </div>

            <div>
              <label className="block text-cyan-900 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-800"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-900 text-white py-2 rounded-lg hover:bg-cyan-700 transition"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-cyan-900 text-center mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-cyan-800 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
