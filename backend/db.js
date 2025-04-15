const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri =
  "mongodb+srv://Prahaladh66:Prahaladh66@cluster9.hlb6dqa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster9";
let db;

const connectDB = async () => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db("financeVisualizer"); // Do NOT change this
    console.log("✅ MongoDB Connected (Native Driver)");
  } catch (err) {
    console.error("❌ Connection Error:", err.message);
  }
};

const getDB = () => db;
module.exports = { connectDB, getDB };
