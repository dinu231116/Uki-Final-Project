import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroImg from "../assets/hero.png";
import Footer from '../components/Footer';
import serviceImg from '../assets/washing.png';
import dryImg from '../assets/drycleaning.jpg';
import ironImg from '../assets/ironing.jpg';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';


const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/services');
        setServices(res.data);
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };

    fetchServices();
  }, []);

 const getServiceImage = (name) => {
  switch (name.toLowerCase()) {
    case 'washing':
      return serviceImg;
    case 'drycleaning':
      return dryImg; // ✅
    case 'ironing':
      return ironImg;
    default:
      return '/placeholder.jpg';
  }
};
  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-blue-900 mb-10">Our Services</h2>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          {services.map((service) => (
            <div key={service._id} className="bg-white shadow-md p-6 rounded flex flex-col">
              <img
                src={getServiceImage(service.name)}
                alt={service.name}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-semibold text-blue-700 mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <Link
                to={`/booking/${service.name.toLowerCase()}`}
                className="mt-auto inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded text-center"
              >
                Explore More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            to="/our-services"
            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded text-lg font-semibold"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  useEffect(() => {
    if (window.location.hash === '#about') {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section
        className="text-white px-6 py-16 bg-cover bg-center h-[500px]"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center h-full">
          <div>
            <p className="text-sm mb-2">Welcome to CleanWash Laundry Systems_</p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2">
              Personalised on demand <br />
              Laundry Service <br />
              to your door
            </h1>
            <p className="text-sm mt-2">Change Your Routine With SPARK WASH</p>
          </div>
          <div className="hidden md:block"></div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">ABOUT US</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <img
              src="./src/assets/aboutus.png"
              alt="Laundry Worker"
              className="rounded shadow-md w-full max-w-[500px]"
            />
            <p className="text-gray-700 text-lg leading-relaxed">
              Clean Laundry offers fast, reliable, and affordable laundry services for individuals, families, and businesses.
              We use high-quality machines, eco-friendly detergents, and follow strict hygiene standards to ensure your
              clothes are cleaned with care and delivered fresh, every time.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services">
        <Services />
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-900 text-center mb-2">Contact Us</h1>
          <p className="text-center text-gray-600 mb-10">
            We'd love to hear from you. Reach us by filling out the form or via phone or email.
          </p>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-blue-50 p-6 rounded shadow text-center">
              <img src="/src/assets/phone-call.png" alt="Phone" className="w-12 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-800">Phone</h3>
              <p className="text-gray-700">+94 75 024 4501</p>
            </div>
            <div className="bg-blue-50 p-6 rounded shadow text-center">
              <img src="/src/assets/mail.png" alt="Email" className="w-12 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-800">Email</h3>
              <p className="text-gray-700">support@sparkwash.com</p>
            </div>
            <div className="bg-blue-50 p-6 rounded shadow text-center">
              <img src="/src/assets/location.png" alt="Location" className="w-12 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-800">Address</h3>
              <p className="text-gray-700">123 Main Street, Jaffna, Sri Lanka</p>
            </div>
          </div>

          {/* Contact Form + Map */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <form className="bg-gray-50 p-8 rounded-lg shadow-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows="5"
                  placeholder="Type your message here..."
                  className="w-full border border-gray-300 px-4 py-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-lg"
              >
                Send Message
              </button>
            </form>

            {/* Google Map Embed */}
            <div className="rounded overflow-hidden shadow-lg">
              <iframe
                title="map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.292405946646!2d80.01189371478593!3d9.661498193071922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afe5487f31d46ff%3A0xb6469eb5c740e1c!2sJaffna%20City%20Centre!5e0!3m2!1sen!2slk!4v1684242758137"
                width="100%"
                height="100%"
                className="h-96 w-full border-0"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
