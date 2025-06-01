// src/Components/ViewAccounts.js
import React, { useEffect, useState } from "react";

const ViewAccounts = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:4000/api/accounts/all", {
            method : 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch accounts");
        }

        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">All User Accounts</h2>
      {accounts.length > 0 ? (
        <table className="table table-striped table-bordered">
          <thead className="table-primary">
            <tr>
              <th>Account Number</th>
              <th>User Name</th>
              <th>User Email</th>
              <th>Account Type</th>
              <th>Currency</th>
              <th>Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc._id}>
                <td>{acc.accountNumber}</td>
                <td>{acc.userId?.name || "N/A"}</td>
                <td>{acc.userId?.email || "N/A"}</td>
                <td>{acc.accountType}</td>
                <td>{acc.currency}</td>
                <td>{acc.balance}</td>
                <td>{acc.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No accounts found.</p>
      )}
    </div>
  );
};

export default ViewAccounts;
