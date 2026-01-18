export default function Badge({ label, type = "default" }) {
  const styles = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    default: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        styles[type] || styles.default
      }`}
    >
      {label}
    </span>
  );
}