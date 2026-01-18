import { useEffect, useState } from "react";

export default function StudentForm({ initialData, onSave, onClose }) {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    name: "",
    className: "",
    batch: "",
    timeSlot: "",
    school: "",
    phone: "",
    email: "",
    address: "",
    status: "active",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        userId: initialData.id || "",
        password: "", // password not editable
        name: initialData.name || "",
        className: initialData.className || "",
        batch: initialData.batch || "",
        timeSlot: initialData.timeSlot || "",
        school: initialData.school || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        address: initialData.address || "",
        status: initialData.status || "active",
      });
      setPhotoPreview(initialData.photo || "");
    }
  }, [initialData]);

  /* ================= PHOTO HANDLER ================= */
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    if (photoFile) {
      data.append("profilePhoto", photoFile);
    }

    onSave(data);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Student" : "Add Student"}
        </h2>

        {/* ================= PHOTO UPLOAD ================= */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-24 h-24 rounded-full border overflow-hidden bg-gray-100 flex items-center justify-center">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Student"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm">No Photo</span>
            )}
          </div>

          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
            Upload Photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhotoUpload}
            />
          </label>
        </div>

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            name="userId"
            placeholder="Student ID"
            value={formData.userId}
            onChange={handleChange}
            required
            className="input"
            disabled={!!initialData}
          />

          {!initialData && (
            <input
              name="password"
              placeholder="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input"
            />
          )}

          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input"
          />

          <input
            name="className"
            placeholder="Class"
            value={formData.className}
            onChange={handleChange}
            className="input"
          />

          <input
            name="batch"
            placeholder="Batch"
            value={formData.batch}
            onChange={handleChange}
            className="input"
          />

          <input
            name="timeSlot"
            placeholder="Time Slot"
            value={formData.timeSlot}
            onChange={handleChange}
            className="input"
          />

          <input
            name="school"
            placeholder="School"
            value={formData.school}
            onChange={handleChange}
            className="input"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="input"
          />

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="input"
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="input col-span-2"
          />

          <div className="col-span-2 flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Save Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}