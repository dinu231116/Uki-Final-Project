import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ handleViewDetails, clearDetails }) => {
  const location = useLocation();

  const getActiveLink = (path) => {
    if (location.pathname === '/admin/dashboard' && path === '/admin/dashboard') {
      return 'bg-blue-700';
    }
    if (location.pathname === path) {
      return 'bg-blue-700';
    }
    return '';
  };

  return (
    <aside className="w-64 bg-blue-900 text-white p-6 space-y-4 fixed top-0 left-0 h-full overflow-y-auto z-10">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        <Link
          to="/admin/dashboard"
          className={`block hover:bg-blue-700 px-3 py-2 rounded ${getActiveLink('/admin/dashboard')}`}
          onClick={clearDetails}
        >
          Dashboard Home
        </Link>
        <Link
          to="/admin/orders"
          className={`block hover:bg-blue-700 px-3 py-2 rounded ${getActiveLink('/admin/orders')}`}
          onClick={() => handleViewDetails && handleViewDetails('orders')}
        >
          Orders
        </Link>
        <Link
          to="/admin/users"
          className={`block hover:bg-blue-700 px-3 py-2 rounded ${getActiveLink('/admin/users')}`}
          onClick={() => handleViewDetails && handleViewDetails('users')}
        >
          Users
        </Link>
        <Link
          to="/admin/payments"
          className={`block hover:bg-blue-700 px-3 py-2 rounded ${getActiveLink('/admin/payments')}`}
          onClick={() => handleViewDetails && handleViewDetails('payments')}
        >
          Payments
        </Link>
        <Link
          to="/admin/services"
          className={`block hover:bg-blue-700 px-3 py-2 rounded ${getActiveLink('/admin/services')}`}
          onClick={() => handleViewDetails && handleViewDetails('services')}
        >
          Services
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
