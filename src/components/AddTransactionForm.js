"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
export default function AddTransactionForm() {
  const [formData, setFormData] = useState({
    Title: "",
    category: "",
    amount: "",
    date: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { Title, amount, date, description } = formData;
    if (!Title || !amount || !date || !description) {
      toast.error("Please fill in all fields");
      return false;
    }
    if (isNaN(amount)) {
      toast.error("Amount must be a number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add transaction");

      toast.success("Transaction added successfully!");

      setFormData({
        Title: "",
        amount: "",
        date: "",
        description: "",
      });
    } catch (err) {
      toast.error("Error adding transaction");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-6">
      <ToastContainer position="top-center" autoClose={3000} />
      <Input
        type="text"
        name="Title"
        placeholder="Title"
        value={formData.Title}
        onChange={handleChange}
      />
      <div className="flex flex-col gap-1">
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="p-2 rounded-md border"
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Others">Others</option>
        </select>
      </div>
      <Input
        type="text"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
      />
      <Input
        type="date"
        name="date"
        placeholder="Date"
        value={formData.date}
        onChange={handleChange}
      />
      <Textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <center>
        <Button type="submit" className="tt">
          Add Transaction
        </Button>
      </center>
    </form>
  );
}
