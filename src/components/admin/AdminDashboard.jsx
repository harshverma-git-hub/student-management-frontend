import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Users,
  ClipboardList,
  AlertTriangle,
  Megaphone,
} from "lucide-react";
import api from "../../services/api";

const COLORS = ["#6366f1", "#ef4444"];

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get("/dashboard/admin");
      setDashboard(res.data);
    } catch (err) {
      console.error("Failed to load dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboard) {
    return (
      <p className="p-6 text-gray-500">
        Loading dashboard...
      </p>
    );
  }

  /* ================= REAL DATA ================= */

  const studentStatusData = [
    { name: "Active", value: dashboard.students.active },
    { name: "Inactive", value: dashboard.students.inactive },
  ];

  const activityData = [
    { name: "Homework", value: dashboard.homework.total },
    { name: "Announcements", value: dashboard.announcements },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-500">
          Real-time academic overview
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Metric
          icon={<Users />}
          title="Total Students"
          value={dashboard.students.total}
          color="from-indigo-500 to-indigo-700"
        />
        <Metric
          icon={<ClipboardList />}
          title="Homework Assigned"
          value={dashboard.homework.total}
          color="from-green-500 to-green-700"
        />
        <Metric
          icon={<AlertTriangle />}
          title="Pending Homework"
          value={dashboard.homework.pending}
          color="from-red-500 to-red-700"
        />
        <Metric
          icon={<Megaphone />}
          title="Announcements"
          value={dashboard.announcements}
          color="from-blue-500 to-blue-700"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* STUDENT STATUS */}
        <Card title="Student Status">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={studentStatusData}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {studentStatusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex justify-center gap-6 text-sm mt-4">
            <Legend color="bg-indigo-600" label="Active" />
            <Legend color="bg-red-500" label="Inactive" />
          </div>
        </Card>

        {/* PLATFORM ACTIVITY */}
        <Card title="Platform Activity">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={activityData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                fill="#6366f1"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* INSIGHTS */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Quick Insights
        </h2>

        <ul className="space-y-2 text-gray-700">
          <li>
            ✅ {dashboard.homework.submitted} homework submissions
          </li>
          <li>
            👥 {dashboard.students.active} students currently active
          </li>
          {dashboard.homework.late > 0 && (
            <li className="text-red-500">
              ⚠️ {dashboard.homework.late} late homework submissions
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

/* ================= UI HELPERS ================= */

function Metric({ icon, title, value, color }) {
  return (
    <div
      className={`rounded-xl shadow p-5 text-white bg-gradient-to-br ${color}`}
    >
      <div className="flex items-center gap-3 mb-2 opacity-90">
        {icon}
        <span className="text-sm">{title}</span>
      </div>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h3 className="font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}