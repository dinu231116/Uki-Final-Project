import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-10 mt-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6 text-center md:text-left">
        {/* Brand Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">SPARK WASH</h3>
          <p className="text-sm text-gray-300">
            Your trusted on-demand laundry partner for hygienic, fast, and affordable service in Jaffna.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="#about" className="hover:text-white">About</a></li>
            <li><a href="#services" className="hover:text-white">Services</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex justify-center md:justify-start gap-4 text-blue-300">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook className="hover:text-white w-5 h-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="hover:text-white w-5 h-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter className="hover:text-white w-5 h-5" />
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            © 2025 Spark Wash. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
