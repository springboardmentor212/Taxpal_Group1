//src/pages/TaxCalculator.jsx
import { useState } from "react";
import { getTaxEstimate } from "../lib/api";
import TaxCalendar from "../components/TaxCalendar";
//import { taxSlabs } from "../utils/taxSlabs";
import "../styles/TaxCalculator.css";

function TaxCalculator() {
  const [country, setCountry] = useState("");
  const [quarter, setQuarter] = useState("");
  const [income, setIncome] = useState(""); 
  const [deductions, setDeductions] = useState({
    business: "",
    retirement: "",
    health: "",
    homeOffice: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const calculate = async () => {
    //try {
      setLoading(true);
      setError("");
      setResult(null);

      /*const res = await fetch("http://localhost:5000/api/tax/estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("taxpal_token")}`,
        },
        body: JSON.stringify({
          income: Number(income),
          quarter,
        }),
      });

      const data = await res.json();*/

      /*const res = await fetch(
        `http://localhost:5000/api/tax/estimate?quarter=${quarter}&income=${income}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("taxpal_token")}`,
          },
        }
      );*/

      /*const res = await fetch(
        `http://localhost:5000/api/tax/estimate?quarter=${quarter}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("taxpal_token")}`,
          },
        }
      );*/

      if (!country || !quarter || !income)
      {
        setError("Please select country, quarter and enter annual income");
        setLoading(false);
        return;
      }

      try {
        const payload = {
          country, 
          quarter,
          income: Number(income),
          deductions: {
            business: Number(deductions.business || 0),
            retirement: Number(deductions.retirement || 0),
            health: Number(deductions.health || 0),
            homeOffice: Number(deductions.homeOffice || 0)
          }
        };
        const data = await getTaxEstimate(payload);
        setResult(data);
      }
      catch (err) {
        console.error(err);
        setError("Tax calculation failed. Please try again.");
      }
      finally{
      setLoading(false);
    }

      /*if (!res.ok) {
        throw new Error("Failed to calculate tax");
      }
      const data = await res.json();
      setResult(data);
    }
    catch (err){
      setError(err.message);
    }
    finally{
      setLoading(false);
    }*/
    //const res = await getTaxEstimate(quarter);
    //setResult(res);
  };

  return (
    <div className="tax-page">
      <h2 className="page-title">Tax Calculator</h2>
      <h4 className ="page-subtitle">Estimate your quarterly taxes according to the new regime</h4>

      <div className="tax-grid">
        {/* LEFT: FORM CARD */}
        <div className="tax-card form-card">
          <h3 className="card-title">Quarterly Tax Calculator</h3>

          <div className="form-grid">
            <div className="form-field">
              <label>Country</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
              </select>
            </div>

            <div className="form-field">
              <label>Quarter</label>
              <select value={quarter} onChange={(e) => setQuarter(e.target.value)}>
                <option value="">Select Quarter</option>
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </select>
            </div>

            <div className="form-section-label">Income</div>

            <div className="form-field full-width">
              <label>Gross Income</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
              />
            </div>

            <div className="form-section-label">Deductions</div>
            
            <div className="form-field">
              <label>Business Expenses</label>
              <input
                type="number"
                onChange={(e) =>
                  setDeductions({ ...deductions, business: e.target.value })
                }
              />
            </div>

            <div className="form-field">
              <label>Retirement Contributions</label>
              <input
                type="number"
                onChange={(e) =>
                  setDeductions({ ...deductions, retirement: e.target.value })
                }
              />
            </div>

            <div className="form-field">
              <label>Health Insurance</label>
              <input
                type="number"
                onChange={(e) =>
                  setDeductions({ ...deductions, health: e.target.value })
                }
              />
            </div>

            <div className="form-field">
              <label>Home Office Deductions</label>
              <input
                type="number"
                onChange={(e) =>
                  setDeductions({ ...deductions, homeOffice: e.target.value })
                }
              />
            </div>
          </div>

          <button className="calculate-btn" onClick={calculate} disabled={loading}>
            {loading ? "Calculating..." : "Calculate Tax"}
          </button>

          {error && <p className="error-text">{error}</p>}
        </div>

        {/* RIGHT: SUMMARY CARD */}
        <div className="tax-card summary-card">
          <h3 className="card-title">Tax Summary</h3>

          {!result && (
            <p className="placeholder-text">
              Enter your income and deductions details to calculate your estimated quarterly tax.
            </p>
          )}

          {result && (
            <>
              <p>
                <strong>Taxable Income:</strong> {result.taxableIncome}
              </p>
              <p>
                <strong>Estimated Quarterly Tax:</strong> {result.estimatedTax}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="calendar-section">
        <TaxCalendar />
      </div>
    </div>
  );
}

export default TaxCalculator;