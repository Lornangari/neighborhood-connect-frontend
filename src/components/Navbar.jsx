import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { useAuth } from "../context/UseAuth"; 

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getInitial = (name) => name?.charAt(0).toUpperCase() || "?";

  const handleLogout = () => {
    try {
      logout();
      navigate("/"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <nav className="bg-white sticky top-0 z-50 shadow-md px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-cyan-900">Neighborhood Connect</div>
        </Link>
        <div className="flex items-center space-x-4 relative">
          {/* Notifications */}
          <button className="text-cyan-900 hover:text-cyan-800 text-xl">
            <FaBell />
          </button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 bg-cyan-800 text-white rounded-full flex items-center justify-center text-lg focus:outline-none"
            >
              {user ? getInitial(user.username) : "?"}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 text-cyan-900 bg-white border border-gray-200 shadow-lg rounded-lg z-10">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/dashboard/profile");
                  }}
                  className="block w-full text-left px-4 py-2 text-cyan-900 hover:bg-cyan-50 text-sm"
                >
                  View Profile
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    alert("Dark mode coming soon!");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-cyan-50 text-cyan-900 text-sm"
                >
                  Dark Mode
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-cyan-50 text-cyan-900 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <hr />
    </>
  );
};

export default Navbar;
