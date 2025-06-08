import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateOrder = () => {
  const { id } = useParams(); // Order ID
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [formData, setFormData] = useState({
    products: [],
    shippingInfo: {
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
    paymentInfo: "",
    status: "",
    deliveredAt: "",
  });

  const role = localStorage.getItem("role"); // Get role from localStorage
  const isAdmin = role === "admin";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:4000/api/orders/orderinfo/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setOrder(data);
          setFormData({
            products: data.products.map((p) => ({
              product: p.product.name, // assuming product is populated
              quantity: p.quantity,
            })),
            shippingInfo: data.shippingInfo || {},
            paymentInfo: data.paymentInfo || "",
            status: data.status || "",
            deliveredAt: data.deliveredAt
              ? new Date(data.deliveredAt).toISOString().split("T")[0]
              : "",
          });
        } else {
          console.error("Failed to fetch order.");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchOrder();
  }, [id]);

  const handleProductChange = (index, field, value) => {
    const updated = [...formData.products];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, products: updated }));
  };

  const handleShippingChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      shippingInfo: { ...prev.shippingInfo, [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      // Create a shallow copy of formData
      const dataToSend = { ...formData };

      // Strip admin-only fields if the user is not admin
      if (role !== "admin") {
        delete dataToSend.status;
        delete dataToSend.paymentInfo;
        delete dataToSend.deliveredAt;
      }

      const res = await fetch(`http://localhost:4000/api/orders/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        alert("Order updated successfully!");
        navigate("/admin/orders");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update order.");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };
  
  if (!order) return <p>Loading order...</p>;

  return (
    <div className="container mt-5">
      <h2>Update Order</h2>
      <form onSubmit={handleSubmit}>
        <h4>Products</h4>
        {formData.products.map((item, idx) => (
          <div key={idx} className="mb-2">
            <input
              type="text"
              value={item.product}
              onChange={(e) =>
                handleProductChange(idx, "product", e.target.value)
              }
              placeholder="Product name"
              className="form-control mb-1"
              required
            />
            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                handleProductChange(idx, "quantity", e.target.value)
              }
              placeholder="Quantity"
              className="form-control"
              min="1"
              required
            />
          </div>
        ))}

        <h4>Shipping Info</h4>
        {["address", "city", "postalCode", "country"].map((field) => (
          <input
            key={field}
            type="text"
            value={formData.shippingInfo[field] || ""}
            onChange={(e) => handleShippingChange(field, e.target.value)}
            placeholder={field}
            className="form-control mb-2"
            required
          />
        ))}

        {isAdmin && (
          <>
            <h4>Admin-Only Fields</h4>
            <select
              className="form-control mb-2"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="">Select status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              className="form-control mb-2"
              value={formData.paymentInfo}
              onChange={(e) =>
                setFormData({ ...formData, paymentInfo: e.target.value })
              }
            >
              <option value="">Select payment</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
            </select>

            <label>Delivered At</label>
            <input
              type="date"
              className="form-control mb-2"
              value={formData.deliveredAt}
              onChange={(e) =>
                setFormData({ ...formData, deliveredAt: e.target.value })
              }
            />
          </>
        )}

        <button className="btn btn-success mt-3">Update Order</button>
      </form>
    </div>
  );
};

export default UpdateOrder;
