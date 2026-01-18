import { useEffect, useState } from "react";
import StudentRow from "./StudentRow";
import StudentProfile from "./StudentProfile";
import StudentForm from "./StudentForm";
import ConfirmDelete from "../common/ConfirmDelete";
import EmptyState from "../common/EmptyState";
import {
  fetchStudents,
  createStudent,
  deactivateStudent,
} from "../../services/student.service";

export default function ManageStudents() {
  /* ================= STATE ================= */

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  /* ================= FETCH STUDENTS ================= */

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await fetchStudents();
      setStudents(data);
    } catch (err) {
      console.error("Failed to load students", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLERS ================= */

  // 👉 ADD / EDIT student (BACKEND CONNECTED)
  const handleSaveStudent = async (formData) => {
    try {
      await createStudent(formData);
      await loadStudents();
      setShowForm(false);
      setEditingStudent(null);
    } catch (err) {
      alert("Failed to save student");
    }
  };

  // 👉 DELETE / DEACTIVATE student (BACKEND CONNECTED)
  const handleDeleteStudent = async () => {
    try {
      await deactivateStudent(deleteTarget.id);
      await loadStudents();
      setDeleteTarget(null);
      setSelectedStudent(null);
    } catch (err) {
      alert("Failed to delete student");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Manage Students
        </h1>

        {/* ADD STUDENT BUTTON */}
        <button
          onClick={() => {
            setEditingStudent(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          + Add Student
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <EmptyState
            title="Loading..."
            message="Fetching students, please wait."
          />
        ) : students.length === 0 ? (
          <EmptyState
            title="No Students Found"
            message="Click on ‘Add Student’ to add a new student."
          />
        ) : (
          <table className="w-full text-left">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-4">Student ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Batch</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  onClick={() => setSelectedStudent(student)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* STUDENT PROFILE */}
      {selectedStudent && (
        <StudentProfile
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onEdit={(student) => {
            setEditingStudent(student);
            setSelectedStudent(null);
            setShowForm(true);
          }}
          onDelete={(student) => setDeleteTarget(student)}
        />
      )}

      {/* ADD / EDIT STUDENT FORM */}
      {showForm && (
        <StudentForm
          initialData={editingStudent}
          onSave={handleSaveStudent}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* DELETE CONFIRMATION */}
      {deleteTarget && (
        <ConfirmDelete
          title="Delete Student"
          message={`Are you sure you want to delete ${deleteTarget.name}?`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteStudent}
        />
      )}
    </div>
  );
}