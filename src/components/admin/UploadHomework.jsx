import { useEffect, useState } from "react";
import { Trash2, Paperclip } from "lucide-react";
import api from "../../services/api";

const API_BASE = "http://localhost:5000";

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
    try {
      const res = await api.get("/students/dropdown");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

  const loadHomework = async () => {
    try {
      const res = await api.get("/homework/admin");
      setHomeworkList(res.data);
    } catch (err) {
      console.error("Failed to fetch homework", err);
    }
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

      if (assignedTo === "BATCH") {
        data.append("batch", batch);
      }

      if (assignedTo === "STUDENT") {
        data.append("studentId", studentId);
      }

      if (file) {
        data.append("file", file);
      }

      await api.post("/homework", data);

      // Reset form
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

      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

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
    if (!window.confirm("Move homework to recycle bin?"))
      return;

    try {
      await api.delete(`/homework/${id}`);
      loadHomework();
    } catch (err) {
      console.error("Delete homework failed", err);
      alert("Failed to delete homework");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-10 max-w-6xl mx-auto">
      {/* ================= CREATE HOMEWORK ================= */}
      <div className="bg-white rounded-xl shadow p-6 max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">
          Upload Homework
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Homework Title"
            className="w-full border rounded-lg px-4 py-2"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Homework Description"
            rows={3}
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />

          {/* TARGET TYPE */}
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="ALL">All Students</option>
            <option value="BATCH">Specific Batch</option>
            <option value="STUDENT">Specific Student</option>
          </select>

          {/* BATCH */}
          {assignedTo === "BATCH" && (
            <select
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select Batch</option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="C++">C++</option>
            </select>
          )}

          {/* STUDENT */}
          {assignedTo === "STUDENT" && (
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.studentId}) – {s.batch}
                </option>
              ))}
            </select>
          )}

          {/* FILE */}
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            {loading ? "Uploading..." : "Create Homework"}
          </button>
        </form>
      </div>

      {/* ================= HOMEWORK HISTORY ================= */}
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
                {/* Header */}
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

                {/* Target */}
                <span
                  className={`inline-block text-xs px-3 py-1 rounded-full
                    ${h.assignmentType === "ALL"
                      ? "bg-blue-100 text-blue-700"
                      : h.assignmentType === "BATCH"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-green-100 text-green-700"
                    }`}
                >
                  {h.targetLabel}
                </span>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {h.description}
                </p>

                {/* Footer */}
                <div className="flex justify-between text-xs text-gray-500">
                  <span>📅 Due: {h.dueDate}</span>
                  <span>
                    📝 Submissions: {h.submissionCount}
                  </span>
                </div>

                {/* Attachment */}
                {h.hasAttachment && (
                  <a
                    href={h.file}
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