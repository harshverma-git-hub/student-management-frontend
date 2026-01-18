import { useEffect, useState } from "react";
import api from "../../services/api";
import { FaCamera, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/students/profile");
      setProfile(res.data);
    } catch {
      setProfile(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (password) formData.append("password", password);
    if (photo) formData.append("photo", photo);

    try {
      await api.patch("/students/profile", formData);
      setStatus({ type: "success", msg: "Profile updated successfully" });
      setPassword("");
      fetchProfile();
    } catch {
      setStatus({ type: "error", msg: "Update failed" });
    }
  };

  if (!profile) {
    return <p className="p-6 text-red-500">Profile not found</p>;
  }

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        My Profile
      </h1>

      {/* ================= PROFILE CARD ================= */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* ===== HEADER ===== */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-36 relative" />

        {/* ===== AVATAR ===== */}
        <div className="relative -mt-16 flex justify-center">
          <div className="relative group">
            {profile.photo ? (
              <img
                src={`http://localhost:5000${profile.photo}`}
                alt="profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                {initials}
              </div>
            )}

            {/* Upload Overlay */}
            <label className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
              <FaCamera className="text-white text-2xl" />
              <input
                type="file"
                className="hidden"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="p-8 grid md:grid-cols-2 gap-8">
          {/* ================= LEFT: INFO ================= */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Account Information
            </h2>

            <div className="space-y-3 text-gray-700">
              <Info label="Name" value={profile.name} />
              <Info label="Student ID" value={profile.studentId} />
              <Info label="Batch" value={profile.batch} />
              <Info label="Class" value={profile.className} />
              <Info label="Time Slot" value={profile.timeSlot} />
              <Info label="School" value={profile.school} />
              <Info label="Email" value={profile.email} />
              <Info label="Phone" value={profile.phone} />
            </div>
          </div>

          {/* ================= RIGHT: SECURITY ================= */}
          <form onSubmit={handleUpdate}>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Security Settings
            </h2>

            {/* Password */}
            <div className="mb-4">
              <label className="block font-medium mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition"
            >
              Update Profile
            </button>

            {/* Status */}
            {status.msg && (
              <p
                className={`mt-4 font-medium ${
                  status.type === "success"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {status.msg}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

/* ================= SMALL INFO ROW ================= */
function Info({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-1">
      <span className="font-medium">{label}</span>
      <span className="text-gray-600">{value}</span>
    </div>
  );
}