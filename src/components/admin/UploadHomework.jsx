import { useEffect, useState } from "react";
import { Trash2, Paperclip } from "lucide-react";
import api from "../../services/api";

const BACKEND_BASE = import.meta.env.VITE_API_BASE_URL;

export default function UploadHomework() {
  /* ================= FORM STATE ================= */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState(null);

  const [assignedTo, setAssignedTo] = useState("ALL");
  const [batch, setBatch] = useState("");
  const [studentId, setStudentId] = useState("");

  /* ================= DATA STATE ================= */
  const [students, setStudents] = useState([]);
  const [homeworkList, setHomeworkList] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD DATA ================= */
  const loadStudents = async () => {
    const res = await api.get("/students/dropdown");
    setStudents(res.data);
  };

  const loadHomework = async () => {
    const res = await api.get("/homework/admin");
    setHomeworkList(res.data);
  };

  useEffect(() => {
    loadStudents();
    loadHomework();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !dueDate) {
      alert("Title and due date are required");
      return;
    }

    if (assignedTo === "BATCH" && !batch) {
      alert("Please select a batch");
      return;
    }

    if (assignedTo === "STUDENT" && !studentId) {
      alert("Please select a student");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("title", title);
      data.append("description", description);
      data.append("dueDate", dueDate);
      data.append("assignedTo", assignedTo);

      if (assignedTo === "BATCH") data.append("batch", batch);
      if (assignedTo === "STUDENT") data.append("studentId", studentId);
      if (file) data.append("file", file);

      await api.post("/homework", data);

      setTitle("");
      setDescription("");
      setDueDate("");
      setFile(null);
      setAssignedTo("ALL");
      setBatch("");
      setStudentId("");

      loadHomework();
    } catch (err) {
      console.error("Create homework failed:", err);
      alert(
        err.response?.data?.message ||
          "Failed to create homework"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteHomework = async (id) => {
    if (!window.confirm("Move homework to recycle bin?")) return;
    await api.delete(`/homework/${id}`);
    loadHomework();
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-10 max-w-6xl mx-auto">
      {/* ================= CREATE ================= */}
      <div className="bg-white rounded-xl shadow p-6 max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">
          Upload Homework
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Homework Title"
            className="input"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Homework Description"
            rows={3}
            className="input"
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input"
          />

          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="input"
          >
            <option value="ALL">All Students</option>
            <option value="BATCH">Specific Batch</option>
            <option value="STUDENT">Specific Student</option>
          </select>

          {assignedTo === "BATCH" && (
            <select
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="input"
            >
              <option value="">Select Batch</option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="C++">C++</option>
            </select>
          )}

          {assignedTo === "STUDENT" && (
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="input"
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.studentId}) – {s.batch}
                </option>
              ))}
            </select>
          )}

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Uploading..." : "Create Homework"}
          </button>
        </form>
      </div>

      {/* ================= HISTORY ================= */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          Homework History
        </h2>

        {homeworkList.length === 0 ? (
          <p className="text-gray-500">
            No homework created yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {homeworkList.map((h) => (
              <div
                key={h.id}
                className="bg-white rounded-xl shadow p-5 space-y-3"
              >
                <div className="flex justify-between">
                  <h3 className="font-semibold text-lg">
                    {h.title}
                  </h3>
                  <button
                    onClick={() => deleteHomework(h.id)}
                    className="text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <span className="text-xs text-gray-500">
                  📅 Due: {h.dueDate}
                </span>

                {h.hasAttachment && (
                  <a
                    href={`${BACKEND_BASE}/files/view?url=${encodeURIComponent(
                      h.file
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-600 text-sm"
                  >
                    <Paperclip size={14} />
                    View File
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