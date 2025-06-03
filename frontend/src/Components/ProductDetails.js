import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
        const token = localStorage.getItem('token');
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
  }, [id]);

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
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
