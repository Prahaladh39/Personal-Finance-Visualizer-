"use client";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
export default function BudgetForm() {
  const [formData, setFormData] = useState({
    category: "",
    budget: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success("Budget saved!");
      setFormData({ category: "", budget: "" });
    } else {
      toast.success("Error saving budget");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 shadow rounded-xl border w-full max-w-md mx-auto mt-6"
    >
      <h2 className="text-xl font-bold mb-4 text-center">
        Set Category Budget
      </h2>
      <div className="mb-3">
        <input
          name="category"
          type="text"
          placeholder="Category (e.g., Food)"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-3">
        <input
          name="budget"
          type="number"
          placeholder="Monthly Budget (₹)"
          value={formData.budget}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Save Budget
      </button>
    </form>
  );
}
