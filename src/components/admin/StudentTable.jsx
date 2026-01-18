import StudentRow from "./StudentRow";

export default function StudentTable({ students, onSelectStudent }) {
  if (!students || students.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
        No students found. Add a new student to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-indigo-600 text-white text-left">
            <th className="px-6 py-4 font-semibold">Student ID</th>
            <th className="px-6 py-4 font-semibold">Name</th>
            <th className="px-6 py-4 font-semibold">Class</th>
            <th className="px-6 py-4 font-semibold">Batch</th>
            <th className="px-6 py-4 font-semibold">Time Slot</th>
            <th className="px-6 py-4 font-semibold text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <StudentRow
              key={student.id}
              student={student}
              onClick={() => onSelectStudent(student)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
