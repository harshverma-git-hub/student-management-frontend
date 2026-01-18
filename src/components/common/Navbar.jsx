import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar({ onLoginClick }) {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogin = () => {
    if (onLoginClick) onLoginClick();
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-blue-600 tracking-wide"
        >
          StudentPortal
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
          >
            Home
          </Link>

          {/* THEME TOGGLE */}
          <button
            type="button"
            onClick={toggleTheme}
            className="text-xl px-3 py-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* LOGIN BUTTON */}
          <button
            type="button"
            onClick={handleLogin}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 transition shadow"
          >
            Login
          </button>
        </div>

        {/* HAMBURGER */}
        <button
          type="button"
          className="md:hidden text-gray-700 dark:text-gray-200 focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          <div className="space-y-1.5">
            <span
              className={`block w-6 h-0.5 bg-current transition ${
                open ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-current transition ${
                open ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-current transition ${
                open ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </div>
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-4 flex flex-col gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg">

          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="text-gray-700 dark:text-gray-200 hover:text-blue-600"
          >
            Home
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            className="text-left text-gray-700 dark:text-gray-200"
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>

          <button
            type="button"
            onClick={handleLogin}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}