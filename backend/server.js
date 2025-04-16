const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const transactionRoutes = require("./routes/transactions");
//const budgetRoutes = require("./routes/transactions");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", transactionRoutes);
connectDB().then(() => {
  app.use("/api", transactionRoutes);
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
