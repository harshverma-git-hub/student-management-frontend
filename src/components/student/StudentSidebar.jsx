import { NavLink } from "react-router-dom";
import {
  User,
  Home,
  TrendingUp,
  FileText,
  BookOpen,
  Megaphone,
} from "lucide-react";

const menuItems = [
  {
    name: "Profile",
    path: "/student/profile",
    icon: <User size={20} />,
  },
  {
    name: "Dashboard",
    path: "/student",
    icon: <Home size={20} />,
  },
  {
    name: "Performance",
    path: "/student/performance",
    icon: <TrendingUp size={20} />,
  },
  {
    name: "Test Papers",
    path: "/student/tests",
    icon: <FileText size={20} />,
  },
  {
    name: "Homework",
    path: "/student/homework",
    icon: <BookOpen size={20} />,
  },
  {
    name: "Announcements",
    path: "/student/announcements",
    icon: <Megaphone size={20} />,
  },
];

export default function StudentSidebar() {
  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-blue-700 to-indigo-900 text-white flex flex-col shadow-xl">

      {/* ===== Brand ===== */}
      <div className="px-6 py-6 text-2xl font-extrabold tracking-wide border-b border-white/20">
        Student Panel
      </div>

      {/* ===== Navigation ===== */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/student"}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
              ${
                isActive
                  ? "bg-white text-blue-700 shadow-lg scale-[1.02]"
                  : "text-white/90 hover:bg-white/10 hover:translate-x-1"
              }`
            }
          >
            <span>{item.icon}</span>
            <span className="font-semibold">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* ===== Student Info ===== */}
      <div className="px-6 py-4 border-t border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
            S
          </div>
          <div>
            <p className="text-sm font-semibold">Student</p>
            <p className="text-xs text-white/70">Welcome back 👋</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
