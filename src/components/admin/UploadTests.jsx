import { useEffect, useState } from "react";
import { FileText, Paperclip, Trash2 } from "lucide-react";
import api from "../../services/api";

const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL;

export default function UploadTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    testDate: "",
    maxMarks: "",
    targetType: "ALL",
    targetValue: "",
    file: null,
  });

  /* ================= FETCH ================= */
  const loadTests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tests/admin");
      setTests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
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

    await api.post("/tests", data);
    setForm({
      title: "",
      testDate: "",
      maxMarks: "",
      targetType: "ALL",
      targetValue: "",
      file: null,
    });
    loadTests();
  };

  /* ================= DELETE ================= */
  const deleteTest = async (id) => {
    if (!window.confirm("Move test to recycle bin?")) return;
    await api.delete(`/tests/${id}`);
    loadTests();
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-12">
      {/* UPLOAD TEST */}
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-4xl">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <FileText className="text-indigo-600" />
          Upload Test Paper
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Test name"
            className="px-4 py-2 border rounded-lg"
          />

          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="date"
              name="testDate"
              value={form.testDate}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded-lg"
            />

            <input
              type="number"
              name="maxMarks"
              value={form.maxMarks}
              onChange={handleChange}
              required
              placeholder="Maximum marks"
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
          </div>

          <input
            type="file"
            name="file"
            accept=".pdf"
            onChange={handleChange}
            className="text-sm"
          />

          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg w-fit">
            Upload Test
          </button>
        </form>
      </div>

      {/* TEST HISTORY */}
      <div>
        <h2 className="text-xl font-bold mb-6">Uploaded Tests</h2>

        {loading ? (
          <p className="text-gray-500">Loading tests…</p>
        ) : tests.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-gray-500">
            No tests uploaded yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tests.map((t) => (
              <div
                key={t.id}
                className="bg-white p-5 rounded-2xl shadow-sm border flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{t.title}</h3>
                    <button
                      onClick={() => deleteTest(t.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600">
                    Date: {new Date(t.testDate).toLocaleDateString()}
                  </p>

                  <p className="text-sm text-gray-600">
                    Max Marks: {t.maxMarks}
                  </p>
                </div>

                {t.file && (
                  <a
                    href={`${FILE_BASE}/api/files/view?url=${encodeURIComponent(
                      t.file
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-indigo-600 font-medium"
                  >
                    <Paperclip size={16} />
                    View Question Paper
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