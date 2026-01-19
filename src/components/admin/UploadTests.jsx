import { useEffect, useState } from "react";
import api from "../../services/api";
import { Trash2, Download } from "lucide-react";

const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL;
export default function UploadTests() {
  const [title, setTitle] = useState("");
  const [testDate, setTestDate] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [obtainedMarks, setObtainedMarks] = useState("");
  const [file, setFile] = useState(null);

  const [assignedTo, setAssignedTo] = useState("ALL");
  const [batch, setBatch] = useState("");
  const [studentId, setStudentId] = useState("");

  const [students, setStudents] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD DATA ================= */

  const loadStudents = async () => {
    const res = await api.get("/students/dropdown");
    setStudents(res.data);
  };

  const loadTests = async () => {
    const res = await api.get("/tests/admin");
    setTests(res.data);
  };

  useEffect(() => {
    loadStudents();
    loadTests();
  }, []);

  /* ================= UPLOAD ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !testDate || !file || !maxMarks) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("title", title);
      formData.append("testDate", testDate);
      formData.append("maxMarks", maxMarks);
      formData.append("pdf", file);
      formData.append("assignedTo", assignedTo);

      if (assignedTo === "BATCH") formData.append("batch", batch);
      if (assignedTo === "STUDENT") {
        formData.append("studentId", studentId);
        formData.append("marks", obtainedMarks);
      }

      await api.post("/tests", formData);

      setTitle("");
      setTestDate("");
      setMaxMarks("");
      setObtainedMarks("");
      setFile(null);
      setAssignedTo("ALL");
      setBatch("");
      setStudentId("");

      loadTests();
    } catch (err) {
      alert("Failed to upload test");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const deleteTest = async (id) => {
    if (!window.confirm("Move test to recycle bin?")) return;
    await api.patch(`/tests/delete/${id}`);
    loadTests();
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Upload Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 space-y-4 max-w-3xl"
      >
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Test Name" className="input" />
        <input type="date" value={testDate} onChange={(e) => setTestDate(e.target.value)} className="input" />
        <input type="number" value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} placeholder="Max Marks" className="input" />

        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="input">
          <option value="ALL">All Students</option>
          <option value="BATCH">Specific Batch</option>
          <option value="STUDENT">Specific Student</option>
        </select>

        <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />

        <button disabled={loading} className="btn-primary">
          {loading ? "Uploading..." : "Upload Test"}
        </button>
      </form>

      {/* Test List */}
      <div className="grid md:grid-cols-2 gap-6">
        {tests.map((test) => (
          <div key={test.id} className="bg-white p-5 rounded-xl shadow space-y-3">
            <h3 className="font-semibold">{test.title}</h3>

            <a
  href={`${FILE_BASE}/api/files/view?url=${encodeURIComponent(fileUrl)}`}
  target="_blank"
  rel="noopener noreferrer"
>
  View PDF
</a>

            <button onClick={() => deleteTest(test.id)} className="text-red-600">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
