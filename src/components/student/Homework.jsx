import { useEffect, useState } from "react";
import {
  BookOpen,
  FileText,
  Upload,
  X,
} from "lucide-react";
import api from "../../services/api";

const API_BASE = "http://localhost:5000";

export default function Homework() {
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /* ================= FETCH HOMEWORK ================= */
  const loadHomework = async () => {
    try {
      setLoading(true);
      const res = await api.get("/homework/student");
      setHomework(res.data);
    } catch (err) {
      console.error("Failed to fetch homework", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomework();
  }, []);

  /* ================= SUBMIT ================= */
  const submitHomework = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("file", file);

      await api.post(
        `/homework/submit/${selected.id}`,
        data
      );

      setFile(null);
      setSelected(null);
      loadHomework();
    } catch (err) {
      console.error("Submit homework failed", err);
      alert(
        err.response?.data?.message ||
        "Failed to submit homework"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= STATUS HELPERS ================= */
  const getStatusBadge = (hw) => {
    if (hw.submitted) {
      return (
        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
          Submitted
        </span>
      );
    }

    const isLate =
      hw.dueDate &&
      new Date() > new Date(hw.dueDate);

    return (
      <span
        className={`text-xs px-3 py-1 rounded-full ${isLate
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
          }`}
      >
        {isLate ? "Late" : "Pending"}
      </span>
    );
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Homework
        </h1>
        <p className="text-sm text-gray-500">
          View and submit your homework assignments
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">
          Loading homework...
        </p>
      )}

      {/* Empty */}
      {!loading && homework.length === 0 && (
        <p className="text-gray-500">
          No homework assigned.
        </p>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {homework.map((hw) => (
          <div
            key={hw.id}
            onClick={() => setSelected(hw)}
            className="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-lg transition"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <BookOpen className="text-indigo-600" />
                <h2 className="font-semibold text-lg text-gray-800">
                  {hw.title}
                </h2>
              </div>
              {getStatusBadge(hw)}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-2 mt-2">
              {hw.description}
            </p>

            {/* Footer */}
            <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
              <span>📅 Due: {hw.dueDate}</span>
              {hw.file && (
                <span className="flex items-center gap-1">
                  <FileText size={14} />
                  Attachment
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
            {/* Close */}
            <button
              onClick={() => {
                setSelected(null);
                setFile(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {selected.title}
              </h2>
              {getStatusBadge(selected)}
            </div>

            {/* Meta */}
            <p className="text-sm text-gray-500 mb-4">
              📅 Due Date: {selected.dueDate}
            </p>

            {/* Description */}
            <p className="text-gray-700 mb-6 whitespace-pre-line">
              {selected.description}
            </p>

            {/* Attachment */}
            {selected.file && (
              <a
                href={selected.file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-600 font-medium mb-6" download
              >
                <FileText size={18} />
                View Homework File
              </a>

            )}

            {/* Submit */}
            {!selected.submitted && (
              <div className="border-t pt-4 space-y-3">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    setFile(e.target.files[0])
                  }
                />

                <button
                  onClick={submitHomework}
                  disabled={submitting}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
                >
                  <Upload size={18} />
                  {submitting
                    ? "Submitting..."
                    : "Submit Homework"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}