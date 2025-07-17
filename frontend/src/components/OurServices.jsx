import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const OurServices = () => {
  const { serviceId } = useParams();
  const [settings, setSettings] = useState(null);
  const [services, setServices] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [role, setRole] = useState("");

  const [form, setForm] = useState({
    openTime: "",
    closeTime: "",
    dailyCapacityKg: "",
  });

  // 👇 NEW: Store selected subtypes per dress index
  const [selectedSubtypes, setSelectedSubtypes] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role") || "";
    setRole(userRole);
    console.log("User role:", userRole);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("/api/adminsettings");
        setSettings(res.data);
        setForm({
          openTime: res.data.openTime,
          closeTime: res.data.closeTime,
          dailyCapacityKg: res.data.dailyCapacityKg,
        });
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
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
        dailyCapacityKg: Number(form.dailyCapacityKg),
      });
      alert("Settings updated!");
      setEditMode(false);

      const res = await axios.get("/api/adminsettings");
      setSettings(res.data);
      setForm({
        openTime: res.data.openTime,
        closeTime: res.data.closeTime,
        dailyCapacityKg: res.data.dailyCapacityKg,
      });
    } catch (err) {
      console.error("Error updating settings:", err);
      alert("Update failed!");
    }
  };

  // 👇 Handle subtype select
  const handleSubtypeChange = (dressIndex, value) => {
    setSelectedSubtypes((prev) => ({
      ...prev,
      [dressIndex]: value,
    }));
  };

  if (!settings) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">Our Services</h2>

      {settings && (
        <div className="mb-6 text-gray-700">
          {editMode ? (
            <div className="space-y-2 max-w-sm">
              <div>
                <label className="block text-sm font-medium">Open Time:</label>
                <input
                  type="text"
                  value={form.openTime}
                  onChange={(e) =>
                    setForm({ ...form, openTime: e.target.value })
                  }
                  className="border px-2 py-1 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Close Time:</label>
                <input
                  type="text"
                  value={form.closeTime}
                  onChange={(e) =>
                    setForm({ ...form, closeTime: e.target.value })
                  }
                  className="border px-2 py-1 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Daily Capacity (Kg):
                </label>
                <input
                  type="number"
                  value={form.dailyCapacityKg}
                  onChange={(e) =>
                    setForm({ ...form, dailyCapacityKg: e.target.value })
                  }
                  className="border px-2 py-1 w-full"
                />
              </div>
              <button
                onClick={handleUpdate}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="ml-2 px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              🕒 Open: {settings.openTime} | Close: {settings.closeTime}
              {role === "admin" && (
                <button
                  onClick={() => setEditMode(true)}
                  className="ml-4 px-3 py-1 bg-green-600 text-white rounded"
                >
                  Edit
                </button>
              )}
            </div>
          )}

          <div className="mt-4 overflow-x-auto max-w-md">
            <table className="min-w-full border border-gray-400">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Daily Capacity (Kg)</th>
                  <th className="px-4 py-2 border">Remaining Capacity (Kg)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border">{settings.dailyCapacityKg}</td>
                  <td className="px-4 py-2 border">{settings.remainingCapacityKg}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <button
              onClick={() => navigate("/place-order")}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
            >
              Booking
            </button>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {services.map((service) => (
          <div
            key={service._id}
            className="border rounded-lg shadow-sm p-4 max-w-3xl"
          >
            <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>

            {service.details.length === 0 ? (
              <div className="text-red-600">
                No details available for this service.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 border">Dress</th>
                      <th className="px-4 py-2 border">Subtype</th>
                      <th className="px-4 py-2 border">Unit</th>
                      <th className="px-4 py-2 border">Min Qty</th>
                      <th className="px-4 py-2 border">Max Qty</th>
                      <th className="px-4 py-2 border">Rate</th>
                      <th className="px-4 py-2 border">Delivery</th>
                      <th className="px-4 py-2 border">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {service.details.map((detail, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{detail.dress}</td>

                        <td className="px-4 py-2 border">
                          {detail.subtypes && detail.subtypes.length > 0 ? (
                            <select
                              value={selectedSubtypes[`${idx}`] || ""}
                              onChange={(e) =>
                                handleSubtypeChange(`${idx}`, e.target.value)
                              }
                              className="border px-2 py-1"
                            >
                              <option value="">Select Subtype</option>
                              {detail.subtypes.map((sub, subIdx) => (
                                <option key={subIdx} value={sub.type}>
                                  {sub.type}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-red-600">No subtypes</span>
                          )}
                        </td>

                        <td className="px-4 py-2 border">{detail.unit}</td>
                        <td className="px-4 py-2 border">{detail.minQty}</td>
                        <td className="px-4 py-2 border">{detail.maxQty}</td>

                        <td className="px-4 py-2 border">
                          {(() => {
                            const selectedSubtype = selectedSubtypes[`${idx}`];
                            const sub =
                              detail.subtypes?.find(
                                (s) => s.type === selectedSubtype
                              ) || {};
                            return sub.rate || "-";
                          })()}
                        </td>

                        <td className="px-4 py-2 border">{detail.delivery}</td>

                        <td className="px-4 py-2 border text-center">
                          <button
                            onClick={() => {
                              const selectedSubtype = selectedSubtypes[`${idx}`];
                              if (!selectedSubtype) {
                                alert("Please select a subtype first!");
                                return;
                              }
                              const sub = detail.subtypes.find(
                                (s) => s.type === selectedSubtype
                              );

                              const cart =
                                JSON.parse(localStorage.getItem("cart")) || [];
                              cart.push({
                                serviceId: service._id,
                                dress: detail.dress,
                                subtype: sub.type,
                                rate: sub.rate,
                                unit: detail.unit,
                                minQty: detail.minQty,
                                maxQty: detail.maxQty,
                                delivery: detail.delivery,
                              });
                              localStorage.setItem(
                                "cart",
                                JSON.stringify(cart)
                              );
                              window.dispatchEvent(new Event("cartUpdated"));
                              alert("Added to Cart!");
                            }}
                            className="px-2 py-1 bg-green-200 text-dark rounded hover:bg-green-700"
                          >
                            🛒 Add
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurServices;
