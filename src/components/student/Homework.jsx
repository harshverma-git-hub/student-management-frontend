import { useEffect, useState } from "react";
import { BookOpen, FileText, Upload, X } from "lucide-react";
import api from "../../services/api";

const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL;

/* ================= STATUS HELPERS ================= */
function getStatus(hw) {
  if (hw.submitted) return { text: "Submitted", color: "bg-green-100 text-green-700" };

  const isLate = hw.dueDate && new Date() > new Date(hw.dueDate);
  return {
    text: isLate ? "Late" : "Pending",
    color: isLate
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700",
  };
}

/* ================= COMPONENT ================= */
export default function Homework() {
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /* ================= FETCH ================= */
  const loadHomework = async () => {
    try {
      const res = await api.get("/homework/student");
      setHomework(res.data);
    } catch (err) {
      console.error("Failed to load homework", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomework();
  }, []);

  /* ================= SUBMIT ================= */
  const submitHomework = async () => {
    if (!file) return alert("Please select a file");

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("file", file);

      await api.post(`/homework/submit/${selected.id}`, data);

      setFile(null);
      setSelected(null);
      loadHomework();
    } catch (err) {
      alert("Failed to submit homework");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="text-indigo-600" />
          Homework
        </h1>
        <p className="text-sm text-gray-500">
          View and submit your homework assignments
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white p-6 rounded-xl shadow text-gray-500">
          Loading homework…
        </div>
      )}

      {/* Empty */}
      {!loading && homework.length === 0 && (
        <div className="bg-white p-6 rounded-xl shadow text-gray-500">
          No homework assigned yet.
        </div>
      )}

      {/* Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {homework.map((hw) => {
          const status = getStatus(hw);

          return (
            <div
              key={hw.id}
              onClick={() => setSelected(hw)}
              className="bg-white p-5 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-semibold text-lg">{hw.title}</h2>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${status.color}`}
                >
                  {status.text}
                </span>
              </div>

              <p className="text-sm text-gray-600 line-clamp-3">
                {hw.description}
              </p>

              <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
                <span>
                  Due: {new Date(hw.dueDate).toLocaleDateString()}
                </span>
                {hw.file && <FileText size={14} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative">
            <button
              onClick={() => {
                setSelected(null);
                setFile(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-2">
              {selected.title}
            </h2>

            <p className="text-xs text-gray-400 mb-4">
              Due: {new Date(selected.dueDate).toLocaleDateString()}
            </p>

            <p className="text-gray-700 mb-6 whitespace-pre-line">
              {selected.description}
            </p>

            {/* View PDF */}
            {selected.file && (
              <a
                href={`${FILE_BASE}/api/files/view?url=${encodeURIComponent(
                  selected.file
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-600 font-medium mb-6"
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
                  onChange={(e) => setFile(e.target.files[0])}
                />

                <button
                  onClick={submitHomework}
                  disabled={submitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
                >
                  <Upload size={18} />
                  {submitting ? "Submitting…" : "Submit Homework"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
