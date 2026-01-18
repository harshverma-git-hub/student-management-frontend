import { useEffect, useState } from "react";
import api from "../../services/api";

export default function StudentHomeworkPanel({ student, onClose }) {
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  /* ================= FETCH HOMEWORK ================= */
  useEffect(() => {
    loadHomework();
  }, []);

  const loadHomework = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/homework/admin/${student.id}`
      );
      setHomework(res.data);
    } catch (err) {
      console.error("Failed to load homework", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
      <div className="bg-white w-full md:w-[500px] h-full p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{student.name}</h2>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        {/* Homework List */}
        {loading && (
          <p className="text-gray-500">Loading homework...</p>
        )}

        {!loading && homework.length === 0 && (
          <p className="text-gray-500">No homework assigned.</p>
        )}

        {!loading &&
          homework.map((hw) => {
            const isLate =
              !hw.submitted && hw.dueDate < today;

            return (
              <div key={hw.id} className="border rounded-lg p-4 mb-4">
                <h3 className="font-semibold">{hw.title}</h3>
                <p className="text-sm text-gray-600">
                  {hw.description}
                </p>

                <p className="text-sm mt-1">
                  📅 Due: <strong>{hw.dueDate}</strong>
                </p>

                {/* Status */}
                {hw.submitted ? (
                  <p className="text-green-600 mt-2">
                    ✅ Submitted on {hw.submittedOn}
                  </p>
                ) : isLate ? (
                  <p className="text-red-600 mt-2">
                    ❌ Not Submitted (Late)
                  </p>
                ) : (
                  <p className="text-orange-500 mt-2">
                    ⏳ Pending
                  </p>
                )}

                {/* Files */}
                {hw.submissionFile && (
                  <a
                    href={`http://localhost:5000/${hw.submissionFile}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 text-sm underline mt-2 block"
                  >
                    View Submission
                  </a>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}