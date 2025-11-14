import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  Megaphone,
  Ghost,
  HelpingHand,
  Store,
  MessageCircle,
  Calendar,
  User,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/dashboard/home", icon: <Home size={18} /> },
    { name: "Announcements", path: "/dashboard/announcements", icon: <Megaphone size={18} /> },
    { name: "Events", path: "/dashboard/events", icon: <Calendar size={18} /> },
    { name: "Help Exchange", path: "/dashboard/help-exchange", icon: <HelpingHand size={18} /> },
    { name: "Anonymous Posts", path: "/dashboard/anonymous-posts", icon: <Ghost size={18} /> },
    { name: "Businesses", path: "/dashboard/businesses", icon: <Store size={18} /> },
    { name: "Posts", path: "/dashboard/posts", icon: <MessageCircle size={18} /> },
    { name: "Profile", path: "/dashboard/profile", icon: <User size={18} /> },
  ];

  return (
    <>
      {/* HAMBURGER BUTTON */}
      <div className="md:hidden fixed left-3 top-[70px] z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-cyan-100 text-cyan-900 rounded-xl shadow-md hover:bg-cyan-200 transition"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed inset-y-0 left-0 w-64 z-40 transform transition-transform duration-300 md:hidden
          bg-gradient-to-br from-cyan-800 to-cyan-600 text-white shadow-2xl rounded-r-2xl
          overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-300 scrollbar-track-transparent
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-5">
          <h2 className="text-xl font-bold mb-6 tracking-wide text-white/90">Navigation</h2>

          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all duration-300
                    ${
                      location.pathname === item.path
                        ? "bg-white/20 shadow-lg border border-white/20 backdrop-blur-md"
                        : "hover:bg-white/10 hover:shadow"
                    }`}
                >
                  <div className="p-1">{item.icon}</div>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div
        className="hidden md:flex flex-col w-64 h-screen sticky top-0 
        bg-gradient-to-br from-cyan-800 to-cyan-600 text-white 
        p-5 rounded-r-2xl shadow-2xl z-40 overflow-y-auto scrollbar-thin 
        scrollbar-thumb-cyan-300 scrollbar-track-transparent"
      >
        <h2 className="text-2xl font-bold mb-6 tracking-wide text-white/90">Dashboard</h2>

        <ul className="space-y-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all duration-300
                  ${
                    location.pathname === item.path
                      ? "bg-white/20 shadow-lg border border-white/20 backdrop-blur-md"
                      : "hover:bg-white/10 hover:shadow"
                  }`}
              >
                <div className="p-1">{item.icon}</div>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
