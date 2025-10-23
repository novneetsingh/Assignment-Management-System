import { useForm } from "react-hook-form";
import { FiAlertCircle } from "react-icons/fi";

const AssignmentForm = ({
  onSubmit,
  defaultValues,
  isEditing = false,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("title", { required: "Title is required" })}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Assignment title"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <FiAlertCircle size={14} /> {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("description", { required: "Description is required" })}
          rows="4"
          className={`w-full px-3 py-2 border rounded-md ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Assignment description"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <FiAlertCircle size={14} /> {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Due Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          {...register("dueDate", { required: "Due date is required" })}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.dueDate ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.dueDate && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <FiAlertCircle size={14} /> {errors.dueDate.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          OneDrive Link <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          {...register("oneDriveLink", {
            required: "OneDrive link is required",
          })}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.oneDriveLink ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="https://onedrive.live.com/..."
        />
        {errors.oneDriveLink && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <FiAlertCircle size={14} /> {errors.oneDriveLink.message}
          </p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {isEditing ? "Update Assignment" : "Create Assignment"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AssignmentForm;
