"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function TransactionsList() {
  const [transactions, setTransactions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    Title: "",
    amount: "",
    date: "",
    description: "",
  });

  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      toast.error("Failed to fetch transactions");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      toast.success("Transaction deleted");
      setTransactions((prev) => prev.filter((tx) => tx._id !== id));
    } catch (err) {
      toast.error("Error deleting transaction");
    }
  };

  const handleEditClick = (tx) => {
    setEditId(tx._id);
    setEditForm({
      Title: tx.Title,
      amount: tx.amount,
      date: tx.date.split("T")[0],
      description: tx.description,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Transaction updated");
      setEditId(null);
      fetchTransactions();
    } catch (err) {
      toast.error("Error updating transaction");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-4">
      <center>
        <h1 className="text-2xl font-semibold mb-4">Transactions</h1>
      </center>
      {transactions.map((tx) =>
        editId === tx._id ? (
          <div
            key={tx._id}
            className="p-4 border rounded space-y-2 bg-gray-100"
          >
            <Input
              name="Title"
              value={editForm.Title}
              onChange={handleEditChange}
              placeholder="Title"
            />
            <Input
              name="amount"
              value={editForm.amount}
              onChange={handleEditChange}
              placeholder="Amount"
            />
            <Input
              type="date"
              name="date"
              value={editForm.date}
              onChange={handleEditChange}
            />
            <Textarea
              name="description"
              value={editForm.description}
              onChange={handleEditChange}
              placeholder="Description"
            />
            <div className="flex gap-2">
              <Button onClick={() => handleEditSubmit(tx._id)} className="tt">
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditId(null)}
                className="tt"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div key={tx._id} className="p-4 border rounded space-y-2">
            <div className="font-semibold">{tx.Title}</div>
            <div>₹ {tx.amount}</div>
            <div>{new Date(tx.date).toLocaleDateString()}</div>
            <div className="text-sm text-gray-600">{tx.description}</div>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                onClick={() => handleEditClick(tx)}
                className="tt"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(tx._id)}
                className="tt"
              >
                Delete
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
