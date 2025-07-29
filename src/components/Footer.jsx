
import React from 'react';

const Footer = () => {
  return (
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
            <li>Email: support@neighborhoodconnect.com</li>
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
  );
};

export default Footer;
