import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const queryParams = new URLSearchParams();
      if (category) queryParams.append("category", category);
      if (keyword) queryParams.append("keyword", keyword);
      if (minPrice) queryParams.append("minPrice", minPrice);
      if (maxPrice) queryParams.append("maxPrice", maxPrice);
      if (inStock) queryParams.append("inStock", "true");
      if (sortBy) queryParams.append("sortBy", sortBy);
      if (order) queryParams.append("order", order);

      const res = await fetch(
        `${
          process.env.REACT_APP_API_URL
        }/api/products/search?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, keyword, minPrice, maxPrice, inStock, sortBy, order]);

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">All Products</h2>

      {/* Filter Controls */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search keyword..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <div className="col-md-1">
          <div className="form-check mt-2">
            <input
              className="form-check-input"
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              id="inStockCheck"
            />
            <label className="form-check-label" htmlFor="inStockCheck">
              In Stock
            </label>
          </div>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={`${sortBy}_${order}`}
            onChange={(e) => {
              const [field, ord] = e.target.value.split("_");
              setSortBy(field);
              setOrder(ord);
            }}
          >
            <option value="createdAt_desc">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A-Z</option>
            <option value="name_desc">Name: Z-A</option>
          </select>
        </div>
      </div>

      {/* Product List */}
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="col-md-3 mb-4" key={product._id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={`${process.env.REACT_APP_API_URL}/${product.image}`}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted">{product.price}€</p>
                  <p className="card-text text-muted">{product.category}</p>
                  <Link
                    to={`/products/${product._id}`}
                    className="btn btn-outline-primary w-100"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
