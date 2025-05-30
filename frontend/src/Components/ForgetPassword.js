import React from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Link} from 'react-router-dom'

const ForgetPassword = () => {
const formik = useFormik({
    initialValues: {
        email: ''
    },
    validationSchema: Yup.object({
        email: Yup.string().email('Invalid email').required("Email is required"),
    }),
    onSubmit: async(values, {resetForm}) => {
        try {
            const response = await fetch('http://localhost:4000/api/users/forget-password', {
                method: 'POST',
                headers: {
                     "Content-Type": "application/json",
                      Accept: "application/json"
                },
                body: JSON.stringify(formik.values)
            });

            if(response.ok) {
                const data = await response.json()
                console.log('Login Data:', data)
                alert('a reset password link has been set to your email')
                resetForm()
            } else {
                alert('Reset Password link failed to send')
            }
        } catch (err) {
            alert('Error',err.message)
        
        }
    }
})

return (
  <div className="container mt-5" style={{ maxWidth: "500px" }}>
    <h2 className="mb-4">ForgetPassword</h2>
    <form onSubmit={formik.handleSubmit}>
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

      <button type="submit" className="btn btn-primary w-100">
        Send
      </button>
    </form>
  </div>
);




}

export default ForgetPassword;