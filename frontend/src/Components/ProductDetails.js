import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/products/productinfo/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      }
    };

    fetchProduct();
  }, [id, token]);

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:4000/api/reviews/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Review submitted successfully.");
        setRating(5);
        setComment("");
      } else {
        alert(data.message || "Failed to submit review.");
      }
    } catch (err) {
      console.error("Review submission error:", err);
      alert("Server error. Please try again.");
    }
  };

  if (!product) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container my-5">
      <Link to="/" className="btn btn-secondary mb-4">
        ← Back to Home
      </Link>
      <div className="row">
        <div className="col-md-6">
          <img
            src={`http://localhost:4000/${product.image}`}
            alt={product.name}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="text-muted">{product.price}€</p>
          <p>{product.description}</p>
          <button className="btn btn-primary mt-3">Add to Cart</button>

          <hr className="my-4" />
          <h4>Leave a Review</h4>
          <form onSubmit={submitReview}>
            <div className="mb-3">
              <label className="form-label">Rating</label>
              <select
                className="form-select"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r > 1 && "s"}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Comment</label>
              <textarea
                className="form-control"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-success">
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
