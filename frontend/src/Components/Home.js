import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { jwtDecode } from "jwt-decode";


const Home = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isLoggedIn = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const [products, setProducts] = useState([]);
  let uid = null;

  // Decode token for UID
  if (isLoggedIn) {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      uid = decoded.id || decoded._id || decoded.uid;
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("uid");
    alert("Logged out successfully");
    navigate("/login");
  };

  // Fetch sample products for homepage
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/products/search?limit=4`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            🛒 ShopZone
          </Link>
          <button
            className="navbar-toggler"
            data-bs-toggle="collapse"
            data-bs-target="#navCollapse"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navCollapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              {isLoggedIn && (
                <li className="nav-item">
                  <Link className="nav-link" to="/myreview">
                    Review
                  </Link>
                </li>
              )}
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
                      Profile
                    </Link>
                  </li>
                  {/* <li className="nav-item">
                    <Link className="nav-link" to="/cart">
                      🛒 Cart
                    </Link>
                  </li> */}
                  <li className="nav-item">
                    <Link className="nav-link" to="/myorders">
                      📦 My Orders
                    </Link>
                  </li>
                  {userRole === "admin" && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/dashboard">
                        Admin
                      </Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <span className="nav-link text-warning">
                      Welcome, {userRole}
                    </span>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-light btn-sm ms-2"
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

      {/* Hero Section */}
      <div className="bg-light text-center py-5">
        <h1 className="display-4 fw-bold">Welcome to ShopZone</h1>
        <p className="lead">
          Discover the best products, great deals & smooth shopping experience.
        </p>
        <Link to="/products" className="btn btn-primary btn-lg mt-3">
          Browse Products
        </Link>
      </div>

      {/* Featured Products */}
      <div className="container my-5">
        <h2 className="mb-4 text-center">Featured Products</h2>
        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              <div className="col-md-3 mb-4" key={product._id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={`${process.env.REACT_APP_API_URL}/` + product.image}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text text-muted">{product.price}€</p>
                    <Link
                      to={`/products/${product._id}`}
                      className="btn btn-outline-primary w-100"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No products found.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        &copy; {new Date().getFullYear()} ShopZone. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
