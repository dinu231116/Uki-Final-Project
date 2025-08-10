import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const FILTERS = [
  { key: "all", label: "All" },
  { key: "dryclean", label: "Dry Clean" },
  { key: "iron", label: "Iron" },
  { key: "wash", label: "Wash" },
];

const OurServices = () => {
  const { serviceId } = useParams();
  const [settings, setSettings] = useState(null);
  const [services, setServices] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [role, setRole] = useState("");
  const [fadeIn, setFadeIn] = useState(false);

  const [form, setForm] = useState({
    openTime: "",
    closeTime: "",
  });

  const [selectedSubtypes, setSelectedSubtypes] = useState({});
  const [addedItems, setAddedItems] = useState([]);
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    const userRole = localStorage.getItem("role") || "";
    setRole(userRole);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("/api/adminsettings");
        setSettings(res.data);
        setForm({
          openTime: res.data.openTime,
          closeTime: res.data.closeTime,
        });
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const keys = cart.map(
      (item) => `${item.serviceId}-${item.dress}-${item.subtype}`
    );
    setAddedItems(keys);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        if (serviceId) {
          const res = await axios.get(`/api/services/${serviceId}`);
          setServices([res.data]);
        } else {
          const res = await axios.get("/api/services");
          setServices(res.data);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    fetchServices();
  }, [serviceId]);

  const handleUpdate = async () => {
    try {
      await axios.post("/api/adminsettings/update", {
        openTime: form.openTime,
        closeTime: form.closeTime,
      });
      toast.success("Settings updated!");
      setEditMode(false);

      const res = await axios.get("/api/adminsettings");
      setSettings(res.data);
      setForm({
        openTime: res.data.openTime,
        closeTime: res.data.closeTime,
      });
    } catch (err) {
      console.error("Error updating settings:", err);
      toast.error("Update failed!");
    }
  };

  const handleSubtypeChange = (dressIndex, value) => {
    setSelectedSubtypes((prev) => ({
      ...prev,
      [dressIndex]: value,
    }));
  };

  const handleAddToCart = (service, detail, subtype) => {
    const key = `${service._id}-${detail.dress}-${subtype.type}`;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({
      serviceId: service._id,
      dress: detail.dress,
      subtype: subtype.type,
      rate: subtype.rate,
      unit: detail.unit,
      minQty: detail.minQty,
      maxQty: detail.maxQty,
      delivery: detail.delivery,
      image: service.image || "",
      name: service.name || "",
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    setAddedItems((prev) => [...prev, key]);
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Added to Cart!");
  };

  // Filter logic
  const filteredServices = services.filter((service) => {
    if (filter === "all") return true;
    const name = service.name?.toLowerCase() || "";
    if (filter === "dryclean") return name.includes("dry");
    if (filter === "iron") return name.includes("iron");
    if (filter === "wash") return name.includes("wash");
    return true;
  });

  if (!settings) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-8 text-blue-900 text-center tracking-tight drop-shadow">
        Our Services
      </h2>

      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {editMode ? (
            <div className="space-y-4 max-w-md bg-yellow-50 p-4 rounded shadow">
              <div>
                <label className="block text-sm font-semibold mb-1">Open Time</label>
                <input
                  type="text"
                  value={form.openTime}
                  onChange={(e) =>
                    setForm({ ...form, openTime: e.target.value })
                  }
                  className="border rounded w-full px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Close Time</label>
                <input
                  type="text"
                  value={form.closeTime}
                  onChange={(e) =>
                    setForm({ ...form, closeTime: e.target.value })
                  }
                  className="border rounded w-full px-3 py-2"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-700 text-lg">
              🕒 <span className="font-semibold text-green-700">Open:</span> {settings.openTime} |{" "}
              <span className="font-semibold text-red-700">Close:</span> {settings.closeTime}
              {role === "admin" && (
                <button
                  onClick={() => setEditMode(true)}
                  className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Edit
                </button>
              )}
            </div>
          )}
        </div>
        {/* Filter Buttons */}
        <div className="flex gap-3 justify-center">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-5 py-2 rounded-full font-semibold shadow transition ${
                filter === f.key
                  ? "bg-blue-700 text-white scale-105"
                  : "bg-gray-200 text-blue-900 hover:bg-blue-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fade-in */}
      <div className={`space-y-10 transition-opacity duration-1000 ${fadeIn ? "opacity-100" : "opacity-0"}`}>
        {filteredServices.map((service) => (
          <div
            key={service._id}
            className="border-l-4 border-blue-600 rounded-lg shadow-xl p-8 bg-gradient-to-br from-blue-50 to-blue-100"
          >
            <div className="flex flex-col md:flex-row md:items-center md:gap-8">
              {service.image && (
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-40 h-28 object-cover rounded-lg shadow-lg mb-4 md:mb-0"
                />
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-blue-800 mb-2 drop-shadow">
                  {service.name}
                </h3>
                <p className="text-gray-700 mb-4">{service.description}</p>
              </div>
            </div>

            {service.details.length === 0 ? (
              <p className="text-red-600">No details available for this service.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                {service.details.map((detail, idx) => {
                  const key = `${service._id}-${detail.dress}-${selectedSubtypes[`${idx}`] || ""}`;
                  const isAdded = addedItems.includes(key);

                  const selectedSubtype = selectedSubtypes[`${idx}`];
                  const sub =
                    detail.subtypes?.find(
                      (s) => s.type === selectedSubtype
                    ) || {};

                  return (
                    <div
                      key={idx}
                      className="border bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between hover:shadow-2xl transition-shadow transform hover:scale-105 transition-transform duration-300"
                    >
                      <div>
                        <h4 className="text-lg font-bold mb-2 text-blue-700">
                          {detail.dress}
                        </h4>

                        <div className="mb-2">
                          {detail.subtypes?.length > 0 ? (
                            <select
                              value={selectedSubtypes[`${idx}`] || ""}
                              onChange={(e) =>
                                handleSubtypeChange(`${idx}`, e.target.value)
                              }
                              className="border rounded w-full px-2 py-1"
                            >
                              <option value="">Select Subtype</option>
                              {detail.subtypes.map((sub, subIdx) => (
                                <option key={subIdx} value={sub.type}>
                                  {sub.type}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-red-500">No subtypes</span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-2 text-sm">
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            <span className="font-medium">Unit:</span> {detail.unit}
                          </span>
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            <span className="font-medium">Min Qty:</span> {detail.minQty}
                          </span>
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                            <span className="font-medium">Max Qty:</span> {detail.maxQty}
                          </span>
                        </div>
                        <div className="mb-1 text-gray-700 text-sm">
                          <span className="font-medium">Rate:</span>{" "}
                          {sub.rate ? (
                            <span className="text-green-700 font-bold">Rs. {sub.rate}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                        <div className="mb-1 text-gray-700 text-sm">
                          <span className="font-medium">Delivery:</span>{" "}
                          <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            {detail.delivery}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (!selectedSubtype) {
                            toast.warn("Please select a subtype first!");
                            return;
                          }
                          if (isAdded) {
                            toast.warn("Already Added!");
                            return;
                          }
                          handleAddToCart(service, detail, sub);
                        }}
                        className={`mt-6 w-full px-3 py-2 rounded-lg font-semibold shadow ${
                          isAdded
                            ? "bg-red-600 text-white"
                            : "bg-green-600 text-white hover:bg-green-700 active:scale-95 transition-transform duration-150"
                        }`}
                      >
                        {isAdded ? "Added" : "Add to Cart"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default OurServices;