import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: "📊" },
  { name: "Manage Students", path: "/admin/students", icon: "🎓" },
  { name: "Upload Tests", path: "/admin/tests", icon: "📝" },
  { name: "Upload Homework", path: "/admin/homework", icon: "📚" },
  { name: "Announcements", path: "/admin/announcements", icon: "📢" },

  // 🗑️ Recycle Bin
  { name: "Recycle Bin", path: "/admin/recycle-bin", icon: "🗑️" },
];

export default function AdminSidebar() {
  return (
    <aside className="h-screen w-72 bg-gradient-to-b from-indigo-700 to-indigo-900 text-white flex flex-col shadow-xl">

      {/* ===== Brand ===== */}
      <div className="px-6 py-6 text-2xl font-extrabold tracking-wide border-b border-white/20">
        Admin Panel
      </div>

      {/* ===== Navigation ===== */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
              ${
                isActive
                  ? "bg-white text-indigo-700 shadow-lg scale-[1.02]"
                  : "text-white/90 hover:bg-white/10 hover:translate-x-1"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-semibold">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* ===== Footer / Admin Info ===== */}
      <div className="px-6 py-4 border-t border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-semibold">Admin</p>
            <p className="text-xs text-white/70">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}