import React, { useEffect, useState } from "react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/users/all`,
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
          setUsers(data); // expecting an array of users
        } else {
          console.error("Failed to fetch users.");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">User Information</h2>
      {users.length > 0 ? (
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
            {users.map((user, index) => (
              <tr key={index}>
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
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default ManageUsers;
