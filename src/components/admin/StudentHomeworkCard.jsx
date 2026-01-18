export default function StudentHomeworkCard({ student, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex items-center gap-4"
    >
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
        {student.studentName.charAt(0)}
      </div>

      {/* Info */}
      <div>
        <p className="font-semibold">{student.studentName}</p>
        <p className="text-sm text-gray-500">{student.studentId}</p>
      </div>
    </div>
  );
}