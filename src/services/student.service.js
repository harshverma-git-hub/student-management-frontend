import api from "./api";

// ===============================
// Fetch all students (Admin)
// ===============================
export const fetchStudents = async () => {
  const res = await api.get("/students");
  return res.data;
};

// ===============================
// Create a new student (Admin)
// ===============================
export const createStudent = async (formData) => {
  const res = await api.post("/students", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// ===============================
// Deactivate student (Admin)
// ===============================
export const deactivateStudent = async (studentId) => {
  const res = await api.patch(`/students/deactivate/${studentId}`);
  return res.data;
};