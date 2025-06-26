import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateReview = () => {
  const { id } = useParams(); // this should be the review ID
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rating: "",
    comment: "",
  });

  useEffect(() => {
    const fetchReview = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/reviews/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFormData({
            rating: data.rating,
            comment: data.comment,
          });
        } else {
          alert("Failed to load review data.");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchReview();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/reviews/update/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Review updated successfully");
        navigate("/myreview");
      } else {
        const err = await response.json();
        alert("Update failed: " + (err.message || "Validation error"));
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("An error occurred while updating.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Update Review</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Rating (1 to 5)</label>
          <input
            type="number"
            className="form-control"
            name="rating"
            min="1"
            max="5"
            value={formData.rating}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Comment</label>
          <textarea
            className="form-control"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <button className="btn btn-primary">Update Review</button>
      </form>
    </div>
  );
};

export default UpdateReview;
