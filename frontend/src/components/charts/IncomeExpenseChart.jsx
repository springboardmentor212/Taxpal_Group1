import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", income: 420, expense: 200 },
  { month: "Feb", income: 380, expense: 180 },
  { month: "Mar", income: 500, expense: 220 },
  { month: "Apr", income: 450, expense: 190 },
];

export default function IncomeExpenseChart() {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="month" stroke="#9aa3b2" />
          <YAxis stroke="#9aa3b2" />
          <Tooltip
            contentStyle={{
              background: "#0f0f10",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
            }}
          />
          <Bar dataKey="income" fill="#ff3b3b" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expense" fill="#444" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

