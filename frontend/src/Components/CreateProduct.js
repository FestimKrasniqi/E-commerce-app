import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Minimum 3 characters")
        .required("Name is required"),
      description: Yup.string()
        .min(10, "Minimum 10 characters")
        .required("Description is required"),
      price: Yup.number()
        .min(0, "Price cannot be negative")
        .required("Price is required"),
      category: Yup.string().required("Category is required"),
      stock: Yup.number()
        .min(0, "Stock cannot be negative")
        .required("Stock is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("price", values.price);
        formData.append("category", values.category);
        formData.append("stock", values.stock);
        if (imageFile) {
          formData.append("image", imageFile);
        }

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:4000/api/products/create",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (response.ok) {
          alert("Product created successfully!");
          resetForm();
          setImageFile(null);
          navigate("/admin/products"); // change route as needed
        } else {
          const errorData = await response.json();
          alert(
            "Failed to create product: " +
              (errorData.message || "Unknown error")
          );
        }
      } catch (err) {
        alert("Error: " + err.message);
      }
    },
  });

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Create Product</h2>
      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
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

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className={`form-control ${
              formik.touched.description && formik.errors.description
                ? "is-invalid"
                : ""
            }`}
            rows={3}
            {...formik.getFieldProps("description")}
          />
          {formik.touched.description && formik.errors.description && (
            <div className="invalid-feedback">{formik.errors.description}</div>
          )}
        </div>

        {/* Price */}
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            step="0.01"
            className={`form-control ${
              formik.touched.price && formik.errors.price ? "is-invalid" : ""
            }`}
            {...formik.getFieldProps("price")}
          />
          {formik.touched.price && formik.errors.price && (
            <div className="invalid-feedback">{formik.errors.price}</div>
          )}
        </div>

        {/* Category */}
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            className={`form-control ${
              formik.touched.category && formik.errors.category
                ? "is-invalid"
                : ""
            }`}
            {...formik.getFieldProps("category")}
          />
          {formik.touched.category && formik.errors.category && (
            <div className="invalid-feedback">{formik.errors.category}</div>
          )}
        </div>

        {/* Stock */}
        <div className="mb-3">
          <label className="form-label">Stock</label>
          <input
            type="number"
            className={`form-control ${
              formik.touched.stock && formik.errors.stock ? "is-invalid" : ""
            }`}
            {...formik.getFieldProps("stock")}
          />
          {formik.touched.stock && formik.errors.stock && (
            <div className="invalid-feedback">{formik.errors.stock}</div>
          )}
        </div>

        {/* Image */}
        <div className="mb-4">
          <label className="form-label">Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setImageFile(e.currentTarget.files[0])}
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-100">
          Create Product
        </button>

        <div className="text-center mt-3">
          <Link to="/admin/products">Back to Products</Link>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
