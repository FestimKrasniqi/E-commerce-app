import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const { uid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:4000/api/users/profile/${uid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error("Failed to fetch user.");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchUser();
  }, [uid]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/users/delete/${uid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("User deleted successfully");
        navigate("/login"); // or to a user list/dashboard
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("An error occurred");
    }
  };

  const handleUpdate = () => {
    navigate(`/update-user/${uid}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Profile Info</h2>
      {user ? (
        <>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Address</th>
                <th>City</th>
                <th>Country</th>
                <th>Date Of Birth</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.status || "N/A"}</td>
                <td>{user.role}</td>
                <td>{user.profile?.phone || "N/A"}</td>
                <td>{user.profile?.address || "N/A"}</td>
                <td>{user.profile?.city || "N/A"}</td>
                <td>{user.profile?.country || "N/A"}</td>
                <td>{user.profile?.dateOfBirth || "N/A"}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-3">
            <button className="btn btn-warning me-3" onClick={handleUpdate}>
              Update User
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete User
            </button>
          </div>
        </>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default Profile;
