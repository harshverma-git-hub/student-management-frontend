import { useEffect, useState } from "react";
import { Megaphone, FileText, X } from "lucide-react";
import api from "../../services/api";

const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL;

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  /* ================= FETCH ================= */
  const loadAnnouncements = async () => {
    try {
      const res = await api.get("/announcements/student");
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Failed to load announcements", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Megaphone className="text-indigo-600" />
          Announcements
        </h1>
        <p className="text-sm text-gray-500">
          Important updates from your institute
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white p-6 rounded-xl shadow text-gray-500">
          Loading announcements…
        </div>
      )}

      {/* Empty */}
      {!loading && announcements.length === 0 && (
        <div className="bg-white p-6 rounded-xl shadow text-gray-500">
          No announcements available.
        </div>
      )}

      {/* Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {announcements.map((a) => (
          <div
            key={a.id}
            onClick={() => setSelected(a)}
            className="bg-white p-5 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg mb-2">
              {a.title}
            </h3>

            <p className="text-sm text-gray-600 line-clamp-3">
              {a.message}
            </p>

            <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
              <span>{a.date}</span>
              {a.file && <FileText size={14} />}
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-2">
              {selected.title}
            </h2>

            <p className="text-xs text-gray-400 mb-4">
              {selected.date}
            </p>

            <p className="text-gray-700 whitespace-pre-line mb-6">
              {selected.message}
            </p>

            {selected.file && (
              <a
                href={`${FILE_BASE}/api/files/view?url=${encodeURIComponent(
                  selected.file
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-600 font-medium"
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