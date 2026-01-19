import { useEffect, useState } from "react";
import { ClipboardList, Paperclip, Trash2 } from "lucide-react";
import api from "../../services/api";

const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL;

export default function UploadHomework() {
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    targetType: "ALL",
    targetValue: "",
    file: null,
  });

  /* ================= FETCH ================= */
  const loadHomework = async () => {
    try {
      setLoading(true);
      const res = await api.get("/homework/admin");
      setHomeworks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomework();
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
    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    await api.post("/homework", data);
    setForm({
      title: "",
      description: "",
      dueDate: "",
      targetType: "ALL",
      targetValue: "",
      file: null,
    });
    loadHomework();
  };

  /* ================= DELETE ================= */
  const deleteHomework = async (id) => {
    if (!window.confirm("Move homework to recycle bin?")) return;
    await api.delete(`/homework/${id}`);
    loadHomework();
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-12">
      {/* UPLOAD HOMEWORK */}
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-4xl">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <ClipboardList className="text-indigo-600" />
          Upload Homework
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Homework title"
            className="px-4 py-2 border rounded-lg"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Homework description..."
            className="px-4 py-2 border rounded-lg resize-none"
          />

          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded-lg"
            />

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
              name="file"
              accept=".pdf"
              onChange={handleChange}
              className="text-sm"
            />
          </div>

          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg w-fit">
            Upload Homework
          </button>
        </form>
      </div>

      {/* HOMEWORK HISTORY */}
      <div>
        <h2 className="text-xl font-bold mb-6">Homework History</h2>

        {loading ? (
          <p className="text-gray-500">Loading homework…</p>
        ) : homeworks.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-gray-500">
            No homework uploaded yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {homeworks.map((h) => (
              <div
                key={h.id}
                className="bg-white p-5 rounded-2xl shadow-sm border flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{h.title}</h3>
                    <button
                      onClick={() => deleteHomework(h.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3">
                    {h.description}
                  </p>

                  <p className="text-xs text-gray-500">
                    Due: {new Date(h.dueDate).toLocaleDateString()}
                  </p>
                </div>

                {h.file && (
                  <a
                    href={`${FILE_BASE}/api/files/view?url=${encodeURIComponent(
                      h.file
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
