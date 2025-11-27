import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBell, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/UseAuth";
import axios from "axios";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
// eslint-disable-next-line no-unused-vars
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isAboutPage = location.pathname === "/about"; 

  // Fetch unread notifications safely
  useEffect(() => {
    const fetchUnread = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get("http://127.0.0.1:8000/api/notifications/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const notificationsArray = Array.isArray(res.data)
          ? res.data
          : res.data.notifications || [];

        const unread = notificationsArray.filter((n) => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // Close dropdown 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitial = (name) => name?.charAt(0).toUpperCase() || "?";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  
  const bgColor = isAboutPage ? "bg-cyan-900" : "bg-white";
  const textColor = isAboutPage ? "text-white" : "text-cyan-900";
  const hoverUnderline = isAboutPage ? "hover:underline hover:decoration-white" : "hover:underline hover:decoration-cyan-900";

  return (
    <nav className={`sticky top-0 z-50 flex items-center justify-between px-4 py-3 shadow-md transition ${bgColor} ${textColor}`}>
      {/* LEFT SIDE */}
      <div className="flex items-center space-x-6">
        <Link to="/" className={`text-2xl font-bold ${textColor}`}>
          NeighborHub
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className={`underline-offset-4 font-medium ${hoverUnderline}`}>Home</Link>
          <Link to="/about" className={`underline-offset-4 font-medium ${hoverUnderline}`}>About</Link>
          {user ? (
            <Link to="/dashboard" className={`underline-offset-4 font-medium ${hoverUnderline}`}>Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className={`underline-offset-4 font-medium ${hoverUnderline}`}>Login</Link>
              <Link to="/register" className={`underline-offset-4 font-medium ${hoverUnderline}`}>Register</Link>
            </>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center space-x-4">
        {user && (
          <>
            {/* Notification Bell */}
            <Link to="/notifications" className={`relative text-xl ${textColor} ${hoverUnderline}`}>
              <FaBell />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Avatar Dropdown */}
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 bg-cyan-800 text-white rounded-full flex items-center justify-center text-lg"
              >
                {getInitial(user.username)}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-cyan-900 shadow-lg rounded-lg z-10">
                  <button
                    onClick={() => { setDropdownOpen(false); navigate("/dashboard/profile"); }}
                    className="block w-full px-4 py-2 text-left hover:bg-cyan-50"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left hover:bg-cyan-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Mobile menu button */}
        <button className={`md:hidden text-2xl ${textColor}`} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className={`absolute top-full left-0 w-full md:hidden border-t shadow-md ${bgColor}`}>
          <div className="flex flex-col py-2">
            <Link to="/" onClick={() => setMobileOpen(false)} className={`px-4 py-3 font-medium ${hoverUnderline}`}>Home</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className={`px-4 py-3 font-medium ${hoverUnderline}`}>About</Link>
            {!user ? (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className={`px-4 py-3 font-medium ${hoverUnderline}`}>Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className={`px-4 py-3 font-medium ${hoverUnderline}`}>Register</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className={`px-4 py-3 font-medium ${hoverUnderline}`}>Dashboard</Link>
                <Link to="/notifications" onClick={() => setMobileOpen(false)} className={`px-4 py-3 font-medium relative ${hoverUnderline}`}>
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 inline-block w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
                  )}
                </Link>
                <button onClick={() => { setMobileOpen(false); navigate("/dashboard/profile"); }} className={`px-4 py-3 text-left font-medium ${hoverUnderline}`}>View Profile</button>
                <button onClick={handleLogout} className={`px-4 py-3 text-left font-medium ${hoverUnderline}`}>Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
