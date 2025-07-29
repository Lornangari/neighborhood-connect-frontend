import { useState } from "react";
import {
  FaBars,
  FaTachometerAlt,
  FaMapMarkerAlt,
  FaClipboard,
  FaUserSecret,
  FaHandshake,
  FaStore,
  FaCalendarAlt,
  FaCommentDots,
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState("");

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleSection = (section) =>
    setOpenSection(openSection === section ? "" : section);

  return (
    <div className="flex">
      {/* Mobile toggle button */}
      <div className="lg:hidden p-4">
        <button
          className="text-2xl text-gray-800"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <FaBars />
        </button>
      </div>
      

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "block" : "hidden"
        } lg:block w-64 h-screen bg-white shadow-lg p-4 fixed z-50 transition-all duration-300`}
      >
        
        <ul className="space-y-2 text-cyan-900" >
          <li className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
            <FaTachometerAlt /> Dashboard
          </li>

          <li className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
            <FaMapMarkerAlt /> My Neighborhood
          </li>

          {/* Posts */}
          <li>
            <div
              onClick={() => toggleSection("posts")}
              className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <span className="flex items-center gap-3">
                <FaClipboard /> Posts
              </span>
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  openSection === "posts" ? "rotate-180" : ""
                }`}
              />
            </div>
            {openSection === "posts" && (
              <ul className="pl-10 text-sm text-cyan-900 space-y-1">
                <li className="hover:text-cyan-700 cursor-pointer">View Posts</li>
                <li className="hover:text-cyan-700 cursor-pointer">Create Post</li>
              </ul>
            )}
          </li>

          {/* Anonymous Posts */}
          <li>
            <div
              onClick={() => toggleSection("anon")}
              className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <span className="flex items-center gap-3">
                <FaUserSecret /> Anonymous
              </span>
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  openSection === "anon" ? "rotate-180" : ""
                }`}
              />
            </div>
            {openSection === "anon" && (
              <ul className="pl-10 text-sm text-cyan-900 space-y-1">
                <li className="hover:text-cyan-700 cursor-pointer">View Messages</li>
                <li className="hover:text-cyan-700 cursor-pointer">Submit Message</li>
              </ul>
            )}
          </li>

          {/* Help Exchange */}
          <li>
            <div
              onClick={() => toggleSection("help")}
              className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <span className="flex items-center gap-3">
                <FaHandshake /> Help Exchange
              </span>
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  openSection === "help" ? "rotate-180" : ""
                }`}
              />
            </div>
            {openSection === "help" && (
              <ul className="pl-10 text-sm text-cyan-900 space-y-1">
                <li className="hover:text-cyan-700 cursor-pointer">View Help</li>
                <li className="hover:text-cyan-700 cursor-pointer">Offer Help</li>
              </ul>
            )}
          </li>

          {/* Businesses */}
          <li>
            <div
              onClick={() => toggleSection("biz")}
              className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <span className="flex items-center gap-3">
                <FaStore /> Businesses
              </span>
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  openSection === "biz" ? "rotate-180" : ""
                }`}
              />
            </div>
            {openSection === "biz" && (
              <ul className="pl-10 text-sm text-cyan-900 space-y-1">
                <li className="hover:text-cyan-700 cursor-pointer">View</li>
                <li className="hover:text-cyan-700 cursor-pointer">Register</li>
              </ul>
            )}
          </li>

          {/* Events */}
          <li className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
            <FaCalendarAlt /> Events
          </li>

          {/* Comments */}
          <li className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
            <FaCommentDots /> Comments
          </li>

          {/* Profile & Logout */}
          <li>
            <div
              onClick={() => toggleSection("account")}
              className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <span className="flex items-center gap-3">
                <FaUser /> Account
              </span>
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  openSection === "account" ? "rotate-180" : ""
                }`}
              />
            </div>
            {openSection === "account" && (
              <ul className="pl-10 text-sm text-cyan-900 space-y-1">
                <li className="hover:text-cyan-700 cursor-pointer">View Profile</li>
                <li className="hover:text-cyan-700 cursor-pointer">Edit Account</li>
                <li className="hover:text-cyan-700 cursor-pointer">Logout</li>
              </ul>
            )}
          </li>
        </ul>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
