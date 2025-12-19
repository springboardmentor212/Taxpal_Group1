import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Food", value: 40 },
  { name: "Rent", value: 30 },
  { name: "Utilities", value: 20 },
  { name: "Other", value: 10 },
];

const COLORS = ["#ff3b3b", "#b30000", "#555", "#222"];

export default function ExpensePie() {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#0f0f10",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

