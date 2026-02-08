// src/pages/Transactions.jsx
import { useEffect, useState } from "react";
import { getTransactions, deleteTransaction } from "../lib/api";

import TransactionModal from "../components/TransactionModal";
import "../styles/dashboard.css";
import "../styles/transactions.css"; // ✅ REQUIRED

export default function Transactions() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD TRANSACTIONS
  ========================= */
  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    setLoading(true);
    try {
      const data = await getTransactions();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load transactions:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     DELETE
  ========================= */
  async function handleDelete(id) {
    if (!window.confirm("Delete this transaction?")) return;

    try {
      await deleteTransaction(id);
      loadTransactions();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <>
      <h2 style={{ marginBottom: 24 }}>Transactions</h2>

      {loading ? (
        <p className="muted">Loading transactions…</p>
      ) : (
        <div className="table-card">
          {/* 🔥 IMPORTANT: tx-table (NOT transactions-table) */}
          <table className="tx-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th className="amount">Amount</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((tx) => (
                <tr key={tx._id}>
                  <td>
                    {tx.date
                      ? new Date(tx.date).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>{tx.description || "-"}</td>

                  <td>{tx.category || "-"}</td>

                  {/* ✅ GREEN / RED AMOUNT */}
                  <td className={`amount ${tx.type}`}>
                    ₹{tx.amount}
                  </td>

                  {/* ✅ TYPE TEXT */}
                  <td>
                    <span className={`pill ${tx.type}`}>
                      {tx.type}
                    </span>
                  </td>

                  {/* ✅ ACTION BUTTONS */}
                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => setEditing(tx)}
                      title="Edit"
                    >
                      ✏️
                    </button>

                    <button
                      className="icon-btn danger"
                      onClick={() => handleDelete(tx._id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length === 0 && (
            <p className="muted" style={{ marginTop: 14 }}>
              No transactions yet
            </p>
          )}
        </div>
      )}

      {editing && (
        <TransactionModal
          type={editing.type}
          initialData={editing}
          onClose={() => setEditing(null)}
          onSaved={loadTransactions}
        />
      )}
    </>
  );
}
