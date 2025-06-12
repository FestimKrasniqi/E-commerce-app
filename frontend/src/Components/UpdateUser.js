import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateUser = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active",
    profile: {
      phone: "",
      address: "",
      city: "",
      country: "",
      dateOfBirth: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/users/profile/${uid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          alert("Failed to load user data.");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchUser();
  }, [uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("profile.")) {
      const profileKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/update/${uid}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("User updated successfully");
        navigate(`/profile/${uid}`);
      } else {
        const err = await response.json();
        alert("Update failed: " + (err.message || "Validation error"));
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("An error occurred while updating.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Update User</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Role</label>
          <select
            className="form-control"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Status</label>
          <select
            className="form-control"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Phone</label>
          <input
            className="form-control"
            name="profile.phone"
            value={formData.profile?.phone || ""}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Address</label>
          <input
            className="form-control"
            name="profile.address"
            value={formData.profile?.address || ""}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>City</label>
          <input
            className="form-control"
            name="profile.city"
            value={formData.profile?.city || ""}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Country</label>
          <input
            className="form-control"
            name="profile.country"
            value={formData.profile?.country || ""}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Date of Birth</label>
          <input
            type="date"
            className="form-control"
            name="profile.dateOfBirth"
            value={formData.profile?.dateOfBirth?.substring(0, 10) || ""}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary">Update</button>
      </form>
    </div>
  );
};

export default UpdateUser;
