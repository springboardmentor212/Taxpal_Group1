import { useState } from "react";
import DashboardLayout from "../components/layout/dashboardlayout";
import IncomeExpenseChart from "../components/charts/IncomeExpenseChart";
import ExpensePie from "../components/charts/ExpensePie";

export default function Dashboard() {
  const [timePeriod, setTimePeriod] = useState('Month');

  // Mock data for recent transactions
  const recentTransactions = [
    {
      date: 'May 8, 2025',
      description: 'Design Project',
      category: 'Consulting',
      amount: '+₹120.00',
      type: 'income'
    },
    {
      date: 'May 7, 2025',
      description: 'Office Supplies',
      category: 'Business Expenses',
      amount: '-₹45.50',
      type: 'expense'
    },
    {
      date: 'May 6, 2025',
      description: 'Web Development',
      category: 'Consulting',
      amount: '+₹250.00',
      type: 'income'
    },
    {
      date: 'May 5, 2025',
      description: 'Internet Bill',
      category: 'Utilities',
      amount: '-₹60.00',
      type: 'expense'
    },
    {
      date: 'May 4, 2025',
      description: 'Grocery Shopping',
      category: 'Food',
      amount: '-₹85.00',
      type: 'expense'
    }
  ];

  // Expense breakdown legend data (matching ExpensePie colors)
  const expenseCategories = [
    { name: "Food", percentage: 40, color: "#ff3b3b" },
    { name: "Rent", percentage: 30, color: "#b30000" },
    { name: "Utilities", percentage: 20, color: "#555" },
    { name: "Other", percentage: 10, color: "#222" }
  ];

  return (
    <DashboardLayout>
      <div className="dashboard">
        <h2 className="dashboard-title">Dashboard</h2>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Monthly Income</div>
            <div className="stat-value">₹420.00</div>
            <div className="stat-change up">↑ 12% from last month</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Monthly Expense</div>
            <div className="stat-value">₹0.00</div>
            <div className="stat-change down">↓ 5% from last month</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Estimated Tax Due</div>
            <div className="stat-value">₹0.00</div>
            <div className="stat-label">No upcoming taxes</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Savings Rate</div>
            <div className="stat-value">100%</div>
            <div className="stat-change up">↑ 10% from your goal</div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          {/* Income vs Expenses Chart */}
          <div className="chart-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexShrink: 0 }}>
              <div className="chart-title">Income vs Expenses</div>
              
              {/* Time Period Filters */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {['Year', 'Quarter', 'Month'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimePeriod(period)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 140ms ease',
                      background: timePeriod === period 
                        ? 'linear-gradient(180deg, rgba(255,59,59,0.2), rgba(179,0,0,0.3))' 
                        : 'rgba(255,255,255,0.03)',
                      color: timePeriod === period ? '#ff3b3b' : '#9aa3b2',
                      border: timePeriod === period ? '1px solid rgba(255,59,59,0.3)' : '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <IncomeExpenseChart />
            </div>
          </div>

          {/* Right Column: Expense Breakdown + Transactions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>
            {/* Expense Breakdown Pie Chart */}
            <div className="chart-card" style={{ flex: '0 0 auto', maxHeight: '48%' }}>
              <div className="chart-title">Expense Breakdown</div>
              <div style={{ height: '140px' }}>
                <ExpensePie />
              </div>
              
              {/* Legend */}
              <div style={{ marginTop: '10px', fontSize: '11px' }}>
                {expenseCategories.map((category, index) => (
                  <div 
                    key={index}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '6px',
                      padding: '2px 0'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div 
                        style={{ 
                          width: '10px', 
                          height: '10px', 
                          borderRadius: '2px',
                          background: category.color 
                        }}
                      ></div>
                      <span style={{ color: '#e6eef6' }}>
                        {category.name}
                      </span>
                    </div>
                    <span style={{ fontWeight: '600', color: '#e6eef6' }}>
                      {category.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="chart-card" style={{ flex: 1, minHeight: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexShrink: 0 }}>
                <div className="chart-title">Recent Transactions</div>
                <button 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ff3b3b',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    transition: 'background 140ms ease'
                  }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(255,59,59,0.1)'}
                  onMouseOut={(e) => e.target.style.background = 'none'}
                >
                  View All
                </button>
              </div>

              {/* Transactions Table */}
              <div className="transactions-container">
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                      <th style={{ textAlign: 'right' }}>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction, index) => (
                      <tr key={index}>
                        <td style={{ color: '#9aa3b2' }}>
                          {transaction.date}
                        </td>
                        <td style={{ color: '#e6eef6', fontWeight: '500' }}>
                          {transaction.description}
                        </td>
                        <td style={{ color: '#9aa3b2' }}>
                          {transaction.category}
                        </td>
                        <td style={{ 
                          fontWeight: '600',
                          textAlign: 'right',
                          color: transaction.type === 'income' ? '#3ddc84' : '#ff3b3b'
                        }}>
                          {transaction.amount}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '600',
                            background: transaction.type === 'income' 
                              ? 'rgba(61,220,132,0.1)' 
                              : 'rgba(255,59,59,0.1)',
                            color: transaction.type === 'income' ? '#3ddc84' : '#ff3b3b',
                            border: transaction.type === 'income'
                              ? '1px solid rgba(61,220,132,0.2)'
                              : '1px solid rgba(255,59,59,0.2)'
                          }}>
                            {transaction.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}







































/*import DashboardLayout from "../components/layout/dashboardlayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Dashboard
        </h2>

        <div className="bg-[#161616] border border-gray-800 rounded-lg p-5">
          <p className="text-gray-400">
            This is a placeholder for your TaxPal dashboard.
            Replace this with summary cards, graphs, and tables.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}*/















/*import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();
  function logout() {
    localStorage.removeItem("taxpal_token");
    localStorage.removeItem("taxpal_user");
    nav("/login");
  }
  const session = JSON.parse(localStorage.getItem("taxpal_user") || "null");

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#070708 0%,#151313 100%)", padding: 24 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/logo.png" alt="logo" style={{ width: 48, height: 48 }} />
            <div>
              <h1 style={{ margin: 0, fontSize: 20, color: "#fff" }}><span style={{ color: "#ff3b3b" }}>Tax</span>Pal</h1>
              <div style={{ color: "#9aa3b2", fontSize: 13 }}>Welcome {session?.username ?? "User"}</div>
            </div>
          </div>
          <div>
            <button onClick={logout} style={{ padding: "8px 12px", borderRadius: 8, background: "#222", color: "#fff", border: "1px solid rgba(255,255,255,0.04)" }}>Logout</button>
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h2 style={{ marginTop: 0 }}>Dashboard (placeholder)</h2>
          <p style={{ color: "#9aa3b2" }}>This is a placeholder for your TaxPal dashboard. Replace with graphs and tables.</p>
        </div>
      </div>
    </div>
  );
}
  */
