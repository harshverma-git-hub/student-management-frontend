export default function EmptyState({
  title = "No data found",
  message = "There is nothing to show here yet.",
}) {
  return (
    <div className="text-center py-12 text-gray-500">
      <h3 className="text-lg font-semibold mb-1">
        {title}
      </h3>
      <p>{message}</p>
    </div>
  );
}