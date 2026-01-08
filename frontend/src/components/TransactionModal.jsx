import { useEffect, useState } from "react";
import {
  createTransaction,
  updateTransaction,
  getCategories,
} from "../lib/api";

export default function TransactionModal({
  type,
  onClose,
  onSaved,
  initialData = null,
}) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  /* =========================
     PREFILL (EDIT MODE)
  ========================= */
  useEffect(() => {
    if (initialData) {
      setForm({
        description: initialData.description || "",
        amount: initialData.amount || "",
        category: initialData.category || "",
        date: initialData.date
          ? initialData.date.slice(0, 10)
          : new Date().toISOString().slice(0, 10),
      });
    }
  }, [initialData]);

  /* =========================
     LOAD CATEGORIES
  ========================= */
  useEffect(() => {
    getCategories(type)
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => setCategories([]));
  }, [type]);

  function change(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  /* =========================
     SUBMIT (CREATE / UPDATE)
  ========================= */
  async function submit(e) {
    e.preventDefault();
    setErr("");

    if (!form.amount) return setErr("Amount is required");
    if (!form.category) return setErr("Category is required");
    if (!form.date) return setErr("Date is required");

    setLoading(true);

    try {
      const payload = {
        description: form.description.trim(),
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
        type,
      };

      if (initialData?._id) {
        // ✅ UPDATE
        await updateTransaction(initialData._id, payload);
      } else {
        // ✅ CREATE
        await createTransaction(payload);
      }

      // 🔥 GLOBAL REFRESH (Budgets + Dashboard)
      window.dispatchEvent(new Event("transactions-updated"));

      onSaved && onSaved();
      onClose();
    } catch (e) {
      setErr(e?.message || "Failed to save transaction");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="card-title" style={{ textAlign: "center" }}>
          {initialData ? "Edit" : "Add"}{" "}
          {type === "income" ? "Income" : "Expense"}
        </h3>

        <form onSubmit={submit}>
          {/* DATE */}
          <label className="label">
            Date
            <input
              type="date"
              name="date"
              className="input"
              value={form.date}
              onChange={change}
            />
          </label>

          {/* DESCRIPTION */}
          <label className="label">
            Description
            <input
              name="description"
              className="input"
              placeholder="e.g. Salary, Rent, Freelance"
              value={form.description}
              onChange={change}
            />
          </label>

          {/* AMOUNT */}
          <label className="label">
            Amount
            <input
              name="amount"
              type="number"
              className="input"
              placeholder="Enter amount"
              value={form.amount}
              onChange={change}
            />
          </label>

          {/* CATEGORY */}
          <label className="label">
            Category
            <select
              name="category"
              className="input select-custom"
              value={form.category}
              onChange={change}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          {err && <div className="error">{err}</div>}

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button className="btn primary" disabled={loading}>
              {loading ? "Saving…" : "Save"}
            </button>

            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
