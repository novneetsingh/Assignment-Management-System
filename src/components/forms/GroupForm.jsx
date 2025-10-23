import { useForm } from "react-hook-form";
import { FiAlertCircle } from "react-icons/fi";

const GroupForm = ({ onSubmit, students, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="groupName" className="block text-sm font-medium mb-1">
          Group Name <span className="text-red-500">*</span>
        </label>
        <input
          id="groupName"
          type="text"
          {...register("name", { required: "Group name is required" })}
          placeholder="Enter group name"
          className={`w-full px-3 py-2 border rounded-md ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <FiAlertCircle size={14} /> {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="groupMembers"
          className="block text-sm font-medium mb-1"
        >
          Select Members (Hold Ctrl/Cmd to select multiple){" "}
          <span className="text-red-500">*</span>
        </label>
        <select
          id="groupMembers"
          multiple
          {...register("members", { required: "Select at least one member" })}
          className={`w-full px-3 py-2 border rounded-md h-32 ${
            errors.members ? "border-red-500" : "border-gray-300"
          }`}
        >
          {students.length > 0 ? (
            students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.email})
              </option>
            ))
          ) : (
            <option disabled>Loading students...</option>
          )}
        </select>
        {errors.members && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <FiAlertCircle size={14} /> {errors.members.message}
          </p>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Group
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

export default GroupForm;
