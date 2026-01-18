export default function Avatar({
  src,
  name = "",
  size = 96,
}) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div
      className="rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-3xl font-bold text-gray-500">
          {initial}
        </span>
      )}
    </div>
  );
}