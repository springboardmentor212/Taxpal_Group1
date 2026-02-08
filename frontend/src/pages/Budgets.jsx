import { useEffect, useState } from "react";
import {
  createBudget,
  getBudgets,
  getCategories,
  updateBudget,
  deleteBudget,
} from "../lib/api";
import "../styles/budgets.css";

export default function Budgets() {
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    category: "",
    amount: "",
    month: new Date().toISOString().slice(0, 7), // YYYY-MM
  });

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    loadBudgets();

    getCategories("expense")
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => setCategories([]));

    function refreshBudgets() {
      loadBudgets();
    }

    window.addEventListener("transactions-updated", refreshBudgets);
    return () =>
      window.removeEventListener("transactions-updated", refreshBudgets);
  }, []);

  async function loadBudgets() {
    setLoading(true);
    try {
      const data = await getBudgets();
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  /* =========================
     CREATE / UPDATE
  ========================= */
  async function submit(e) {
    e.preventDefault();
    if (!form.category || !form.amount || !form.month) return;

    try {
      const payload = {
        category: form.category,
        amount: Number(form.amount),
        month: form.month, // ✅ CORRECT FORMAT
      };

      if (editId) {
        await updateBudget(editId, payload);
      } else {
        await createBudget(payload);
      }

      resetForm();
      loadBudgets();
    } catch (err) {
      console.error("Budget submit failed:", err);
      alert("Failed to save budget");
    }
  }

  function resetForm() {
    setForm({
      category: "",
      amount: "",
      month: new Date().toISOString().slice(0, 7),
    });
    setEditId(null);
  }

  /* =========================
     EDIT
  ========================= */
  function startEdit(b) {
    setEditId(b._id);
    setForm({
      category: b.category,
      amount: b.amount,
      month: b.month, // ✅ DIRECT USE
    });
  }

  /* =========================
     DELETE
  ========================= */
  async function remove(id) {
    if (!window.confirm("Delete this budget?")) return;
    try {
      await deleteBudget(id);
      loadBudgets();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete budget");
    }
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <>
      <h2 style={{ marginBottom: 20 }}>Budgets</h2>

      {/* FORM */}
      <form onSubmit={submit} className="budget-form">
        <select
          name="category"
          className="input select-custom"
          value={form.category}
          onChange={change}
          required
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          name="amount"
          type="number"
          className="input"
          placeholder="Budget amount"
          value={form.amount}
          onChange={change}
          required
        />

        <input
          name="month"
          type="month"
          className="input"
          value={form.month}
          onChange={change}
          required
        />

        <button className="btn primary" type="submit">
          {editId ? "Update Budget" : "Add Budget"}
        </button>
      </form>

      {/* TABLE */}
      {loading ? (
        <p className="muted">Loading budgets…</p>
      ) : (
        <div className="table-card">
          <table className="budget-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Budget</th>
                <th>Spent</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((b) => (
                <tr key={b._id} className={b.status}>
                  <td>{b.category}</td>
                  <td>₹{b.amount}</td>
                  <td>₹{b.spent}</td>
                  <td>₹{b.remaining}</td>
                  <td>
                    <span className={`status ${b.status}`}>
                      {b.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn small"
                      onClick={() => startEdit(b)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn small danger"
                      onClick={() => remove(b._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length === 0 && (
            <p className="muted" style={{ marginTop: 12 }}>
              No budgets created yet
            </p>
          )}
        </div>
      )}
    </>
  );
}
