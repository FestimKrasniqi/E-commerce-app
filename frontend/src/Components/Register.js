import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = () => {
    const navigation = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      profile: {
        phone: "",
        address: "",
        city: "",
        country: "",
        dateOfBirth: "",
      },
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
      profile: Yup.object({
        phone: Yup.string().required("Phone is required"),
        address: Yup.string().required("Address is required"),
        city: Yup.string().required("City is required"),
        country: Yup.string().required("Country is required"),
        dateOfBirth: Yup.date().required("Date of Birth is required"),
      }),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/users/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Registered data:", data);
          alert("Registration successful!");
          navigation('/login');
          resetForm();
        } 
          else {
          alert("Registration failed");
        }
      } catch (err) {
        console.log('error:',err)
        alert("Error: " + err.message);
      }
    },
  });

  const getFieldProps = (path) => {
    const value =
      path === "profile.dateOfBirth"
        ? formik.values.profile.dateOfBirth
          ? new Date(formik.values.profile.dateOfBirth)
              .toISOString()
              .split("T")[0]
          : ""
        : path.split(".").reduce((obj, key) => obj?.[key], formik.values) || "";

    return {
      name: path,
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      value: value,
    };
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Register</h2>
      <form onSubmit={formik.handleSubmit}>
        {/* Name */}
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className={`form-control ${
              formik.touched.name && formik.errors.name ? "is-invalid" : ""
            }`}
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="invalid-feedback">{formik.errors.name}</div>
          )}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${
              formik.touched.email && formik.errors.email ? "is-invalid" : ""
            }`}
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="invalid-feedback">{formik.errors.email}</div>
          )}
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className={`form-control ${
              formik.touched.password && formik.errors.password
                ? "is-invalid"
                : ""
            }`}
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="invalid-feedback">{formik.errors.password}</div>
          )}
        </div>

        {/* Phone */}
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className={`form-control ${
              formik.touched.profile?.phone && formik.errors.profile?.phone
                ? "is-invalid"
                : ""
            }`}
            {...getFieldProps("profile.phone")}
          />
          {formik.touched.profile?.phone && formik.errors.profile?.phone && (
            <div className="invalid-feedback">
              {formik.errors.profile.phone}
            </div>
          )}
        </div>

        {/* Address */}
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            className={`form-control ${
              formik.touched.profile?.address && formik.errors.profile?.address
                ? "is-invalid"
                : ""
            }`}
            {...getFieldProps("profile.address")}
          />
          {formik.touched.profile?.address &&
            formik.errors.profile?.address && (
              <div className="invalid-feedback">
                {formik.errors.profile.address}
              </div>
            )}
        </div>

        {/* City */}
        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            className={`form-control ${
              formik.touched.profile?.city && formik.errors.profile?.city
                ? "is-invalid"
                : ""
            }`}
            {...getFieldProps("profile.city")}
          />
          {formik.touched.profile?.city && formik.errors.profile?.city && (
            <div className="invalid-feedback">{formik.errors.profile.city}</div>
          )}
        </div>

        {/* Country */}
        <div className="mb-3">
          <label className="form-label">Country</label>
          <input
            type="text"
            className={`form-control ${
              formik.touched.profile?.country && formik.errors.profile?.country
                ? "is-invalid"
                : ""
            }`}
            {...getFieldProps("profile.country")}
          />
          {formik.touched.profile?.country &&
            formik.errors.profile?.country && (
              <div className="invalid-feedback">
                {formik.errors.profile.country}
              </div>
            )}
        </div>

        {/* Date of Birth */}
        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            className={`form-control ${
              formik.touched.profile?.dateOfBirth &&
              formik.errors.profile?.dateOfBirth
                ? "is-invalid"
                : ""
            }`}
            {...getFieldProps("profile.dateOfBirth")}
          />
          {formik.touched.profile?.dateOfBirth &&
            formik.errors.profile?.dateOfBirth && (
              <div className="invalid-feedback">
                {formik.errors.profile.dateOfBirth}
              </div>
            )}
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
        <div className="text-center">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
