import React, { useState, useEffect } from "react";
import axios from "axios";
import {Link, useNavigate } from "react-router-dom";


function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    neighborhood: "",
  });

  const [neighborhoods, setNeighborhoods] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/neighborhoods/")
      .then((res) => setNeighborhoods(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

const handleSubmit = (e) => {
  e.preventDefault();
  axios
    .post("http://127.0.0.1:8000/api/register/", formData)
    .then(() => {
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login"); // Redirect after 1.5 seconds
      }, 1500);
    })
    .catch(() => {
      setMessage("Registration failed. Check your input.");
    });
};


  return (

    <>
    <div className="flex flex-col min-h-screen">
    {/* Navbar */}
    <header className="sticky top-0 bg-white shadow z-10">
      <nav className="bg-cyan-900 shadow p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          Neighborhood Connect
        </Link>
        <Link to="/" className=" text-xl text-white hover:underline">
          Back to Home
        </Link>
      </nav>
    </header>
      <hr />


    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white text-cyan-900 shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        {message && <p className="text-center mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            value={formData.password2}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <select
            name="neighborhood"
            value={formData.neighborhood}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded "
            required
          >
            <option value=" " >Select Neighborhood</option>
            {neighborhoods.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-cyan-900 text-white py-2 rounded hover:bg-cyan-700"
          >
            Register
          </button>
        </form>

        <p className="text-cyan-900 text-center mt-4 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-cyan-800 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
    </div>
    </>
  );
}
export default Register;