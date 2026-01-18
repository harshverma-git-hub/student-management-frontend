import api from "./api";

export const getAdminDashboard = () => api.get("/dashboard/admin");
export const getStudentDashboard = () => api.get("/dashboard/student");
