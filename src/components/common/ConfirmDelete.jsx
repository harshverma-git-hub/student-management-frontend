import Modal from "./Modal";

export default function ConfirmDelete({
  title = "Confirm Delete",
  message,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal onClose={onCancel}>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {title}
        </h2>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 py-2 rounded-lg font-semibold hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}