import { useEffect, useState } from "react";
import {
  Megaphone,
  Trash2,
  Paperclip,
} from "lucide-react";
import api from "../../services/api";

const API_BASE = "http://localhost:5000";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    message: "",
    targetType: "ALL",
    targetValue: "",
    file: null,
  });

  /* ================= FETCH ANNOUNCEMENTS ================= */
  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.get("/announcements/admin");
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

  /* ================= FORM HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.targetType !== "ALL" && !form.targetValue.trim()) {
      alert("Please provide target value");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("message", form.message);
      data.append("targetType", form.targetType);

      if (form.targetType !== "ALL") {
        data.append("targetValue", form.targetValue);
      }

      if (form.file) {
        data.append("attachment", form.file);
      }

      await api.post("/announcements", data);

      setForm({
        title: "",
        message: "",
        targetType: "ALL",
        targetValue: "",
        file: null,
      });

      loadAnnouncements();
    } catch (err) {
      console.error("Publish announcement failed:", err);

      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      alert(
        err.response?.data?.message ||
        "Failed to publish announcement"
      );
    }
  };

  /* ================= DELETE ANNOUNCEMENT ================= */
  const deleteAnnouncement = async (id) => {
    if (!window.confirm("Move announcement to recycle bin?")) return;

    try {
      await api.delete(`/announcements/${id}`);
      loadAnnouncements();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete announcement");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-10">
      {/* ================= POST ANNOUNCEMENT ================= */}
      <div className="bg-white rounded-xl shadow p-6 max-w-3xl">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Megaphone className="text-indigo-600" />
          Post Announcement
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Announcement Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          <textarea
            name="message"
            placeholder="Write the announcement details..."
            value={form.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border rounded-lg px-4 py-2"
          />

          {/* Target Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <select
              name="targetType"
              value={form.targetType}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            >
              <option value="ALL">All Students</option>
              <option value="BATCH">Specific Batch</option>
              <option value="STUDENT">Specific Student</option>
            </select>

            {form.targetType !== "ALL" && (
              <input
                type="text"
                name="targetValue"
                placeholder={
                  form.targetType === "BATCH"
                    ? "Batch name (e.g. Java)"
                    : "Student ID (e.g. ST001)"
                }
                value={form.targetValue}
                onChange={handleChange}
                required
                className="border rounded-lg px-4 py-2"
              />
            )}
          </div>

          {/* Attachment */}
          <input
            type="file"
            accept=".pdf"
            name="file"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Publish Announcement
          </button>
        </form>
      </div>

      {/* ================= ANNOUNCEMENT HISTORY ================= */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          Announcement History
        </h2>

        {loading ? (
          <p className="text-gray-500">
            Loading announcements...
          </p>
        ) : announcements.length === 0 ? (
          <p className="text-gray-500">
            No announcements posted yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-xl shadow p-5 relative space-y-3"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {a.title}
                  </h3>

                  <button
                    onClick={() => deleteAnnouncement(a.id)}
                    className="text-red-600"
                    title="Move to recycle bin"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Target Badge */}
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium
                      ${a.assignmentType === "ALL"
                        ? "bg-blue-100 text-blue-700"
                        : a.assignmentType === "BATCH"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }`}
                  >
                    {a.targetLabel}
                  </span>

                  {a.hasAttachment && (
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <Paperclip size={14} /> Attachment
                    </span>
                  )}
                </div>

                {/* Message Preview */}
                <p className="text-sm text-gray-700 line-clamp-3">
                  {a.message}
                </p>

                {/* Footer */}
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>📅 {a.date}</span>

                  {a.file && (
                    <a
                      href={a.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 font-medium hover:underline"
                    >
                      View Attachment
                    </a>

                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}