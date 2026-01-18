import { useEffect, useState } from "react";
import api from "../../services/api";

const CATEGORIES = [
  { key: "tests", label: "Tests", type: "TEST", icon: "🧪" },
  { key: "homework", label: "Homework", type: "HOMEWORK", icon: "📚" },
  { key: "announcements", label: "Announcements", type: "ANNOUNCEMENT", icon: "📢" },
];

export default function RecycleBin() {
  const [data, setData] = useState({
    tests: [],
    homework: [],
    announcements: [],
  });
  const [activeCategory, setActiveCategory] = useState("tests");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecycleBin();
  }, []);

  const fetchRecycleBin = async () => {
    try {
      setLoading(true);
      const res = await api.get("/recycle-bin");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load recycle bin", err);
    } finally {
      setLoading(false);
    }
  };

  const restoreItem = async (type, id) => {
    if (!window.confirm("Restore this item?")) return;

    try {
      await api.patch("/recycle-bin/restore", { type, id });
      fetchRecycleBin();
    } catch (err) {
      alert("Failed to restore item");
    }
  };

  const permanentlyDeleteItem = async (type, id) => {
    if (!window.confirm("Permanently delete this item? This cannot be undone.")) return;

    try {
      await api.delete("/recycle-bin/permanent", {
        data: { type, id },
      });
      fetchRecycleBin();
    } catch (err) {
      alert("Failed to permanently delete item");
    }
  };

  const items = data[activeCategory] || [];
  const categoryMeta = CATEGORIES.find(c => c.key === activeCategory);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Recycle Bin</h1>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`p-4 rounded-xl shadow flex items-center gap-3 text-left transition
              ${
                activeCategory === cat.key
                  ? "bg-indigo-600 text-white"
                  : "bg-white hover:bg-indigo-50"
              }`}
          >
            <span className="text-2xl">{cat.icon}</span>
            <div>
              <p className="font-semibold">{cat.label}</p>
              <p className="text-sm opacity-80">
                {data[cat.key]?.length || 0} deleted
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Deleted {categoryMeta?.label}
        </h2>

        {loading && <p className="text-gray-500">Loading...</p>}

        {!loading && items.length === 0 && (
          <p className="text-gray-500">No deleted items in this category.</p>
        )}

        <div className="space-y-4">
          {items.map(item => (
            <div
              key={item.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">
                  Deleted on{" "}
                  {new Date(item.deletedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    restoreItem(categoryMeta.type, item.id)
                  }
                  className="px-4 py-1 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  Restore
                </button>

                <button
                  onClick={() =>
                    permanentlyDeleteItem(categoryMeta.type, item.id)
                  }
                  className="px-4 py-1 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}