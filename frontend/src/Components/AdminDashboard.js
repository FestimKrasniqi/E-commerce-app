import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role !== "admin") {
      alert("Access denied. Admins only.");
      navigate("/login");
    }
  }, [navigate, token, role]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
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
              to="/admin/reports"
              className="list-group-item list-group-item-action"
            >
              📊 Reports & Analytics
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
                  <span className="fs-4 text-primary">120</span>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="card text-center p-3">
                  <h6>Total Orders</h6>
                  <span className="fs-4 text-success">78</span>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="card text-center p-3">
                  <h6>Registered Users</h6>
                  <span className="fs-4 text-info">45</span>
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
