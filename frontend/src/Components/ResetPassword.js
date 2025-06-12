import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate,useParams } from "react-router-dom";


const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const formik = useFormik({
        initialValues: {
            password: ''
        },
        validationSchema: Yup.object({
            password: Yup.string().min(6, "Minimum 6 characters").required("Password is required")
        }),
        onSubmit: async(values, {resetForm}) => {
            try {
                const response = await fetch(
                  `${process.env.REACT_APP_API_URL}/api/users/reset-password/${token}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                    },
                    body: JSON.stringify(formik.values),
                  }
                );
    
                if(response.ok) {
                    alert('Your password is reset with success')
                    navigate('/login')
                } else {
                    alert('Password reset failed')
                }
            } catch (err) {
                alert('Error',err.message)
            
            }
        }
    })

    return (
      <div className="container mt-5" style={{ maxWidth: "500px" }}>
        <h2 className="mb-4">ResetPassword</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className={`form-control ${
                formik.touched.password && formik.errors.password
                  ? "is-invalid"
                  : ""
              }`}
              placeholder="Enter your password"
              autoComplete="current-password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback">{formik.errors.password}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Reset
          </button>
        </form>
      </div>
    );
}

export default ResetPassword