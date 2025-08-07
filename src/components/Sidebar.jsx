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
    { name: "Anonymous Posts", path: "/dashboard/anonymous-posts", icon: <Ghost size={18} /> },
    { name: "Help Exchange", path: "/dashboard/help-exchange", icon: <HelpingHand size={18} /> },
    { name: "Businesses", path: "/dashboard/businesses", icon: <Store size={18} /> },
    { name: "Comments", path: "/dashboard/comments", icon: <MessageCircle size={18} /> },
    { name: "Events", path: "/dashboard/events", icon: <Calendar size={18} /> },
    { name: "Profile", path: "/dashboard/profile", icon: <User size={18} /> },
  ];

  return (
    <>
      {/* Hamburger Toggle Button: top-left below navbar */}
      <div className="md:hidden absolute left-0 z-40 p-2 mt-[56px]">

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-cyan-100 text-cyan-900 rounded"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar for mobile: slide-over */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white border-r overflow-y-auto transition-transform duration-200 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Menu</h2>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 text-cyan-900 font-semibold py-2 px-3 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? "bg-cyan-100 font-bold text-cyan-900 shadow border border-cyan-300"
                      : "hover:bg-cyan-50"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:block w-64 min-h-screen bg-white text-cyan-900 font-semibold border-r p-4">
        {/* <h2 className="text-xl font-bold mb-4">Menu</h2> */}
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all ${
                  location.pathname === item.path
                    ? "bg-cyan-100 font-bold text-cyan-900 shadow border border-cyan-300"
                    : "hover:bg-cyan-50"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
