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
const Chart = () => {
  const [transactions, setTransactions] = useState([]);

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

  const monthlyExpenses = getMonthlyExpenses(transactions);

  return (
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
  );
};

export default Chart;
