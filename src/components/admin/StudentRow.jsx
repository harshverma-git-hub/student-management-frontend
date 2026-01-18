import Badge from "../common/Badge";

export default function StudentRow({ student, onClick }) {
  const {
    id,
    name,
    className,
    batch,
    timeSlot,
    status,
  } = student;

  return (
    <tr
      onClick={onClick}
      className="cursor-pointer border-b hover:bg-indigo-50 transition"
    >
      <td className="px-6 py-4 font-medium">{id}</td>
      <td className="px-6 py-4">{name}</td>
      <td className="px-6 py-4">{className || "—"}</td>
      <td className="px-6 py-4">{batch || "—"}</td>
      <td className="px-6 py-4 text-center">
        <Badge
          label={status === "active" ? "Active" : "Inactive"}
          type={status}
        />
      </td>
    </tr>
  );
}