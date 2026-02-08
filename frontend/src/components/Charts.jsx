import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Charts({ data, expensePie }) {
  if (!data) return null;

  /* ================= BAR CHART ================= */
  const barData = {
    labels: data.labels,
    datasets: [
      {
        label: "Income",
        data: data.income,
        backgroundColor: "#2ecc71",
        borderRadius: 6,
      },
      {
        label: "Expenses",
        data: data.expense,
        backgroundColor: "#ff3b3b",
        borderRadius: 6,
      },
    ],
  };

  /* ================= PIE CHART ================= */
  const pieData =
    expensePie?.labels?.length > 0
      ? expensePie
      : {
          labels: ["No expenses"],
          datasets: [
            {
              data: [1],
              backgroundColor: ["#9ca3af"],
            },
          ],
        };

  return (
    <div className="charts">
      <div className="chart-card" style={{ height: 320 }}>
        <h4>Income vs Expenses</h4>
        <Bar
          data={barData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>

      <div className="chart-card" style={{ height: 320 }}>
        <h4>Expense Breakdown</h4>
        <Pie
          data={pieData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>
    </div>
  );
}
