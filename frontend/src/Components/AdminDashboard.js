import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [user,setUser] = useState(0);
  const [order,setOrder] = useState(0);
  const [product,setProduct] = useState(0);

  useEffect(() => {
    if (!token || role !== "admin") {
      alert("Access denied. Admins only.");
      navigate("/login");
    }
    fetchUserCount()
    fetchOrderCount()
    fetchProductCount()
  }, [navigate, token, role]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const fetchUserCount = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/count`,
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
        const data = await response.json()
        setUser(data)
      } else {
        console.error('Failed to fetch user count')
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const fetchOrderCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/orders/count`,
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
        setOrder(data);
      } else {
        console.error("Failed to fetch order count");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchProductCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/products/count`,
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
        setProduct(data);
      } else {
        console.error("Failed to fetch product count");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <div>
          <span className="me-3 text-success fw-bold">Welcome, Admin</span>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-3">
          <div className="list-group shadow-sm">
            <Link
              to="/admin/manage-users"
              className="list-group-item list-group-item-action"
            >
              👥 Manage Users
            </Link>
            <Link
              to="/admin/products"
              className="list-group-item list-group-item-action"
            >
              🛍️ Manage Products
            </Link>
            <Link
              to="/admin/orders"
              className="list-group-item list-group-item-action"
            >
              📦 View Orders
            </Link>
            <Link
              to="/admin/reviews"
              className="list-group-item list-group-item-action"
            >
              ⭐ Reviews
            </Link>

            <Link to="/" className="list-group-item list-group-item-action">
              🏠 Home Page
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="col-md-9">
          <div className="card p-4 shadow-sm">
            <h5 className="fw-bold">Welcome to the Admin Panel</h5>
            <p className="text-muted">
              Use the sidebar to manage users, products, orders, and reports.
            </p>

            {/* Optional dashboard stats preview */}
            <div className="row mt-4">
              <div className="col-sm-4">
                <div className="card text-center p-3">
                  <h6>Total Products</h6>
                  <span className="fs-4 text-primary">{product}</span>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="card text-center p-3">
                  <h6>Total Orders</h6>
                  <span className="fs-4 text-success">{order}</span>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="card text-center p-3">
                  <h6>Registered Users</h6>
                  <span className="fs-4 text-info">{user}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
