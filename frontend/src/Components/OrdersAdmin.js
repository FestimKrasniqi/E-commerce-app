import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:4000/api/orders/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error("Failed to fetch orders.");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdate = (orderId) => {
    navigate(`/update-order/${orderId}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Order Information</h2>
      {orders.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>User Name</th>
              <th>User Email</th>
              <th>Products</th>
              <th>Shipping Address</th>
              <th>Payment Info</th>
              <th>Status</th>
              <th>Delivered At</th>
              <th>Created At</th>
              <th>Actions</th> {/* New column for actions */}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.user?.name || "N/A"}</td>
                <td>{order.user?.email || "N/A"}</td>
                <td>
                  {order.products.map((p, idx) => (
                    <div key={idx}>
                      {p.product?.name || "Unknown Product"} (x{p.quantity})
                    </div>
                  ))}
                </td>
                <td>
                  {order.shippingInfo?.address}, {order.shippingInfo?.city},{" "}
                  {order.shippingInfo?.postalCode},{" "}
                  {order.shippingInfo?.country}
                </td>
                <td>{order.paymentInfo}</td>
                <td>{order.status}</td>
                <td>
                  {order.deliveredAt
                    ? new Date(order.deliveredAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleUpdate(order._id)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading order information...</p>
      )}
    </div>
  );
};

export default ManageOrders;
