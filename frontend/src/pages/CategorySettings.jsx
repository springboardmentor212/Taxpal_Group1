import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../lib/api";

export default function CategorySettings() {
  const [type, setType] = useState("expense");
  const [name, setName] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    load();
  }, [type]);

  async function load() {
    const data = await getCategories(type);
    setRows(data);
  }

  async function add(e) {
    e.preventDefault();
    await createCategory({ name, type });
    setName("");
    load();
  }

  async function remove(id) {
    if (!window.confirm("Delete category?")) return;
    await deleteCategory(id);
    load();
  }

  return (
    <>
      <h2 className="card-title">Category Management</h2>

      {/* TYPE TOGGLE */}
      <div className="chart-toggle">
        {["expense", "income"].map(t => (
          <button
            key={t}
            className={type === t ? "active" : ""}
            onClick={() => setType(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ADD CATEGORY */}
      <form onSubmit={add} className="category-form">
        <input
          className="input"
          placeholder={`New ${type} category`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button className="btn primary">Add</button>
      </form>

      {/* LIST */}
      <div className="category-grid">
        {rows.map(c => (
          <div key={c._id} className="category-chip">
            <span
              className="dot"
              style={{ background: c.color }}
            />
            {c.name}
            <button onClick={() => remove(c._id)}>✕</button>
          </div>
        ))}
      </div>
    </>
  );
}
