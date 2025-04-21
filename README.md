# 💰 Personal Finance Visualizer

A full-stack web application to track, visualize, and manage personal finances. Users can add, edit, and delete transactions, set monthly budgets, and view insights through interactive charts.

---

## 🚀 Features

- Add, edit, and delete income/expense transactions
- Monthly expense bar chart
- Set category-wise budgets
- Budget vs actual comparison
- Spending insights
- Clean and responsive UI using shadcn/ui and Recharts

---

## 🛠️ Tech Stack

### Frontend
- Next.js
- React
- shadcn/ui
- Recharts

### Backend
- Node.js
- Express
- MongoDB Atlas (MongoDB native driver)

---
## 🧑‍💻 Getting Started
git clone https://github.com/your-username/personal-finance-visualizer.git
cd personal-finance-visualizer

## Set Up the Backend
cd backend
npm install

## Create a .env file in the backend/ folder and add your MongoDB connection string:
MONGO_URI=your_mongodb_connection_string

## Start the backend server:
node server.js

## Set Up the Frontend
cd ../frontend
npm install
npm run dev
