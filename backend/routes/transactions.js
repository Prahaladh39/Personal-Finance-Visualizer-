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
router.post("/budgets", async (req, res) => {
  const db = getDB(); // ✅ Fixed function name
  const { category, budget } = req.body;

  if (!category || !budget) {
    return res.status(400).json({ error: "Category and budget are required" });
  }

  try {
    const result = await db.collection("budgets").insertOne({
      category,
      budget: parseFloat(budget),
      createdAt: new Date(),
    });
    res.status(201).json({ message: "Budget saved", id: result.insertedId });
  } catch (err) {
    console.error("Budget insert error:", err);
    res.status(500).json({ error: "Failed to save budget" });
  }
});
// GET route to fetch all budgets
router.get("/budgets", async (req, res) => {
  try {
    const db = getDB(); // ✅ make sure it's getDB not getDb
    const budgets = await db.collection("budgets").find().toArray();
    res.status(200).json(budgets);
  } catch (err) {
    console.error("Fetch Budgets Error:", err);
    res.status(500).json({ message: "Failed to fetch budgets" });
  }
});
router.get("/insights", async (req, res) => {
  try {
    const db = getDB();
    const transactions = await db.collection("transactions").find().toArray();

    const thisMonth = new Date().getMonth();
    const monthlyTransactions = transactions.filter((t) => {
      const txnDate = new Date(t.date);
      return txnDate.getMonth() === thisMonth;
    });

    let total = 0;
    const categorySpending = {};
    const categoryCount = {};

    for (let t of monthlyTransactions) {
      const cat = t.category;
      const amt = parseFloat(t.amount);
      total += amt;

      categorySpending[cat] = (categorySpending[cat] || 0) + amt;
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    }

    const categories = Object.keys(categorySpending);

    const highestCategory = categories.reduce((a, b) =>
      categorySpending[a] > categorySpending[b] ? a : b
    );
    const lowestCategory = categories.reduce((a, b) =>
      categorySpending[a] < categorySpending[b] ? a : b
    );
    const mostFrequentCategory = Object.keys(categoryCount).reduce((a, b) =>
      categoryCount[a] > categoryCount[b] ? a : b
    );

    res.json({
      totalSpentThisMonth: total,
      highestCategory,
      lowestCategory,
      mostFrequentCategory,
    });
  } catch (error) {
    console.error("Insights Error:", error);
    res.status(500).json({ message: "Error fetching insights" });
  }
});
module.exports = router;
