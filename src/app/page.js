"use client";
import AddTransactionForm from "@/components/AddTransactionForm";
import TransactionsList from "@/components/TransactionList";
import Chart from "@/components/Chart";
import "./App.css";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <BrowserRouter>
      <ToastContainer />
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="brand">
            CoinCove
          </Link>
          <div className="desktopMenu">
            {/* <Link to="/">Transactions</Link> */}
            <Link to="/chart">Analytics</Link>
            {/*<Link to="/profile">Profile</Link>*/}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobileButton"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobileMenu">
            {/* <Link to="/">Transactions</Link>*/}
            <Link to="/chart">Analytics</Link>
            {/*<Link to="/profile">Profile</Link>*/}
          </div>
        )}
      </nav>

      <Routes>
        {/* Homepage - Default Transaction Form + List */}
        <Route
          path="/"
          element={
            <>
              <section className="hero">
                <div className="container">
                  <div className="content">
                    <h1 className="heading">WELCOME TO COINCOVE</h1>
                    <p className="description">
                      Take control of your finances with{" "}
                      <strong>CoinCove</strong>, a simple yet powerful tool to
                      track your spending, visualize expenses, and manage
                      budgets effortlessly.
                    </p>
                    <div className="features">
                      <h3>Key Features:</h3>
                      <ul>
                        <li>
                          📊 <strong>Track Transactions:</strong> Add, edit, and
                          delete expenses with ease.
                        </li>
                        <li>
                          📅 <strong>Monthly Insights:</strong> Visualize
                          spending with interactive charts.
                        </li>
                        <li>
                          🗂️ <strong>Smart Categories:</strong> Automatically
                          group expenses for better analysis.
                        </li>
                        <li>
                          💰 <strong>Budgeting Tools:</strong> Set limits and
                          avoid overspending.
                        </li>
                      </ul>
                    </div>
                    <a className="ctaButton" href="#test">
                      Get Started
                    </a>
                  </div>

                  <div className="imageContainer">
                    <img
                      src="https://th.bing.com/th/id/R.3348c8af537fc9309c7fb12ccda66acb?rik=16BbW%2bEoyUmLSA&riu=http%3a%2f%2fwww.clipartbest.com%2fcliparts%2fdi6%2feAo%2fdi6eAo5kT.png&ehk=SRPkwqBDU8YszbYdZyKqMBHONgiKk88luenf09v3BTE%3d&risl=&pid=ImgRaw&r=0"
                      alt="CoinCove Finance Illustration"
                      width={500}
                      height={500}
                      className="image"
                    />
                  </div>
                </div>
              </section>
              <main className="p-4">
                <center>
                  <h1 className="text-2xl font-semibold mb-4" id="test">
                    💸 Add New Transaction
                  </h1>
                </center>
                <AddTransactionForm />
                <TransactionsList />
              </main>
            </>
          }
        />

        {/* Chart Page Route */}
        <Route path="/chart" element={<Chart />} />
      </Routes>
    </BrowserRouter>
  );
}
