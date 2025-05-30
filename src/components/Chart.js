"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
const renderCustomizedLabel = ({ percent, name }) =>
  `${name} ${(percent * 100).toFixed(0)}%`;
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#845EC2",
  "#D65DB1",
];
const Chart = () => {
  const [transactions, setTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [insights, setInsights] = useState(null);
  const [data, setData] = useState([]);
  useEffect(() => {
    // Fetch transactions
    fetch("http://localhost:5000/api/transactions")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);

        // Calculate total
        const total = data.reduce((sum, txn) => sum + Number(txn.amount), 0);
        setTotalExpense(total);

        // Group by category
        const grouped = data.reduce((acc, txn) => {
          const cat = txn.category || "Others";
          if (!acc[cat]) acc[cat] = 0;
          acc[cat] += Number(txn.amount);
          return acc;
        }, {});

        const transformed = Object.entries(grouped).map(
          ([category, amount]) => ({
            category,
            amount,
          })
        );

        setCategoryData(transformed);
      });
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/transactions");
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      }
    };

    fetchTransactions();
  }, []);

  const getMonthlyExpenses = (transactions) => {
    const monthlyTotals = {};

    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const month = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      const amount = parseFloat(tx.amount);

      if (!monthlyTotals[month]) {
        monthlyTotals[month] = 0;
      }

      monthlyTotals[month] += amount;
    });

    const result = Object.keys(monthlyTotals).map((month) => ({
      month,
      amount: monthlyTotals[month],
    }));

    return result.sort(
      (a, b) => new Date(`1 ${a.month}`) - new Date(`1 ${b.month}`)
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      const budgetRes = await fetch("http://localhost:5000/api/budgets");
      const budgets = await budgetRes.json();

      const transactionRes = await fetch(
        "http://localhost:5000/api/transactions"
      );
      const transactions = await transactionRes.json();

      const categoryTotals = {};
      transactions.forEach((t) => {
        categoryTotals[t.category] =
          (categoryTotals[t.category] || 0) + parseFloat(t.amount);
      });

      const combinedData = budgets.map((b) => ({
        category: b.category,
        budget: b.budget,
        spent: categoryTotals[b.category] || 0,
      }));

      setData(combinedData);
    };

    fetchData();
  }, []);
  const monthlyExpenses = getMonthlyExpenses(transactions);
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/insights");
        const data = await res.json();
        setInsights(data);
      } catch (err) {
        console.error("Error fetching insights:", err);
      }
    };
    fetchInsights();
  }, []);

  if (!insights) return <p className="text-center mt-4">Loading insights...</p>;

  return (
    <>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-center">Monthly Expenses</h2>
        <ResponsiveContainer width="60%" height={400}>
          <BarChart data={monthlyExpenses}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#8884d8" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="full-line-divider">
        <h1>Pie Chart</h1>
      </div>
      <div className="max-w-4xl mx-auto p-6">
        {/* 🔥 Pie Chart Title with Divider */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-full h-px bg-gray-300 absolute left-0 right-0 top-1/2 transform -translate-y-1/2"></div>
          <span className="bg-white px-4 text-xl font-bold text-gray-700 z-10">
            Category-wise Expense Breakdown
          </span>
        </div>

        {/* 📊 Card Wrapper */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Total Spent: ₹{totalExpense}
          </h2>

          {/* 📈 Pie Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={renderCustomizedLabel}
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="full-line-divider">
        <h1>Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {/* 💰 Total Expenses Card */}
        <div className="bg-blue-100 p-4 rounded-2xl shadow-md text-center">
          <h3 className="text-lg font-semibold text-blue-900">
            Total Expenses
          </h3>
          <p className="text-2xl font-bold mt-2 text-blue-800">
            ₹{totalExpense}
          </p>
        </div>

        {/* 🧾 Top Category Card */}
        <div className="bg-purple-100 p-4 rounded-2xl shadow-md text-center">
          <h3 className="text-lg font-semibold text-purple-900">
            Top Category
          </h3>
          <p className="text-xl font-bold mt-2 text-purple-800">
            {categoryData.length > 0
              ? categoryData.reduce((prev, current) =>
                  prev.amount > current.amount ? prev : current
                ).category
              : "N/A"}
          </p>
        </div>

        {/* 🕒 Most Recent Transaction Card */}
        <div className="bg-green-100 p-4 rounded-2xl shadow-md text-center">
          <h3 className="text-lg font-semibold text-green-900">
            Recent Transaction
          </h3>
          <p className="text-md font-medium mt-2 text-green-800">
            {transactions.length > 0
              ? `${transactions[transactions.length - 1].Title} - ₹${
                  transactions[transactions.length - 1].amount
                }`
              : "N/A"}
          </p>
        </div>
      </div>
      <div className="w-full p-4">
        <h2 className="text-xl font-bold mb-4 text-center">Budget vs Actual</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="budget" fill="#82ca9d" name="Budget" />
            <Bar dataKey="spent" fill="#8884d8" name="Spent" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Card className="w-full max-w-3xl mx-auto mt-6 p-4 shadow-lg rounded-xl border">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4 text-center">
            Spending Insights 💡
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="font-semibold">Total Spent This Month:</p>
              <p>₹{insights.totalSpentThisMonth}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="font-semibold">Highest Spending Category:</p>
              <p>{insights.highestCategory}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="font-semibold">Lowest Spending Category:</p>
              <p>{insights.lowestCategory}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="font-semibold">Most Frequent Category:</p>
              <p>{insights.mostFrequentCategory}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Chart;
