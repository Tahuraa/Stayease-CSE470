// src/pages/UserDrawer.jsx
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const UserDrawer = ({ open, onClose, user, onSave, onDelete }) => {
  if (!user) return null;

  const [formData, setFormData] = useState({
    department: "",
    departmentRole: "",
    floorNumber: "",
    salary: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        department: user.department || "",
        departmentRole: user.departmentRole || "",
        floorNumber: user.floorNumber || "",
        salary: user.salary || "",
      });
    }
  }, [user]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="ml-auto w-full max-w-md bg-white shadow-xl h-full flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Edit User</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Read-only fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={user.name}
                  readOnly
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="text"
                  value={user.email}
                  readOnly
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  value={user.number}
                  readOnly
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Editable fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  value={formData.departmentRole}
                  onChange={(e) =>
                    setFormData({ ...formData, departmentRole: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Floor
                </label>
                <input
                  type="number"
                  value={formData.floorNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, floorNumber: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Salary
                </label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex justify-between">
              <button
                onClick={onDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => onSave({ ...user, ...formData })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserDrawer;
