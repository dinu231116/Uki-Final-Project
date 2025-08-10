import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-700">Loading profile...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-6 text-blue-900">My Profile</h2>
      <div className="space-y-4">
        <ProfileRow label="Name" value={profile.name} />
        <ProfileRow label="Email" value={profile.email} />
        <ProfileRow label="Phone" value={profile.phone || "Not provided"} />
        <ProfileRow label="Address" value={profile.address || "Not provided"} />
        <ProfileRow label="Total Orders" value={profile.totalOrders} />
        <ProfileRow label="Active Orders" value={profile.activeOrders} />
        <ProfileRow label="Completed Orders" value={profile.completedOrders} />
        <ProfileRow
          label="Last Order Date"
          value={
            profile.lastOrderDate
              ? new Date(profile.lastOrderDate).toLocaleDateString()
              : "No orders yet"
          }
        />
        <ProfileRow
          label="Joined On"
          value={new Date(profile.joinedOn).toLocaleDateString()}
        />
      </div>
    </div>
  );
};

const ProfileRow = ({ label, value }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-900">{value}</span>
  </div>
);

export default ProfilePage;
