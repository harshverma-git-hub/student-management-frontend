import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/student/StudentSidebar";

export default function StudentLayout() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-64 z-20">
        <StudentSidebar />
      </div>

      {/* Main Content */}
      <main className="ml-64 w-full min-h-screen bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
}