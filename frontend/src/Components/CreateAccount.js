import React, { useState } from "react";

const CreateAccount = () => {
  const [form, setForm] = useState({
    accountType: "checking",
    balance: 0,
    currency: "USD",
    status: "active",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:4000/api/accounts/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully");
      } else {
        alert(data.message || "Failed to create account");
      }
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Create Account</h3>
      <div className="mb-3">
        <label>Account Type</label>
        <select
          name="accountType"
          className="form-control"
          onChange={handleChange}
          value={form.accountType}
        >
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
          <option value="current">Current</option>
          <option value="fixed">Fixed</option>
        </select>
      </div>
      <div className="mb-3">
        <label>Balance</label>
        <input
          type="number"
          name="balance"
          className="form-control"
          onChange={handleChange}
          value={form.balance}
        />
      </div>
      <div className="mb-3">
        <label>Currency</label>
        <input
          type="text"
          name="currency"
          className="form-control"
          onChange={handleChange}
          value={form.currency}
        />
      </div>
      <button className="btn btn-success" onClick={handleCreate}>
        Create
      </button>
    </div>
  );
};

export default CreateAccount;
