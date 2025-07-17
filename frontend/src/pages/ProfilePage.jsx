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
        const res = await axios.get("http://localhost:5000/api/user/profile", { // <-- fixed URL
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

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone:</strong> {profile.phone || "Not provided"}</p>
      <p><strong>Address:</strong> {profile.address || "Not provided"}</p>
      <p><strong>Total Orders:</strong> {profile.totalOrders}</p>
      <p><strong>Active Orders:</strong> {profile.activeOrders}</p>
      <p><strong>Completed Orders:</strong> {profile.completedOrders}</p>
      <p><strong>Last Order Date:</strong> {profile.lastOrderDate ? new Date(profile.lastOrderDate).toLocaleDateString() : "No orders yet"}</p>
      <p><strong>Joined On:</strong> {new Date(profile.joinedOn).toLocaleDateString()}</p>
    </div>
  );
};

export default ProfilePage;
