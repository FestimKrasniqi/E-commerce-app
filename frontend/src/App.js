import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate

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


const App = () => {




  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} exact />

        <Route path="/register" element={<Register />} exact />
        <Route path="/login" element={<Login />} exact />
        <Route path="/forget" element={<ForgetPassword />} exact />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
          exact
        />
        {/* Protected Admin Route */}
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
          path="/profile/:uid"
          element={
            <ProtectedRoute requiredRole="user">
              <Profile />
            </ProtectedRoute>
          }
          exact
        />

        <Route path="/update-user/:uid" element={<UpdateUser />} exact />

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
          path="/products/:id"
          element={
            <ProtectedRoute requiredRole="user">
              <ProductDetails />
            </ProtectedRoute>
          }
          exact
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
