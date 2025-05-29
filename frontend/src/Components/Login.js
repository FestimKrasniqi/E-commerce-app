import React from 'react'
import * as Yup from "yup"
import { useFormik } from 'formik'
import { Link } from 'react-router-dom'

const Login = () => {
const formik = useFormik({
    initialValues: {
        email: '',
        password: '',
    },

    validationSchema: Yup.object ({
        email: Yup.string().email('Invalid email').required("Email is required"),
        password: Yup.string().min(6, "Minimum 6 characters").required("Password is required")
    }),

    onSubmit: async (values, {resetForm}) => {
        try {
            const response = await fetch('http://localhost:4000/api/users/login', {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                 Accept: "application/json"
                },
                body : JSON.stringify(formik.values)
            });

            if(response.ok) {
                const data = await response.json()
                console.log('Login data', data)
                localStorage.setItem('token',data.token)
                localStorage.setItem('role',data.role)
                alert('Login successful!')
                resetForm()
            } else {
                alert('Login failed')
            }
        } catch(err) {
            alert('Error',err.message)
        }
    }

    
   
});

return (
  <div className="container mt-5" style={{ maxWidth: "500px" }}>
    <h2 className="mb-4">Login</h2>
    <form onSubmit={formik.handleSubmit}>
      {/* Email */}
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className={`form-control ${
            formik.touched.email && formik.errors.email ? "is-invalid" : ""
          }`}
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
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
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="invalid-feedback">{formik.errors.password}</div>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn btn-primary w-100">
        Register
      </button>

      <div className="text-center">
        Dont have an account? <Link to="/register">Signup here</Link>
      </div>
    </form>
  </div>
);


}

export default Login;

