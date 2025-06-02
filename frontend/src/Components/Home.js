import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { jwtDecode } from "jwt-decode";


const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  let uid = null;

  // Extract UID from JWT token
  if (isLoggedIn) {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      uid = decoded.id || decoded._id || decoded.uid; // Adjust depending on your backend's payload
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("uid"); // just in case
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">
           Ecommerce Website
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {!isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">
                      Sign Up
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to={`/profile/${uid}`}>
                      My Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/transaction">
                      Transaction
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/account">
                      Account
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/create-account">
                      Create Account
                    </Link>
                  </li>

                  <li className="nav-item">
                    <span className="nav-link">
                      Welcome, {userRole || "User"}
                    </span>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-light btn-sm ms-2"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container text-center mt-5">
        <h1 className="display-4">Welcome to the Ecommerce website</h1>
        <p className="lead">
          Manage your finances, make transactions, and view your account history
          securely and easily.
        </p>
        {!isLoggedIn && (
          <div className="mt-4">
            <Link className="btn btn-primary me-3" to="/login">
              Login
            </Link>
            <Link className="btn btn-outline-primary" to="/register">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
