import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', image: '' });
  const [imageFile, setImageFile] = useState(null);

  // For editing details
  const [editingDetailsId, setEditingDetailsId] = useState(null);
  const [detailsForm, setDetailsForm] = useState([]);

  // For adding details with new service
  const [newDetailsForm, setNewDetailsForm] = useState([
    {
      dress: '',
      subtypes: [],
      unit: '',
      minQty: '',
      maxQty: '',
      delivery: '',
    },
  ]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(services.length / rowsPerPage);
  const paginatedServices = services.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchServices = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/services', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          navigate('/login');
        } else {
          const data = await res.json();
          setServices(data);
          setLoading(false);
        }
      } catch (err) {
        toast.error('Failed to fetch services');
        setLoading(false);
      }
    };

    fetchServices();
  }, [navigate, token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setServices(services.filter((s) => s._id !== id));
        toast.success('Service deleted successfully');
      } else {
        toast.error('Failed to delete service');
      }
    } catch (err) {
      toast.error('Failed to delete service');
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'unsigned_upload');

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dzay9ybyb/image/upload',
        formData
      );
      return res.data.secure_url;
    } catch (error) {
      toast.error("Image upload failed");
      throw error;
    }
  };

  // --- Details for new service ---
  const handleNewDetailsChange = (idx, field, value) => {
    const updated = [...newDetailsForm];
    updated[idx][field] = value;
    setNewDetailsForm(updated);
  };

  const handleAddNewDetailRow = () => {
    setNewDetailsForm([
      ...newDetailsForm,
      {
        dress: '',
        subtypes: [],
        unit: '',
        minQty: '',
        maxQty: '',
        delivery: '',
      },
    ]);
  };

  const handleRemoveNewDetailRow = (idx) => {
    const updated = [...newDetailsForm];
    updated.splice(idx, 1);
    setNewDetailsForm(updated);
  };

  // --- Add/Edit Service ---
  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    let imageUrl = form.image;

    if (imageFile) {
      try {
        imageUrl = await uploadImageToCloudinary(imageFile);
      } catch (err) {
        toast.error('Image upload failed');
        return;
      }
    }

    const dataToSend = {
      name: form.name,
      description: form.description,
      image: imageUrl,
      details: isAdding ? newDetailsForm : undefined,
    };

    if (editingId) {
      const res = await fetch(`http://localhost:5000/api/admin/services/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        const updated = await res.json();
        setServices(services.map((s) => (s._id === editingId ? updated : s)));
        setEditingId(null);
        setForm({ name: '', description: '', image: '' });
        setImageFile(null);
        toast.success('Service updated successfully');
      } else {
        toast.error('Failed to update service');
      }
    } else {
      const res = await fetch(`http://localhost:5000/api/admin/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        const newService = await res.json();
        setServices([...services, newService]);
        setIsAdding(false);
        setForm({ name: '', description: '', image: '' });
        setImageFile(null);
        setNewDetailsForm([
          {
            dress: '',
            subtypes: [],
            unit: '',
            minQty: '',
            maxQty: '',
            delivery: '',
          },
        ]);
        toast.success('Service added successfully');
      } else {
        toast.error('Failed to add service');
      }
    }
  };

  const handleEdit = (service) => {
    setEditingId(service._id);
    setForm({
      name: service.name,
      description: service.description,
      image: service.image || '',
    });
    setImageFile(null);
  };

  // --- Details Edit Logic ---
  const handleEditDetails = (service) => {
    setEditingDetailsId(service._id);
    setDetailsForm(service.details ? JSON.parse(JSON.stringify(service.details)) : []);
  };

  const handleDetailsChange = (idx, field, value) => {
    const updated = [...detailsForm];
    updated[idx][field] = value;
    setDetailsForm(updated);
  };

  const handleAddDetailRow = () => {
    setDetailsForm([
      ...detailsForm,
      {
        dress: '',
        subtypes: [],
        unit: '',
        minQty: '',
        maxQty: '',
        delivery: '',
      },
    ]);
  };

  const handleRemoveDetailRow = (idx) => {
    const updated = [...detailsForm];
    updated.splice(idx, 1);
    setDetailsForm(updated);
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/api/admin/services/${editingDetailsId}/details`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ details: detailsForm }),
    });
    if (res.ok) {
      const updatedService = await res.json();
      setServices(services.map(s => s._id === editingDetailsId ? updatedService : s));
      setEditingDetailsId(null);
      setDetailsForm([]);
      toast.success('Service details updated');
    } else {
      toast.error('Failed to update details');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed */}
      <aside className="hidden md:block w-64 bg-blue-900 text-white fixed top-0 left-0 h-full shadow-lg z-20">
        <div className="p-6 font-bold text-xl border-b border-blue-800">Admin Panel</div>
        <nav className="mt-6 flex flex-col gap-2 px-4">
          <a href="/admin/dashboard" className="py-2 px-4 rounded hover:bg-blue-800 transition">Dashboard</a>
          <a href="/admin/users" className="py-2 px-4 rounded hover:bg-blue-800 transition">Users</a>
          <a href="/admin/orders" className="py-2 px-4 rounded hover:bg-blue-800 transition">Orders</a>
          <a href="/admin/payments" className="py-2 px-4 rounded hover:bg-blue-800 transition">Payments</a>
          <a href="/admin/services" className="py-2 px-4 rounded bg-blue-800">Services</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 relative">
        <h1 className="text-3xl font-bold mb-8 text-blue-900 text-center">Manage Services</h1>

        {/* Add New Service Button */}
        {!isAdding && editingId === null && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsAdding(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              + Add New Service
            </button>
          </div>
        )}

        {/* Modal Form with Blur Effect */}
        {(isAdding || editingId) && (
          <>
            {/* Overlay for blur */}
            <div className="fixed inset-0 bg-black bg-opacity-40 z-30 backdrop-blur-sm"></div>
            {/* Centered Form */}
            <div className="fixed inset-0 z-40 flex items-start justify-center pt-16 overflow-auto">
              <form
                onSubmit={handleAddOrUpdate}
                className="mb-10 bg-white p-8 rounded-xl shadow-lg space-y-6 border border-blue-100 w-full max-w-2xl"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 font-semibold text-blue-900">Name</label>
                    <input
                      type="text"
                      placeholder="Service name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="border px-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-blue-900">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="border px-4 py-2 w-full rounded-lg"
                    />
                    {form.image && !imageFile && (
                      <img
                        src={form.image}
                        alt="Current"
                        className="mt-2 w-24 h-16 object-cover rounded shadow"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-blue-900">Description</label>
                  <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="border px-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400"
                    required
                  ></textarea>
                </div>
                {/* --- Details Section for Add New Service --- */}
                {isAdding && (
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-blue-800">Service Details</h3>
                    {newDetailsForm.map((detail, idx) => (
                      <div key={idx} className="mb-6 border p-4 rounded-lg bg-blue-50 shadow">
                        <div className="grid md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            value={detail.dress}
                            onChange={e => handleNewDetailsChange(idx, 'dress', e.target.value)}
                            placeholder="Dress"
                            className="border px-2 py-1 rounded w-full mb-2"
                          />
                          <input
                            type="text"
                            value={detail.unit}
                            onChange={e => handleNewDetailsChange(idx, 'unit', e.target.value)}
                            placeholder="Unit"
                            className="border px-2 py-1 rounded w-full mb-2"
                          />
                          <input
                            type="text"
                            value={detail.delivery}
                            onChange={e => handleNewDetailsChange(idx, 'delivery', e.target.value)}
                            placeholder="Delivery"
                            className="border px-2 py-1 rounded w-full mb-2"
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <input
                            type="number"
                            value={detail.minQty}
                            onChange={e => handleNewDetailsChange(idx, 'minQty', e.target.value)}
                            placeholder="Min Qty"
                            className="border px-2 py-1 rounded w-full mb-2"
                          />
                          <input
                            type="number"
                            value={detail.maxQty}
                            onChange={e => handleNewDetailsChange(idx, 'maxQty', e.target.value)}
                            placeholder="Max Qty"
                            className="border px-2 py-1 rounded w-full mb-2"
                          />
                        </div>
                        {/* Subtypes array editing (simple version) */}
                        <div className="mb-2">
                          <label className="block font-medium mb-1 text-blue-900">Subtypes</label>
                          {detail.subtypes && detail.subtypes.map((sub, sidx) => (
                            <div key={sidx} className="flex gap-2 mb-1">
                              <input
                                type="text"
                                value={sub.type}
                                onChange={e => {
                                  const updated = [...newDetailsForm];
                                  updated[idx].subtypes[sidx].type = e.target.value;
                                  setNewDetailsForm(updated);
                                }}
                                placeholder="Subtype"
                                className="border px-2 py-1 rounded"
                              />
                              <input
                                type="number"
                                value={sub.rate}
                                onChange={e => {
                                  const updated = [...newDetailsForm];
                                  updated[idx].subtypes[sidx].rate = e.target.value;
                                  setNewDetailsForm(updated);
                                }}
                                placeholder="Rate"
                                className="border px-2 py-1 rounded"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...newDetailsForm];
                                  updated[idx].subtypes.splice(sidx, 1);
                                  setNewDetailsForm(updated);
                                }}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...newDetailsForm];
                              updated[idx].subtypes = updated[idx].subtypes || [];
                              updated[idx].subtypes.push({ type: '', rate: '' });
                              setNewDetailsForm(updated);
                            }}
                            className="bg-blue-500 text-white px-2 py-1 rounded mt-2 hover:bg-blue-600"
                          >
                            + Add Subtype
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveNewDetailRow(idx)}
                          className="bg-red-600 text-white px-3 py-1 rounded mt-2 hover:bg-red-700"
                        >
                          Remove Detail
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddNewDetailRow}
                      className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
                    >
                      + Add Detail Row
                    </button>
                  </div>
                )}
                <div className="flex space-x-4 justify-end">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
                  >
                    {editingId ? 'Update Service' : 'Save Service'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setEditingId(null);
                      setForm({ name: '', description: '', image: '' });
                      setImageFile(null);
                      setNewDetailsForm([
                        {
                          dress: '',
                          subtypes: [],
                          unit: '',
                          minQty: '',
                          maxQty: '',
                          delivery: '',
                        },
                      ]);
                    }}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {/* --- Details Edit Form --- */}
        {editingDetailsId && (
          <form
            onSubmit={handleUpdateDetails}
            className="mb-10 bg-white p-8 rounded-xl shadow-lg space-y-6 border border-blue-100"
          >
            <h3 className="text-xl font-bold mb-6 text-blue-800">Edit Service Details</h3>
            {detailsForm.map((detail, idx) => (
              <div key={idx} className="mb-6 border p-4 rounded-lg bg-blue-50 shadow">
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={detail.dress}
                    onChange={e => handleDetailsChange(idx, 'dress', e.target.value)}
                    placeholder="Dress"
                    className="border px-2 py-1 rounded w-full mb-2"
                  />
                  <input
                    type="text"
                    value={detail.unit}
                    onChange={e => handleDetailsChange(idx, 'unit', e.target.value)}
                    placeholder="Unit"
                    className="border px-2 py-1 rounded w-full mb-2"
                  />
                  <input
                    type="text"
                    value={detail.delivery}
                    onChange={e => handleDetailsChange(idx, 'delivery', e.target.value)}
                    placeholder="Delivery"
                    className="border px-2 py-1 rounded w-full mb-2"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={detail.minQty}
                    onChange={e => handleDetailsChange(idx, 'minQty', e.target.value)}
                    placeholder="Min Qty"
                    className="border px-2 py-1 rounded w-full mb-2"
                  />
                  <input
                    type="number"
                    value={detail.maxQty}
                    onChange={e => handleDetailsChange(idx, 'maxQty', e.target.value)}
                    placeholder="Max Qty"
                    className="border px-2 py-1 rounded w-full mb-2"
                  />
                </div>
                {/* Subtypes array editing (simple version) */}
                <div className="mb-2">
                  <label className="block font-medium mb-1 text-blue-900">Subtypes</label>
                  {detail.subtypes && detail.subtypes.map((sub, sidx) => (
                    <div key={sidx} className="flex gap-2 mb-1">
                      <input
                        type="text"
                        value={sub.type}
                        onChange={e => {
                          const updated = [...detailsForm];
                          updated[idx].subtypes[sidx].type = e.target.value;
                          setDetailsForm(updated);
                        }}
                        placeholder="Subtype"
                        className="border px-2 py-1 rounded"
                      />
                      <input
                        type="number"
                        value={sub.rate}
                        onChange={e => {
                          const updated = [...detailsForm];
                          updated[idx].subtypes[sidx].rate = e.target.value;
                          setDetailsForm(updated);
                        }}
                        placeholder="Rate"
                        className="border px-2 py-1 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...detailsForm];
                          updated[idx].subtypes.splice(sidx, 1);
                          setDetailsForm(updated);
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...detailsForm];
                      updated[idx].subtypes = updated[idx].subtypes || [];
                      updated[idx].subtypes.push({ type: '', rate: '' });
                      setDetailsForm(updated);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded mt-2 hover:bg-blue-600"
                  >
                    + Add Subtype
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDetailRow(idx)}
                  className="bg-red-600 text-white px-3 py-1 rounded mt-2 hover:bg-red-700"
                >
                  Remove Detail
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddDetailRow}
              className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
            >
              + Add Detail Row
            </button>
            <div className="flex space-x-4 justify-end">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
              >
                Save Details
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingDetailsId(null);
                  setDetailsForm([]);
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Main Table & Pagination (blurred when modal open) */}
        <div className={`${isAdding || editingId ? "filter blur-sm pointer-events-none select-none" : ""}`}>
          {loading ? (
            <p className="text-gray-600 text-center">Loading services...</p>
          ) : services.length === 0 ? (
            <p className="text-gray-600 text-center">No services found.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 bg-white shadow rounded-xl">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="border px-4 py-3 text-left text-blue-900 font-semibold">Name</th>
                      <th className="border px-4 py-3 text-left text-blue-900 font-semibold">Description</th>
                      <th className="border px-4 py-3 text-left text-blue-900 font-semibold">Image</th>
                      <th className="border px-4 py-3 text-left text-blue-900 font-semibold">Details</th>
                      <th className="border px-4 py-3 text-blue-900 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedServices.map((service) => (
                      <tr key={service._id} className="border-t hover:bg-blue-50 align-top transition">
                        <td className="border px-4 py-3 align-top font-medium">{service.name}</td>
                        <td className="border px-4 py-3 align-top">{service.description}</td>
                        <td className="border px-4 py-3 break-words align-top">
                          {service.image ? (
                            <img
                              src={service.image}
                              alt="Service"
                              className="w-24 h-16 object-cover rounded shadow"
                            />
                          ) : (
                            <span className="italic text-gray-400">No image</span>
                          )}
                        </td>
                        <td className="border px-4 py-3 align-top">
                          {service.details && service.details.length > 0 ? (
                            <table className="min-w-full border border-gray-300 rounded">
                              <thead className="bg-blue-50">
                                <tr>
                                  <th className="border px-2 py-1 text-left text-blue-900 font-semibold">Dress</th>
                                  <th className="border px-2 py-1 text-left text-blue-900 font-semibold">Subtypes</th>
                                  <th className="border px-2 py-1 text-left text-blue-900 font-semibold">Rate (Rs.)</th>
                                  <th className="border px-2 py-1 text-left text-blue-900 font-semibold">Unit</th>
                                  <th className="border px-2 py-1 text-left text-blue-900 font-semibold">Min Qty</th>
                                  <th className="border px-2 py-1 text-left text-blue-900 font-semibold">Max Qty</th>
                                  <th className="border px-2 py-1 text-left text-blue-900 font-semibold">Delivery</th>
                                </tr>
                              </thead>
                              <tbody>
                                {service.details.map((detail, i) => (
                                  <tr key={i}>
                                    <td className="border px-2 py-1">{detail.dress}</td>
                                    <td className="border px-2 py-1">
                                      {detail.subtypes && detail.subtypes.length > 0 ? (
                                        detail.subtypes.map((sub, idx) => (
                                          <div key={idx} className="inline-block bg-blue-200 text-blue-900 px-2 py-1 rounded mr-1 mb-1 text-xs">
                                             Rs.{sub.rate}
                                          </div>
                                        ))
                                      ) : (
                                        <em className="text-gray-400">No subtypes</em>
                                      )}
                                    </td>
                                    <td className="border px-2 py-1">
                                      {detail.subtypes && detail.subtypes.length > 0 ? (
                                        detail.subtypes.map((sub, idx) => (
                                          <div key={idx} className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-1 mb-1 text-xs">
                                            {sub.rate}
                                          </div>
                                        ))
                                      ) : (
                                        '-'
                                      )}
                                    </td>
                                    <td className="border px-2 py-1">{detail.unit}</td>
                                    <td className="border px-2 py-1">{detail.minQty}</td>
                                    <td className="border px-2 py-1">{detail.maxQty}</td>
                                    <td className="border px-2 py-1">{detail.delivery}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="text-red-600 italic">No details available</p>
                          )}
                        </td>
                        <td className="border px-4 py-3 align-top">
                          <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
                            <button
                              onClick={() => handleEdit(service)}
                              className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition w-full md:w-auto"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleEditDetails(service)}
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition w-full md:w-auto"
                            >
                              Edit Details
                            </button>
                            <button
                              onClick={() => handleDelete(service._id)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition w-full md:w-auto"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-l bg-blue-600 text-white font-bold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    Prev
                  </button>
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`px-4 py-2 font-bold ${
                        currentPage === idx + 1
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-200 text-blue-900 hover:bg-blue-100'
                      } transition`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-r bg-blue-600 text-white font-bold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <ToastContainer position="top-right" autoClose={2500} />
      </main>
    </div>
  );
};

export default AdminServices;