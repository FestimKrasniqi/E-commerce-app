import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";
import ForgetPassword from "./Components/ForgetPassword";
import ResetPassword from "./Components/ResetPassword";
import Home from "./Components/Home";
import AdminDashboard from "./Components/AdminDashboard";
import ProtectedRoute from "./ProtectRoute";
import ManageUsers from "./Components/ManageUsers";
import Profile from "./Components/Profile";
import UpdateUser from "./Components/UpdateUser";
import ManageProducts from "./Components/ManageProducts";
import CreateProduct from "./Components/CreateProduct";
import UpdateProduct from "./Components/UpdateProduct";
import ProductDetails from "./Components/ProductDetails";
import Products from "./Components/Products";
import CreateOrder from "./Components/CreateOrder";
import MyOrders from "./Components/MyOrders";
import ManageOrders from "./Components/OrdersAdmin";
import UpdateOrder from "./Components/UpdateOrder";
import MyReviews from "./Components/MyReview";
import PublicOnlyRoute from "./PublicRoutes";
import AdminReviewsPage from "./Components/AdminReviews";
import UpdateReview from "./Components/UpdateReview";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} exact />

        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
          exact
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
          exact
        />
        <Route
          path="/forget"
          element={
            <PublicOnlyRoute>
              <ForgetPassword />
            </PublicOnlyRoute>
          }
          exact
        />
        <Route
          path="/reset-password/:token"
          element={
            <PublicOnlyRoute>
              <ResetPassword />
            </PublicOnlyRoute>
          }
          exact
        />

        {/* ✅ Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
          exact
        />
        <Route
          path="/admin/manage-users"
          element={
            <ProtectedRoute requiredRole="admin">
              <ManageUsers />
            </ProtectedRoute>
          }
          exact
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requiredRole="admin">
              <ManageProducts />
            </ProtectedRoute>
          }
          exact
        />
        <Route
          path="/create-product"
          element={
            <ProtectedRoute requiredRole="admin">
              <CreateProduct />
            </ProtectedRoute>
          }
          exact
        />
        <Route
          path="/update-product/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <UpdateProduct />
            </ProtectedRoute>
          }
          exact
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requiredRole="admin">
              <ManageOrders />
            </ProtectedRoute>
          }
          exact
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminReviewsPage />
            </ProtectedRoute>
          }
          exact
        />

        {/* ✅ Shared User/Admin Protected Routes */}
        <Route
          path="/profile/:uid"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
          exact
        />
        <Route
          path="/update-user/:uid"
          element={
            <ProtectedRoute>
              <UpdateUser />
            </ProtectedRoute>
          }
          exact
        />
        <Route
          path="/create-order"
          element={
            <ProtectedRoute>
              <CreateOrder />
            </ProtectedRoute>
          }
          exact
        />
        <Route
          path="/myorders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
          exact
        />
        <Route
          path="/myreview"
          element={
            <ProtectedRoute>
              <MyReviews />
            </ProtectedRoute>
          }
          exact
        />
        <Route
          path="/update-order/:id"
          element={
            <ProtectedRoute>
              <UpdateOrder />
            </ProtectedRoute>
          }
          exact
        />
        <Route
          path="/update-review/:id"
          element={
            <ProtectedRoute>
              <UpdateReview />
            </ProtectedRoute>
          }
          exact
        />

        {/* ✅ Public Product Pages */}
        <Route path="/products/:id" element={<ProductDetails />} exact />
        <Route path="/products" element={<Products />} exact />

        {/* Redirect all other routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
