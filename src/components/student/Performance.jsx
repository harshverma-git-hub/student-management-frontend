import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp, AlertTriangle, Award } from "lucide-react";

/* ====== SAMPLE DATA (Replace later with API) ====== */
const performanceData = [
  { topic: "Java Basics", score: 75 },
  { topic: "OOP", score: 82 },
  { topic: "Exceptions", score: 68 },
  { topic: "Collections", score: 88 },
];

/* ====== DERIVED METRICS (REALISTIC) ====== */
const avgScore =
  Math.round(
    performanceData.reduce((a, b) => a + b.score, 0) /
      performanceData.length
  );

const strongest = performanceData.reduce((a, b) =>
  a.score > b.score ? a : b
);

const weakest = performanceData.reduce((a, b) =>
  a.score < b.score ? a : b
);

export default function Performance() {
  return (
    <div className="p-6 space-y-10">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Performance Analytics
        </h1>
        <p className="text-gray-500 text-sm">
          Subject-wise academic performance overview
        </p>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Average Score"
          value={`${avgScore}%`}
          icon={<TrendingUp />}
          color="indigo"
        />
        <MetricCard
          title="Strongest Area"
          value={strongest.topic}
          sub={`${strongest.score}%`}
          icon={<Award />}
          color="green"
        />
        <MetricCard
          title="Needs Improvement"
          value={weakest.topic}
          sub={`${weakest.score}%`}
          icon={<AlertTriangle />}
          color="red"
        />
        <MetricCard
          title="Topics Covered"
          value={performanceData.length}
          color="blue"
        />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <Card title="Skill Distribution">
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={performanceData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="topic" />
              <Radar
                dataKey="score"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Chart */}
        <Card title="Topic-wise Scores">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar
                dataKey="score"
                fill="#22c55e"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ================= AI-LIKE INSIGHTS ================= */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Performance Insights
        </h2>

        <ul className="space-y-2 text-gray-700">
          <li>
            ✅ You are performing best in{" "}
            <b>{strongest.topic}</b> with a score of{" "}
            <b>{strongest.score}%</b>.
          </li>
          <li>
            ⚠️ Focus more on <b>{weakest.topic}</b> to
            improve consistency.
          </li>
          <li>
            📈 Your average score of{" "}
            <b>{avgScore}%</b> indicates steady progress.
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h3 className="text-lg font-semibold mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function MetricCard({
  title,
  value,
  sub,
  icon,
  color = "indigo",
}) {
  const colors = {
    indigo: "text-indigo-600",
    green: "text-green-600",
    red: "text-red-500",
    blue: "text-blue-600",
  };

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">
          {title}
        </p>
        {icon && (
          <span className={colors[color]}>
            {icon}
          </span>
        )}
      </div>

      <h2
        className={`text-2xl font-bold mt-2 ${colors[color]}`}
      >
        {value}
      </h2>

      {sub && (
        <p className="text-sm text-gray-500 mt-1">
          {sub}
        </p>
      )}
    </div>
  );
}