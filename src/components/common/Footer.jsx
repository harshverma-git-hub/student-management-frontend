import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-extrabold text-white mb-3">
            StudentPortal
          </h2>
          <p className="text-sm text-gray-400">
            A smart and secure student management system designed for
            home tuition and academic performance tracking.
          </p>
        </div>

        {/* Public Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Navigation
          </h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition">
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Features (Informational only) */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Features
          </h3>
          <ul className="space-y-2 text-gray-400">
            <li>📊 Performance Tracking</li>
            <li>📝 Test Papers (PDF)</li>
            <li>📚 Homework Management</li>
            <li>📢 Announcements</li>
          </ul>
        </div>

        {/* Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            About
          </h3>
          <p className="text-gray-400 text-sm mb-2">
            Built for students and tutors to simplify academic management.
          </p>
          <p className="text-gray-400 text-sm">
            Developed using MERN Stack
          </p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} Student Management Portal. All rights reserved.
      </div>
    </footer>
  );
}
