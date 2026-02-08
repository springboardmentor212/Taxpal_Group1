import { useState } from "react";
import { updateTransaction } from "../lib/api";

export default function EditTransactionModal({ tx, onClose, onSaved }) {
  const [form, setForm] = useState({
    description: tx.description,
    amount: tx.amount,
    category: tx.category,
    date: tx.date.slice(0, 10),
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await updateTransaction(tx._id, {
        ...form,
        amount: Number(form.amount),
      });
      onSaved();
      onClose();
    } catch (e) {
      setErr(e.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="card" style={{ maxWidth: 420 }}>
        <h3 className="card-title">Edit Transaction</h3>

        <form onSubmit={submit}>
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

          <label className="label">
            Description
            <input
              name="description"
              className="input"
              value={form.description}
              onChange={change}
            />
          </label>

          <label className="label">
            Amount
            <input
              type="number"
              name="amount"
              className="input"
              value={form.amount}
              onChange={change}
            />
          </label>

          <label className="label">
            Category
            <input
              name="category"
              className="input"
              value={form.category}
              onChange={change}
            />
          </label>

          {err && <div className="error">{err}</div>}

          <button className="btn primary" disabled={loading}>
            {loading ? "Saving…" : "Save Changes"}
          </button>

          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
