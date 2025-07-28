import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  
const [menuOpen, setMenuOpen] = useState(false);
return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-cyan-900 text-white fixed w-full top-0 left-0 z-20 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4 py-3">
          {/* Logo */}
          <h1 className="text-2xl font-bold">Neighborhood Connect</h1>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
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
        {menuOpen && (
          <div className="md:hidden bg-cyan-800 px-4 py-3 space-y-2">
            <Link to="/" className="block hover:underline">
              Home
            </Link>
            <Link to="/login" className="block hover:underline">
              Login
            </Link>
            <Link to="/register" className="block hover:underline">
              Register
            </Link>
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



      {/* Cards Section */}
{/* Cards Section */}
<section className="bg-gray-50 py-16">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      
      {/* Card 1 */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
        <img
          src="/images/p5.jpg"
          alt="Stay Informed"
          className="w-full h-48 object-cover"
        />
        <div className="p-6 text-center">
          <h3 className="text-2xl font-bold text-cyan-900 mb-3">
            Stay Informed
          </h3>
          <p className="text-gray-800 text-base">
            Get the latest updates about events, safety alerts, and community news.
          </p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
        <img
          src="/images/p6.jpg"
          alt="Meet Neighbors"
          className="w-full h-48 object-cover"
        />
        <div className="p-6 text-center">
          <h3 className="text-2xl font-bold text-cyan-900 mb-3">
            Meet Neighbors
          </h3>
          <p className="text-gray-800 text-base">
            Build connections and strengthen bonds with people near you.
          </p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
        <img
          src="/images/p8.jpg"
          alt="Share Resources"
          className="w-full h-48 object-cover"
        />
        <div className="p-6 text-center">
          <h3 className="text-2xl font-bold text-cyan-900 mb-3">
            Share Resources
          </h3>
          <p className="text-gray-800 text-base">
            Offer help, exchange items, or promote local businesses easily.
          </p>
        </div>
      </div>

      

    </div>
    {/* Text + Button Section */}
    <div className="text-center mt-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-cyan-900 mb-4">
        Connect with your neighbors?
      </h2>
      
    <Link to="/login" className=" mt-10 bg-cyan-900 text-white px-6 py-3 rounded-lg shadow-md hover:bg-cyan-800 transition">
     Join NeighborhoodConnect
    </Link>
    </div>
  </div>
</section>


{/* footer */}
<footer className="bg-cyan-900 text-white py-10">
  <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
    {/* Brand Section */}
    <div>
      <h3 className="text-2xl font-bold mb-3">Neighborhood Connect</h3>
      <p className="text-white text-sm">
        Bringing communities together. Stay informed, connect with neighbors,
        and share local resources easily.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
      <ul className="space-y-2 text-sm">
        <li><a href="/" className="hover:underline">Home</a></li>
        <li><a href="/login" className="hover:underline">Login</a></li>
        <li><a href="/register" className="hover:underline">Register</a></li>
        <li><a href="/about" className="hover:underline">About Us</a></li>
      </ul>
    </div>

    {/* Support */}
    <div>
      <h4 className="text-lg font-semibold mb-3">Support</h4>
      <ul className="space-y-2 text-sm">
        <li><a href="/contact" className="hover:underline">Contact Us</a></li>
        <li><a href="/faq" className="hover:underline">FAQs</a></li>
        <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
        <li><a href="/terms" className="hover:underline">Terms of Service</a></li>
      </ul>
    </div>


    {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-white mb-2">Contact</h3>
          <ul className="space-y-1 text-sm">
            <li>Email: support@recipeapp.com</li>
            <li>Phone: +123 456 7890</li>
            <li>Location: Nairobi, Kenya</li>
          </ul>
        </div>


    {/* Social Media */}
     <div>
          <h3 className="font-semibold text-white mb-2">Follow Us</h3>
          <div className="flex gap-4 mb-4 text-lg">
            <a href="#" className="hover:text-amber-300 transition"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="hover:text-amber-300 transition"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="hover:text-amber-300 transition"><i className="fa-brands fa-x-twitter"></i></a>
          </div>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="border-t border-cyan-800 mt-8 pt-4 text-center text-sm text-white">
    © {new Date().getFullYear()} Neighborhood Connect. All rights reserved.
  </div>
</footer>

    </div>
  );
}
