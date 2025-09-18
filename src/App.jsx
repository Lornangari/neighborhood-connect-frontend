import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Dashboard layout and feature pages
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Homed from "./pages/dashboard/Homed";
import Announcements from "./pages/dashboard/Announcements";
import HelpExchange from "./pages/dashboard/HelpExchange";
import Profile from "./pages/dashboard/Profile";
import Posts from "./pages/dashboard/Posts";
import Events from "./pages/dashboard/Events"; 

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();
  const hideNavbarOn = ["/", "/login", "/register"];
  const hideFooterOn = ["/profile", "/dashboard", "/dashboard/posts", "/dashboard/events"];

  return (
    <>
      {!hideNavbarOn.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        


        {/* Dashboard layout with nested routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Homed />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="help-exchange" element={<HelpExchange />} />
          <Route path="profile" element={<Profile />} />
          <Route path="posts" element={<Posts />} />
          <Route path="events" element={<Events />} />
        </Route>
      </Routes>

      {!hideFooterOn.includes(location.pathname) && <Footer />}
    </>
  );
}

export default App;
