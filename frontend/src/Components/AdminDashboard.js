import React from 'react';

import { useNavigate, Link } from "react-router-dom";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");


const AdminDashboard = () => {

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    }

    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Admin Dashboard</h2>
          <div>
            <span className="me-3">Welcome, Admin</span>
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
          <div className="col-md-3">
            <div className="list-group">
              <Link
                to="/admin/manage-users"
                className="list-group-item list-group-item-action"
              >
                Manage Users
              </Link>
              <button className="list-group-item list-group-item-action">
                View Accounts
              </button>
              <button className="list-group-item list-group-item-action">
                Approve Transactions
              </button>
              <button className="list-group-item list-group-item-action">
                Reports & Analytics
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="col-md-9">
            <div className="card p-4 shadow-sm">
              <h5>Welcome to the Admin Panel</h5>
              <p>
                Use the sidebar to manage bank users, transactions, and reports.
              </p>
              {/* Add dynamic admin features here */}
            </div>
          </div>
        </div>
      </div>
    );

}

export default AdminDashboard