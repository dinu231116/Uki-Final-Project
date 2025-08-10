import React from 'react';
import Sidebar from './Sidebar';

const AdminLayout = ({ children, handleViewDetails, clearDetails }) => {
  return (
    <div className="min-h-screen flex">
      <Sidebar handleViewDetails={handleViewDetails} clearDetails={clearDetails} />
      <main className="flex-1 p-8 bg-gray-50 ml-64">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
