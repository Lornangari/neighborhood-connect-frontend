import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/UseAuth"; 

export default function Home() {
  // const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarRef = useRef(null);

  
  const auth = useAuth?.(); 
  const userFromContext = auth?.user ?? null;
  const logoutFromContext = auth?.logout;

  
  const fallbackUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const user = userFromContext || fallbackUser;
  const isLoggedIn = !!user;
  const username = user?.username || "";

  useEffect(() => {
    // close avatar menu when clicking outside
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    
    if (typeof logoutFromContext === "function") {
      logoutFromContext();
    } else {
      
      localStorage.removeItem("access"); 
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
    }
    
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-cyan-900 text-white fixed w-full top-0 left-0 z-20 shadow-md">
  <div className="container mx-auto flex items-center justify-between px-4 py-3">
    {/* Left: Logo */}
    <h1 className="text-2xl font-bold">Neighborhood Connect</h1>

    {/* Center: Links */}
    <div className="hidden md:flex flex-1 justify-center space-x-6">
      <Link to="/" className="hover:underline">Home</Link>

      {!isLoggedIn ? (
        <>
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/register" className="hover:underline">Register</Link>
        </>
      ) : (
        <>
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        </>
      )}
    </div>

    {/* Right: Notifications & Avatar */}
    <div className="hidden md:flex items-center space-x-4">
      {isLoggedIn && (
        <>
          {/* Notification Icon */}
          <button aria-label="Notifications" className="relative">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 
                6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 
                6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 
                1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute -top-1 -right-1 inline-block w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Avatar */}
          <div className="relative" ref={avatarRef}>
            <button
              onClick={() => setAvatarMenuOpen(s => !s)}
              className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center font-bold uppercase focus:outline-none"
              aria-haspopup="true"
              aria-expanded={avatarMenuOpen}
            >
              {username?.charAt(0) || "?"}
            </button>

            {avatarMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-cyan-900 rounded shadow-lg z-30">
                <Link
                  to="/dashboard/profile"
                  className="block px-4 py-2 hover:bg-cyan-50"
                  onClick={() => setAvatarMenuOpen(false)}
                >
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-cyan-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>

    {/* Mobile Menu Button */}
    <button
      className="md:hidden focus:outline-none"
      onClick={() => setMobileMenuOpen(s => !s)}
      aria-label="Toggle menu"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  </div>

  {/* Mobile Dropdown */}
  {mobileMenuOpen && (
    <div className="md:hidden bg-cyan-800 px-4 py-3 space-y-2">
      <Link to="/" className="block hover:underline">Home</Link>

      {!isLoggedIn ? (
        <>
          <Link to="/login" className="block hover:underline">Login</Link>
          <Link to="/register" className="block hover:underline">Register</Link>
        </>
      ) : (
        <>
          <Link to="/about" className="block hover:underline">About</Link>
          <Link to="/dashboard" className="block hover:underline">Dashboard</Link>
          <Link to="/dashboard/profile" className="block hover:underline">
            View Profile
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left hover:underline"
          >
            Logout
          </button>
        </>
      )}
    </div>
  )}
</nav>


      {/* Hero Section */}
      <section
        className="bg-white rounded-lg  m-4 mt-2 flex-1 flex items-center justify-center py-16 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/bg1.jpg')",
        }}
      >
        <div className=" mt-10 text-center max-w-2xl bg-white bg-opacity-90 p-8 rounded-lg shadow-md">
          <h2 className="text-4xl font-bold text-cyan-900 mb-4">
            Welcome to Neighborhood Connect
          </h2>
          <p className="text-gray-800 mb-6">
            Connect with your neighbors, share updates, and stay informed about what's
            happening around you.
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-cyan-900 text-white px-6 py-2 rounded-lg hover:bg-cyan-800"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Cards Section  */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <img src="/images/p5.jpg" alt="Stay Informed" className="w-full h-48 object-cover" />
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-cyan-900 mb-3">Stay Informed</h3>
                <p className="text-gray-800 text-base">Get the latest updates about events, safety alerts, and community news.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <img src="/images/p6.jpg" alt="Meet Neighbors" className="w-full h-48 object-cover" />
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-cyan-900 mb-3">Meet Neighbors</h3>
                <p className="text-gray-800 text-base">Build connections and strengthen bonds with people near you.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <img src="/images/p8.jpg" alt="Share Resources" className="w-full h-48 object-cover" />
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-cyan-900 mb-3">Share Resources</h3>
                <p className="text-gray-800 text-base">Offer help, exchange items, or promote local businesses easily.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-cyan-900 mb-4">Connect with your neighbors?</h2>
            <Link to="/login" className=" mt-10 bg-cyan-900 text-white px-6 py-3 rounded-lg shadow-md hover:bg-cyan-800 transition">Join NeighborhoodConnect</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
