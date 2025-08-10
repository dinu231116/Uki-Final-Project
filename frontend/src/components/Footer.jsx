import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-12 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center md:text-left">
        {/* Brand Info */}
        <div>
          <h3 className="text-2xl font-extrabold mb-3 tracking-wide">SPARK WASH</h3>
          <p className="text-sm text-blue-100 leading-relaxed">
            Your trusted on-demand laundry partner for hygienic, fast, and affordable service in Jaffna.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-blue-100">
            <li>
              <a href="/" className="hover:text-yellow-400 transition-colors duration-200">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-yellow-400 transition-colors duration-200">
                About
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-yellow-400 transition-colors duration-200">
                Services
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-yellow-400 transition-colors duration-200">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
          <div className="flex justify-center md:justify-start gap-5 text-blue-200">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-yellow-400 transition-colors duration-200"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-yellow-400 transition-colors duration-200"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-yellow-400 transition-colors duration-200"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-6 text-xs text-blue-200 opacity-80">
            © 2025 Spark Wash. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
