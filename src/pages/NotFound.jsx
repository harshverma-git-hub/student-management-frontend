import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">

      <h1 className="text-6xl font-extrabold text-red-500 mb-4">
        404
      </h1>

      <p className="text-xl mb-6 text-gray-700">
        Oops! Page not found.
      </p>

      <Link
        to="/"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Go to Home
      </Link>

    </div>
  );
}
