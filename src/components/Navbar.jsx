import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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

  return (
    <>
    <nav className="bg-white shadow-md px-4 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="text-2xl font-bold text-cyan-900">Neighborhood Connect</div>

      {/* Right Side */}
      <div className="flex items-center space-x-4 relative">
        {/* Notifications */}
        <button className="text-cyan-900 hover:text-cyan-800 text-xl">
          <FaBell />
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-cyan-900 hover:text-cyan-800 text-2xl focus:outline-none"
          >
            <FaUserCircle />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 text-cyan-900 bg-white border border-gray-200 shadow-lg rounded-lg z-10">
              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="block px-4 py-2 hover:bg-gray-100 text-sm"
              >
                View Profile
              </Link>
              <Link
                to="/account/edit"
                onClick={() => setDropdownOpen(false)}
                className="block px-4 py-2 hover:bg-gray-100 text-cyan-900 text-sm"
              >
                Edit Account
              </Link>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  // Add logout logic here
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-cyan-900 text-sm"
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
