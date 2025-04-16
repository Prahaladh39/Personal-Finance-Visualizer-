const express = require("express");
const router = express.Router();
const { getDB } = require("../db");
const { ObjectId } = require("mongodb");
function isValidObjectId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}
router.post("/transactions", async (req, res) => {
  try {
    const { Title, category, amount, date, description } = req.body;

    if (!Title || !category || !amount || !date || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const db = getDB();
    const result = await db.collection("transactions").insertOne({
      Title,
      category,
      amount,
      date,
      description,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Transaction saved!",
      transactionId: result.insertedId,
    });
  } catch (error) {
    console.error("Insert Error:", error);
    res.status(500).json({ message: "Server error." });
  }
});
router.get("/transactions", async (req, res) => {
  try {
    const db = getDB();
    const transactions = await db.collection("transactions").find().toArray();
    console.log("Fetched transactions:", transactions);
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.delete("/transactions/:id", async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const result = await db
      .collection("transactions")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting transaction" });
  }
});

router.put("/transactions/:id", async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const updatedData = req.body;

    const result = await db
      .collection("transactions")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction updated successfully" });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "Error updating transaction" });
  }
});

module.exports = router;
