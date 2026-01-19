import { useEffect, useState } from "react";
import { Megaphone, Trash2, Paperclip } from "lucide-react";
import api from "../../services/api";

const BACKEND_BASE = import.meta.env.VITE_API_BASE_URL;

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
    <div className="p-6 space-y-10">
      {/* CREATE */}
      <div className="bg-white rounded-xl shadow p-6 max-w-3xl">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Megaphone className="text-indigo-600" />
          Post Announcement
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={form.title} onChange={handleChange} required className="input" placeholder="Title" />
          <textarea name="message" value={form.message} onChange={handleChange} required rows={4} className="input" placeholder="Message" />

          <select name="targetType" value={form.targetType} onChange={handleChange} className="input">
            <option value="ALL">All Students</option>
            <option value="BATCH">Batch</option>
            <option value="STUDENT">Student</option>
          </select>

          <input type="file" accept=".pdf" name="file" onChange={handleChange} />

          <button className="btn-primary">Publish</button>
        </form>
      </div>

      {/* HISTORY */}
      <div>
        <h2 className="text-xl font-bold mb-4">Announcement History</h2>

        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {announcements.map((a) => (
              <div key={a.id} className="bg-white p-5 rounded-xl shadow space-y-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{a.title}</h3>
                  <button onClick={() => deleteAnnouncement(a.id)} className="text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3">{a.message}</p>

                {a.file && (
                  <a
                    href={`${BACKEND_BASE}/api/files/view?url=${encodeURIComponent(a.file)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-600 text-sm"
                  >
                    <Paperclip size={14} />
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