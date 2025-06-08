import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:4000/api/orders/myorders",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error("Failed to fetch orders.");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreate = () => {
    navigate("/create-order");
  };

  const handleUpdate = (id) => {
    navigate(`/update-order/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:4000/api/orders/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Order deleted successfully.");
        fetchOrders(); // Refresh the orders
      } else {
        alert("Failed to delete order.");
      }
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("An error occurred while deleting the order.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Orders</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          Create New Order
        </button>
      </div>

      {orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card mb-4">
            <div className="card-body">
              <h5>Order Details:</h5>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Ordered At:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>

              <h6>Products:</h6>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product?.name || "Deleted Product"}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h6>Shipping Info:</h6>
              <p>
                {order.shippingInfo.address}, {order.shippingInfo.city},{" "}
                {order.shippingInfo.postalCode}, {order.shippingInfo.country}
              </p>

              <h6>Payment Info</h6>
              <p>{order.paymentInfo || "Not Paid yet"}</p>

              <h6>Order Delivery Date</h6>
              <p>
                {order.deliveredAt
                  ? new Date(order.deliveredAt).toLocaleDateString()
                  : "N/A"}
              </p>

              <div className="mt-3">
                <button
                  className="btn btn-warning me-2"
                  onClick={() => handleUpdate(order._id)}
                >
                  Update
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(order._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
