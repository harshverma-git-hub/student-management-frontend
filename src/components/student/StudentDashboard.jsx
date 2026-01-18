import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import api from "../../services/api";

const PIE_COLORS = ["#22c55e", "#f97316", "#ef4444"];

export default function StudentDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DASHBOARD ================= */
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get("/dashboard/student");
      setDashboard(res.data);
    } catch (err) {
      console.error("Failed to load student dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboard) {
    return (
      <p className="p-6 text-gray-500">
        Loading student dashboard...
      </p>
    );
  }

  /* ================= DATA ================= */

  const homeworkPieData = [
    {
      name: "Submitted",
      value: dashboard.homework.submitted,
    },
    {
      name: "Pending",
      value: dashboard.homework.pending,
    },
    {
      name: "Late",
      value: dashboard.homework.late,
    },
  ];

  const weeklyActivity = [
    { day: "Mon", activity: dashboard.homework.submitted },
    { day: "Tue", activity: dashboard.homework.pending },
    { day: "Wed", activity: dashboard.homework.submitted },
    { day: "Thu", activity: dashboard.homework.late },
    { day: "Fri", activity: dashboard.homework.pending },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back 👋
        </h1>
        <p className="text-gray-500 text-sm">
          Here is your academic overview
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Pending Homework"
          value={dashboard.homework.pending}
          gradient="from-red-500 to-red-400"
        />
        <StatCard
          title="Submitted Homework"
          value={dashboard.homework.submitted}
          gradient="from-green-500 to-green-400"
        />
        <StatCard
          title="Late Homework"
          value={dashboard.homework.late}
          gradient="from-orange-500 to-orange-400"
        />
        <StatCard
          title="Announcements"
          value={dashboard.announcements}
          gradient="from-blue-500 to-blue-400"
        />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Homework Status */}
        <ChartCard title="Homework Status">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={homeworkPieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {homeworkPieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Weekly Activity */}
        <ChartCard title="Weekly Activity">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weeklyActivity}>
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="activity"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ================= ANNOUNCEMENT SUMMARY ================= */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-2">
          Announcements
        </h2>
        <p className="text-gray-600">
          You have{" "}
          <span className="font-semibold text-indigo-600">
            {dashboard.announcements}
          </span>{" "}
          announcements.
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Visit the Announcements section for full details.
        </p>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value, gradient }) {
  return (
    <div
      className={`rounded-xl p-5 text-white shadow bg-gradient-to-r ${gradient}`}
    >
      <p className="text-sm opacity-90">{title}</p>
      <h2 className="text-3xl font-bold mt-1">{value}</h2>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}