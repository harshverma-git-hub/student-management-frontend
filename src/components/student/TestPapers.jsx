import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import api from "../../services/api";

const API_BASE = "http://localhost:5000";

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Test Papers
        </h1>
        <p className="text-gray-500 text-sm">
          View your test papers and results
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">
          Loading test papers...
        </p>
      )}

      {/* Empty */}
      {!loading && tests.length === 0 && (
        <p className="text-gray-500">
          No test papers available yet.
        </p>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tests.map((test) => {
          const marks =
            test.marks === undefined ? null : test.marks;
          const maxMarks = test.maxMarks;

          const percentage =
            marks !== null
              ? (marks / maxMarks) * 100
              : 0;

          return (
            <div
              key={test.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-5"
            >
              {/* Top */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="font-semibold text-lg text-gray-800">
                    {test.title}
                  </h2>
                  <p className="text-xs text-gray-400">
                    Conducted on {test.date}
                  </p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full text-white ${getColor(
                    marks,
                    maxMarks
                  )}`}
                >
                  {getStatus(marks, maxMarks)}
                </span>
              </div>

              {/* Marks */}
              <div className="mb-4">
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
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>

              {/* Download */}
              <a
  href={test.file}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline text-sm"
  
>
  <Download size={16} />
  Download Question Paper
</a>

            </div>
          );
        })}
      </div>
    </div>
  );
}