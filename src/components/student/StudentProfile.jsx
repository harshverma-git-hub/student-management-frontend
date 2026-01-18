import { useState } from "react";
import api from "../../services/api";

export default function StudentProfile() {
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();

      if (password) formData.append("password", password);
      if (photo) formData.append("photo", photo);

      await api.patch("/students/profile", formData);

      alert("Profile updated successfully");
      setPassword("");
      setPhoto(null);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        My Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 space-y-4"
      >
        {/* Profile Photo */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Profile Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Leave blank to keep unchanged"
          />
        </div>

        <button
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
        >
          {loading ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
