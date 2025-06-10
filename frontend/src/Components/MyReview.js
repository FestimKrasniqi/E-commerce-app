import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMyReviews = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:4000/api/reviews/my", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        } else {
          console.error("Failed to fetch reviews");
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyReviews();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading your reviews...</div>;
  }

  const handleEdit = (reviewId) => {
    
    navigate(`/update-review/${reviewId}`)
  };
  
  const handleDelete = async (reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:4000/api/reviews/delete/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        alert("Review deleted successfully");
      } else {
        alert("Failed to delete review");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Server error");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Reviews</h2>
      {reviews.length === 0 ? (
        <p>You haven't submitted any reviews yet.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Product</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id}>
                <td>{review.product?.name || "Unknown Product"}</td>
                <td>{review.rating}</td>
                <td>{review.comment}</td>
                <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(review._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(review._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyReviews;
