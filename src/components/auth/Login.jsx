import { useEffect, useState } from "react";
import { loginUser } from "../../services/auth.service";

export default function Login({ onClose, onSuccess }) {
  const [role, setRole] = useState("student");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const data = await loginUser({ userId, password });

    // Save auth info
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role.toLowerCase());

    // Optional: student-specific data later
    if (data.role === "STUDENT") {
      localStorage.setItem("studentId", userId);
    }

    // Redirect based on role
    if (data.role === "ADMIN") {
      onSuccess("/admin");
    } else {
      onSuccess("/student");
    }
  } catch (err) {
    setError("Invalid credentials");
  }
};

  return (
    <div
      className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-scale-in"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Login</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Role Toggle */}
      <div className="flex bg-gray-100 rounded-lg mb-6 overflow-hidden">
        {["student", "admin"].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 py-2 font-semibold transition ${
              role === r
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {r === "student" ? "Student" : "Admin"}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          autoFocus
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
        />

        {error && (
          <p className="text-red-500 text-sm font-medium">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition"
        >
          Login as {role === "student" ? "Student" : "Admin"}
        </button>
      </form>
    </div>
  );
}