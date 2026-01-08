import { useEffect, useState } from "react";
import { getDashboard } from "../lib/api";

import StatCard from "../components/StatCard";
import Charts from "../components/Charts";
import TransactionModal from "../components/TransactionModal";

export default function Dashboard() {
  const [range, setRange] = useState("month");
  const [dashboard, setDashboard] = useState(null);
  const [modal, setModal] = useState(null);

  /* ================= FETCH DASHBOARD DATA ================= */
  function loadDashboard() {
    getDashboard(range).then(setDashboard);
  }

  useEffect(loadDashboard, [range]);

  /* ================= AUTO REFRESH ON TRANSACTION CHANGE ================= */
  useEffect(() => {
    window.addEventListener("transactions-updated", loadDashboard);
    return () =>
      window.removeEventListener("transactions-updated", loadDashboard);
  }, [range]);

  /* ================= LOADING STATE ================= */
  if (!dashboard) return <p className="muted">Loading…</p>;

  return (
    <>
      {/* ================= STATS ================= */}
      <div className="stats">
        <StatCard title="Income" value={`₹${dashboard.income}`} />
        <StatCard title="Expense" value={`₹${dashboard.expense}`} />
        <StatCard
          title="Savings Rate"
          value={`${dashboard.savingsRate}%`}
        />
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div className="actions">
        <button
          className="btn primary"
          onClick={() => setModal("income")}
        >
          + Record Income
        </button>

        <button
          className="btn primary"
          onClick={() => setModal("expense")}
        >
          + Record Expense
        </button>
      </div>

      {/* ================= RANGE TOGGLE ================= */}
      <div className="chart-toggle">
        {["month", "quarter", "year"].map((r) => (
          <button
            key={r}
            className={range === r ? "active" : ""}
            onClick={() => setRange(r)}
          >
            {r.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ================= CHARTS ================= */}
      <Charts
        data={dashboard.chart}
        expensePie={dashboard.expensePie}
      />

      {/* ================= TRANSACTION MODAL ================= */}
      {modal && (
        <TransactionModal
          type={modal}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            loadDashboard();
          }}
        />
      )}
    </>
  );
}
