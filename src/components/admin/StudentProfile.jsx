import { X } from "lucide-react";
import Avatar from "../common/Avatar";
import Badge from "../common/Badge";


export default function StudentProfile({ student, onClose, onEdit, onDelete }) {
    if (!student) return null;

    const {
        id,
        name,
        photo,
        className,
        batch,
        timeSlot,
        school,
        address,
        phone,
        email,
        status = "active",
    } = student;

    const renderValue = (value) => value || "—";

    return (
        <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end"
            onClick={onClose}
        >
            <div
                className="w-full sm:w-[420px] bg-white h-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        Student Profile
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500"
                    >
                        <X />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-64px)]">
                    {/* Avatar */}
                    <div className="flex flex-col items-center text-center">
                        <Avatar
                            src={photo}
                            name={name}
                            size={96}
                        />

                        <h3 className="mt-4 text-lg font-semibold text-gray-800">
                            {renderValue(name)}
                        </h3>

                        <Badge
  label={status === "active" ? "Active" : "Inactive"}
  type={status}
/>

                    </div>


                    {/* Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <Info label="Student ID" value={id} />
                        <Info label="Class" value={className} />
                        <Info label="Batch" value={batch} />
                        <Info label="Time Slot" value={timeSlot} />
                        <Info label="School" value={school} />
                        <Info label="Phone" value={phone} />
                        <Info label="Email" value={email} />
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-600 mb-1">
                            Address
                        </h4>
                        <p className="text-gray-700 bg-gray-100 rounded-lg p-3">
                            {renderValue(address)}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => onEdit(student)}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Edit Student
                        </button>

                        <button
                            onClick={() => onDelete(student)}
                            className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-200 transition"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* Small reusable info block */
function Info({ label, value }) {
    return (
        <div>
            <p className="text-gray-500 text-xs mb-1">{label}</p>
            <p className="font-medium text-gray-800">
                {value || "—"}
            </p>
        </div>
    );
}