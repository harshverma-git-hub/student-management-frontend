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
      const data = await loginUser({
        userId,
        password,
        role, // ✅ FIX: role was missing
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role.toLowerCase());

      if (data.role === "STUDENT") {
        localStorage.setItem("studentId", userId);
        onSuccess("/student");
      } else {
        onSuccess("/admin");
      }
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div
      className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Login</h2>
        <button onClick={onClose} className="text-gray-500 text-xl">✕</button>
      </div>

      <div className="flex bg-gray-100 rounded-lg mb-6 overflow-hidden">
        {["student", "admin"].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 py-2 font-semibold ${
              role === r
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {r === "student" ? "Student" : "Admin"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Login as {role === "student" ? "Student" : "Admin"}
        </button>
      </form>
    </div>
  );
}
