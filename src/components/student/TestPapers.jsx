import { useEffect, useState } from "react";
import { FileText, Award } from "lucide-react";
import api from "../../services/api";

const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL;

/* ================= HELPERS ================= */
function getStatus(marks, maxMarks) {
  if (marks === null || marks === undefined) return "Not Evaluated";
  const percent = (marks / maxMarks) * 100;
  if (percent >= 80) return "Excellent";
  if (percent >= 60) return "Good";
  return "Needs Improvement";
}

function getColor(marks, maxMarks) {
  if (marks === null || marks === undefined) return "bg-gray-400";
  const percent = (marks / maxMarks) * 100;
  if (percent >= 80) return "bg-green-500";
  if (percent >= 60) return "bg-yellow-500";
  return "bg-red-500";
}

/* ================= COMPONENT ================= */
export default function TestPapers() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await api.get("/tests/student");
      setTests(res.data);
    } catch (err) {
      console.error("Failed to load tests", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Award className="text-indigo-600" />
          Test Results
        </h1>
        <p className="text-gray-500 text-sm">
          View your test papers and performance
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white p-6 rounded-xl shadow text-gray-500">
          Loading test papers…
        </div>
      )}

      {/* Empty */}
      {!loading && tests.length === 0 && (
        <div className="bg-white p-6 rounded-xl shadow text-gray-500">
          No test papers available yet.
        </div>
      )}

      {/* Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tests.map((test) => {
          const marks =
            test.marks === undefined ? null : test.marks;
          const maxMarks = test.maxMarks;
          const percentage =
            marks !== null ? (marks / maxMarks) * 100 : 0;

          return (
            <div
              key={test.id}
              className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h2 className="font-semibold text-lg">
                    {test.title}
                  </h2>

                  <span
                    className={`text-xs px-3 py-1 rounded-full text-white ${getColor(
                      marks,
                      maxMarks
                    )}`}
                  >
                    {getStatus(marks, maxMarks)}
                  </span>
                </div>

                <p className="text-xs text-gray-400">
                  Conducted on{" "}
                  {new Date(test.testDate).toLocaleDateString()}
                </p>

                {/* Score */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Score</span>
                    <span>
                      {marks !== null
                        ? `${marks}/${maxMarks}`
                        : `— / ${maxMarks}`}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getColor(
                        marks,
                        maxMarks
                      )}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* View PDF */}
              {test.file && (
                <a
                  href={`${FILE_BASE}/api/files/view?url=${encodeURIComponent(
                    test.file
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-indigo-600 font-medium"
                >
                  <FileText size={18} />
                  View Question Paper
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}