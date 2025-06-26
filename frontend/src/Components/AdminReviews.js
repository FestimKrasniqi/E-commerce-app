// src/pages/AdminReviewsPage.jsx
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/reviews/all`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/reviews/delete/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setReviews(reviews.filter((r) => r._id !== id));
      } else {
        alert("Failed to delete review.");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  const handleEdit = (id) => {
  navigate(`/update-review/${id}`);
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div className="container mt-4">
      <h2>Admin Review Management</h2>
      <table className="table table-bordered table-hover mt-3">
        <thead className="thead-dark">
          <tr>
            <th>Product</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id}>
              <td>{review.user?.name || "Unknown User"}</td>
              <td>{review.product?.name || "Unknown Product"}</td>
              <td>{review.rating}</td>
              <td>{review.comment}</td>
              <td>{new Date(review.createdAt).toLocaleDateString()}</td>
              <td>
                <button className="btn btn-sm btn-primary me-2" title="Edit" onClick={()=> handleEdit(review._id)}>
                  <FaEdit />
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  title="Delete"
                  onClick={() => handleDelete(review._id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReviewsPage;
