import React, { useState } from "react";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";

const CreateOrder = () => {
  const navigate = useNavigate();
  const [submissionError, setSubmissionError] = useState("");

  const formik = useFormik({
    initialValues: {
      products: [
        {
          product: "",
          quantity: 1,
        },
      ],
      shippingInfo: {
        address: "",
        city: "",
        postalCode: "",
        country: "",
      },
    },
    validationSchema: Yup.object({
      products: Yup.array()
        .of(
          Yup.object().shape({
            product: Yup.string().required("Product name is required"),
            quantity: Yup.number()
              .min(1, "Minimum quantity is 1")
              .required("Quantity is required"),
          })
        )
        .min(1, "At least one product is required"),
      shippingInfo: Yup.object({
        address: Yup.string().required("Address is required"),
        city: Yup.string().required("City is required"),
        postalCode: Yup.string().required("Postal code is required"),
        country: Yup.string().required("Country is required"),
      }),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/orders/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(values),
          }
        );

        if (response.ok) {
          alert("Order created successfully!");
          resetForm();
          navigate("/myorders"); // Adjust the redirect route if needed
        } else {
          const errorData = await response.json();
          setSubmissionError(errorData.message || "Failed to create order");
        }
      } catch (err) {
        setSubmissionError("An error occurred: " + err.message);
      }
    },
  });

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Create Order</h2>
      <form onSubmit={formik.handleSubmit}>
        <FormikProvider value={formik}>
          <FieldArray
            name="products"
            render={(arrayHelpers) => (
              <>
                {formik.values.products.map((product, index) => (
                  <div key={index} className="border rounded p-3 mb-3">
                    <div className="mb-2">
                      <label>Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name={`products[${index}].product`}
                        value={product.product}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.products &&
                        formik.touched.products[index] &&
                        formik.errors.products &&
                        formik.errors.products[index]?.product && (
                          <div className="text-danger">
                            {formik.errors.products[index].product}
                          </div>
                        )}
                    </div>
                    <div className="mb-2">
                      <label>Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        name={`products[${index}].quantity`}
                        value={product.quantity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.products &&
                        formik.touched.products[index] &&
                        formik.errors.products &&
                        formik.errors.products[index]?.quantity && (
                          <div className="text-danger">
                            {formik.errors.products[index].quantity}
                          </div>
                        )}
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => arrayHelpers.remove(index)}
                      disabled={formik.values.products.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary mb-3"
                  onClick={() =>
                    arrayHelpers.push({ product: "", quantity: 1 })
                  }
                >
                  Add Product
                </button>
              </>
            )}
          />
        </FormikProvider>

        <h5>Shipping Info</h5>
        {["address", "city", "postalCode", "country"].map((field) => (
          <div className="mb-3" key={field}>
            <label className="form-label">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              className="form-control"
              name={`shippingInfo.${field}`}
              value={formik.values.shippingInfo[field]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.shippingInfo &&
              formik.touched.shippingInfo[field] &&
              formik.errors.shippingInfo &&
              formik.errors.shippingInfo[field] && (
                <div className="text-danger">
                  {formik.errors.shippingInfo[field]}
                </div>
              )}
          </div>
        ))}

        {submissionError && (
          <div className="text-danger mb-3">{submissionError}</div>
        )}

        <button type="submit" className="btn btn-primary w-100">
          Create Order
        </button>

        <div className="text-center mt-3">
          <Link to="/myorders">Back to Orders</Link>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;
