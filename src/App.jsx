import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/auth/Login";

import StudentLayout from "./layouts/StudentLayout";
import AdminLayout from "./layouts/AdminLayout";

import StudentDashboard from "./components/student/StudentDashboard";
import Performance from "./components/student/Performance";
import TestPapers from "./components/student/TestPapers";
import Homework from "./components/student/Homework";
import Announcements from "./components/student/Announcements";
import Profile from "./components/student/Profile"; // ✅ REQUIRED

import AdminDashboard from "./components/admin/AdminDashboard";
import ManageStudents from "./components/admin/ManageStudents";
import UploadTests from "./components/admin/UploadTests";
import UploadHomework from "./components/admin/UploadHomework";
import AdminAnnouncements from "./components/admin/AdminAnnouncements";
import RecycleBin from "./components/admin/RecycleBin";

import NotFound from "./pages/NotFound";

// 🔐 Guards
const AdminRoute = ({ children }) =>
  localStorage.getItem("role") === "admin"
    ? children
    : <Navigate to="/login" />;

const StudentRoute = ({ children }) =>
  localStorage.getItem("role") === "student"
    ? children
    : <Navigate to="/login" />;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Student */}
        <Route
          path="/student"
          element={
            <StudentRoute>
              <StudentLayout />
            </StudentRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="profile" element={<Profile />} /> {/* ✅ FIXED */}
          <Route path="performance" element={<Performance />} />
          <Route path="tests" element={<TestPapers />} />
          <Route path="homework" element={<Homework />} />
          <Route path="announcements" element={<Announcements />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<ManageStudents />} />
          <Route path="tests" element={<UploadTests />} />
          <Route path="homework" element={<UploadHomework />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="recycle-bin" element={<RecycleBin />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}