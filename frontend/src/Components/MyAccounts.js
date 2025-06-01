// src/Components/MyAccount.js
import React, { useEffect, useState } from "react";

const MyAccount = () => {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const fetchMyAccount = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:4000/api/accounts/my-account/",
          {
            method : 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch account");
        }

        const data = await response.json();
        setAccount(data);
      } catch (error) {
        console.error("Error fetching account:", error);
      }
    };

    fetchMyAccount();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Account</h2>
      {account ? (
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th>Account Number</th>
              <td>{account.accountNumber}</td>
            </tr>
            <tr>
              <th>Account Type</th>
              <td>{account.accountType}</td>
            </tr>
            <tr>
              <th>Currency</th>
              <td>{account.currency}</td>
            </tr>
            <tr>
              <th>Balance</th>
              <td>{account.balance}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{account.status}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{account.userId?.name}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{account.userId?.email}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Loading account details...</p>
      )}
    </div>
  );
};

export default MyAccount;
