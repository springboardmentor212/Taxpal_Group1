import React, { useState } from "react";
import {
  getSummary,
  downloadPDF,
  downloadCSV
} from "../lib/reports";


export default function Reports() {
  const [reportType, setReportType] = useState("Income Statement");
  const [period, setPeriod] = useState("this_month");
  const [format, setFormat] = useState("PDF");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentReports, setRecentReports] = useState([]);

  /* -------------------------
     Period → Date mapping
  ------------------------- */
  function getDateParams() {
    const now = new Date();
    let from = null;

    if (period === "This_month") {
      from = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === "last_3") {
      from = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    } else if (period === "last_6") {
      from = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    }

    return {
      ...(from ? { from: from.toISOString().split("T")[0] } : {}),
      type: reportType
    };
  }

  /* -------------------------
     Generate Preview
  ------------------------- */
  async function handleGenerate() {
    setLoading(true);
    try {
      const data = await getSummary(getDateParams());
      setPreview(data);

      setRecentReports(prev => [
        {
          id: Date.now(),
          type: reportType,
          period,
          date: new Date().toLocaleDateString()
        },
        ...prev.slice(0, 4)
      ]);
    } catch {
      alert("Failed to generate report");
    } finally {
      setLoading(false);
    }
  }

  /* -------------------------
     Downloads
  ------------------------- */
  async function handleDownload() {
    const blob =
      format === "CSV"
        ? await downloadCSV(getDateParams())
        : await downloadPDF(getDateParams());

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `taxpal-${reportType.replace(" ", "_")}.${format.toLowerCase()}`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /* -------------------------
     Chart helper
  ------------------------- */
  const maxVal = preview
    ? Math.max(preview.income || 0, preview.expense || 0, preview.tax || 0)
    : 1;

  return (
    <div className="page">
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* HEADER */}
        <h2>Reports</h2>
        <p className="muted">Generate financial summaries and download reports</p>

        {/* GENERATOR */}
        <div className="card">
          <h3>Generate Report</h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            <div>
              <label className="label">Report Type</label>
              <select value={reportType} onChange={e => setReportType(e.target.value)}>
                <option>Income Statement</option>
                <option>Expense Summary</option>
                <option>Tax Summary</option>
              </select>
            </div>

            <div>
              <label className="label">Period</label>
              <select value={period} onChange={e => setPeriod(e.target.value)}>
                <option value="this_month">This Month</option>
                <option value="last_3">Last 3 Months</option>
                <option value="last_6">Last 6 Months</option>
              </select>
            </div>

            <div>
              <label className="label">Export Format</label>
              <select value={format} onChange={e => setFormat(e.target.value)}>
                <option>PDF</option>
                <option>CSV</option>
              </select>
            </div>
          </div>

          <div style={{ textAlign: "right", marginTop: 20 }}>
            <button className="btn primary" onClick={handleGenerate} disabled={loading}>
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="card" style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>Report Preview</h3>
            <button className="btn primary" disabled={!preview} onClick={handleDownload}>
              Download
            </button>
          </div>

          <div
            style={{
              marginTop: 16,
              height: 260,
              border: "1px dashed rgba(255,255,255,0.15)",
              borderRadius: 12,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            {!preview ? (
              <div
                className="muted"
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center"
                }}
              >
                Report preview will appear here
              </div>
            ) : (
              <>
                {/* TEXT DETAILS */}
                <div>
                  <p><b>Report:</b> {reportType}</p>
                  <p><b>Period:</b> {period.replace("_", " ")}</p>

                  {"income" in preview && <p>Income: ₹{preview.income}</p>}
                  {"expense" in preview && <p>Expense: ₹{preview.expense}</p>}
                  {"tax" in preview && <p>Estimated Tax: ₹{preview.tax}</p>}
                  {"balance" in preview && <p>Balance: ₹{preview.balance}</p>}
                </div>

                {/* MINI CHART */}
                <div>
                  {["income", "expense", "tax"].map(
                    k =>
                      preview[k] != null && (
                        <div key={k} style={{ marginBottom: 6 }}>
                          <small>{k.toUpperCase()}</small>
                          <div
                            style={{
                              height: 6,
                              width: `${(preview[k] / maxVal) * 100}%`,
                              background: "linear-gradient(90deg,#ff3b3b,#b30000)",
                              borderRadius: 6
                            }}
                          />
                        </div>
                      )
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* RECENT REPORTS */}
        <div className="card" style={{ marginTop: 24 }}>
          <h3>Recent Reports</h3>

          {recentReports.length === 0 ? (
            <p className="muted">No reports generated yet</p>
          ) : (
            <ul style={{ marginTop: 12 }}>
              {recentReports.map(r => (
                <li key={r.id} style={{ marginBottom: 8 }}>
                  <b>{r.type}</b> · {r.period.replace("_", " ")} · {r.date}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}
