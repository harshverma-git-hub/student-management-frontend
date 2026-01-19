import { useEffect, useState } from "react";
import api from "../../services/api";
import { Trash2, Download } from "lucide-react";

const API_BASE = "http://localhost:5000";

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

  /* ================= FETCH STUDENTS (DROPDOWN) ================= */
  const loadStudents = async () => {
    try {
      const res = await api.get("/students/dropdown");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

  /* ================= FETCH TESTS (ADMIN) ================= */
  const loadTests = async () => {
    try {
      const res = await api.get("/tests/admin");
      setTests(res.data);
    } catch (err) {
      console.error("Failed to fetch tests", err);
    }
  };

  useEffect(() => {
    loadTests();
    loadStudents();
  }, []);

  /* ================= UPLOAD TEST ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !testDate || !file || !maxMarks) {
      alert("All fields are required");
      return;
    }

    if (Number(maxMarks) <= 0) {
      alert("Max marks must be greater than 0");
      return;
    }

    if (assignedTo === "BATCH" && !batch) {
      alert("Please select a batch");
      return;
    }

    if (assignedTo === "STUDENT") {
      if (!studentId) {
        alert("Please select a student");
        return;
      }

      if (obtainedMarks === "") {
        alert("Please enter obtained marks");
        return;
      }

      if (Number(obtainedMarks) > Number(maxMarks)) {
        alert("Obtained marks cannot exceed maximum marks");
        return;
      }
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("testDate", testDate);
      formData.append("maxMarks", maxMarks);
      formData.append("pdf", file);
      formData.append("assignedTo", assignedTo);

      if (assignedTo === "BATCH") {
        formData.append("batch", batch);
      }

      if (assignedTo === "STUDENT") {
        formData.append("studentId", studentId); // ✅ MongoDB _id
        formData.append("marks", obtainedMarks);
      }

      await api.post("/tests", formData);

      // Reset form
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE TEST ================= */
 const deleteTest = async (id) => {
  if (!window.confirm("Move test to recycle bin?")) return;

  try {
    await api.patch(`/tests/delete/${id}`);
    loadTests();
  } catch (err) {
    console.error("Delete test failed:", err);

    if (err.response?.status === 401) {
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    alert(
      err.response?.data?.message ||
      "Failed to delete test"
    );
  }
};


  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* ================= UPLOAD FORM ================= */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Upload Test Papers</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6 space-y-4 max-w-3xl"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Test Name"
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="number"
            value={maxMarks}
            onChange={(e) => setMaxMarks(e.target.value)}
            placeholder="Maximum Marks"
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

          {/* STUDENT DROPDOWN */}
          {assignedTo === "STUDENT" && (
            <>
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

              <input
                type="number"
                value={obtainedMarks}
                onChange={(e) => setObtainedMarks(e.target.value)}
                placeholder="Obtained Marks"
                className="w-full border rounded-lg px-4 py-2"
              />
            </>
          )}

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            {loading ? "Uploading..." : "Upload Test"}
          </button>
        </form>
      </div>

      {/* ================= UPLOADED TEST LIST ================= */}
      {/* ================= UPLOADED TEST LIST ================= */}
<div>
  <h2 className="text-xl font-semibold mb-4">Uploaded Tests</h2>

  {tests.length === 0 ? (
    <p className="text-gray-500">No test papers uploaded yet.</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tests.map((test) => (
        <div
          key={test.id}
          className="bg-white rounded-xl shadow p-5 space-y-3 relative"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-gray-800">
                {test.title}
              </h3>
              <p className="text-sm text-gray-500">
                Test Date: {test.date}
              </p>
            </div>

            <button
              onClick={() => deleteTest(test.id)}
              className="text-red-600"
              title="Move to recycle bin"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Assignment Info */}
          <div className="flex flex-wrap gap-2">
            {test.assignedTo === "ALL" && (
              <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                Assigned to: All Students
              </span>
            )}

            {test.assignedTo === "BATCH" && (
              <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                Batch: {test.batch}
              </span>
            )}

            {test.assignedTo === "STUDENT" && (
              <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                Assigned to: Specific Student
              </span>
            )}
          </div>

          {/* Marks Info */}
          <div className="text-sm text-gray-700">
            <p>
              <strong>Max Marks:</strong> {test.maxMarks}
            </p>

            {test.assignedTo === "STUDENT" && (
              <p>
                <strong>Obtained Marks:</strong>{" "}
                {test.marks !== null ? test.marks : "Not Evaluated"}
              </p>
            )}
          </div>

          {/* Download */}
          
         <a
  href={test.file}
  download
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-1 text-indigo-600 text-sm font-medium"
>
  <Download size={14} />
  Download Question Paper
</a>

        </div>
      ))}
    </div>
  )}
</div>

    </div>
  );
}