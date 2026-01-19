import { useEffect, useState } from "react";
import { Megaphone, Trash2, Paperclip } from "lucide-react";
import api from "../../services/api";

const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL;

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

  /* ================= FETCH ================= */
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

  /* ================= FORM ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
  };

  /* ================= DELETE ================= */
  const deleteAnnouncement = async (id) => {
    if (!window.confirm("Move announcement to recycle bin?")) return;
    await api.delete(`/announcements/${id}`);
    loadAnnouncements();
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-12">
      {/* CREATE ANNOUNCEMENT */}
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-4xl">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <Megaphone className="text-indigo-600" />
          Post New Announcement
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Announcement title"
            className="w-full px-4 py-2 border rounded-lg"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Write announcement message..."
            className="w-full px-4 py-2 border rounded-lg resize-none"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <select
              name="targetType"
              value={form.targetType}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="ALL">All Students</option>
              <option value="BATCH">Batch</option>
              <option value="STUDENT">Individual Student</option>
            </select>

            <input
              type="file"
              accept=".pdf"
              name="file"
              onChange={handleChange}
              className="text-sm"
            />
          </div>

          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg w-fit">
            Publish Announcement
          </button>
        </form>
      </div>

      {/* ANNOUNCEMENT HISTORY */}
      <div>
        <h2 className="text-xl font-bold mb-6">Announcement History</h2>

        {loading ? (
          <p className="text-gray-500">Loading announcements…</p>
        ) : announcements.length === 0 ? (
          <div className="text-gray-500 bg-white p-6 rounded-xl shadow">
            No announcements posted yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="bg-white p-5 rounded-2xl shadow-sm border flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{a.title}</h3>
                    <button
                      onClick={() => deleteAnnouncement(a.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-4">
                    {a.message}
                  </p>
                </div>

                {a.file && (
                  <a
                    href={`${FILE_BASE}/api/files/view?url=${encodeURIComponent(
                      a.file
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-indigo-600 font-medium"
                  >
                    <Paperclip size={16} />
                    View Attachment
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}