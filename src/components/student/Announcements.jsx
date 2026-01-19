import { useEffect, useState } from "react";
import {
  Megaphone,
  FileText,
  X,
} from "lucide-react";
import api from "../../services/api";

const API_BASE = "http://localhost:5000";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // modal data

  /* ================= FETCH ANNOUNCEMENTS ================= */
  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.get("/announcements/student");
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Failed to load announcements", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Announcements
        </h1>
        <p className="text-sm text-gray-500">
          Important updates from your teacher
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">
          Loading announcements...
        </p>
      )}

      {/* Empty */}
      {!loading && announcements.length === 0 && (
        <p className="text-gray-500">
          No announcements available.
        </p>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((a) => (
          <div
            key={a.id}
            onClick={() => setSelected(a)}
            className="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-lg transition relative"
          >
            {/* New badge */}
            {a.isNew && (
              <span className="absolute top-4 right-4 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                New
              </span>
            )}

            {/* Title */}
            <div className="flex items-center gap-2 mb-2">
              <Megaphone
                size={18}
                className="text-indigo-600"
              />
              <h2 className="font-semibold text-lg text-gray-800">
                {a.title}
              </h2>
            </div>

            {/* Preview */}
            <p className="text-sm text-gray-600 line-clamp-3">
              {a.message}
            </p>

            {/* Footer */}
            <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
              <span>📅 {a.date}</span>
              <span>🎯 {a.target}</span>
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
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <Megaphone
                size={22}
                className="text-indigo-600"
              />
              <h2 className="text-xl font-bold text-gray-800">
                {selected.title}
              </h2>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
              <span>📅 {selected.date}</span>
              <span>🎯 {selected.target}</span>
            </div>

            {/* Full Message */}
            <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
              {selected.message}
            </p>

            {/* Attachment */}
            {selected.file && (
              <a
                href={selected.file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:underline"
                download
              >
                <FileText size={18} />
                View Attachment
              </a>

            )}
          </div>
        </div>
      )}
    </div>
  );
}