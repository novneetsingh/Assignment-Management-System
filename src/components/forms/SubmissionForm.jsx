import { useForm } from "react-hook-form";
import { FiAlertCircle } from "react-icons/fi";

const SubmissionForm = ({ assignment, groups, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div>
      <p className="mb-4 text-gray-700">
        Assignment: <span className="font-semibold">{assignment?.title}</span>
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="submitGroupId"
            className="block text-sm font-medium mb-1"
          >
            Select Group <span className="text-red-500">*</span>
          </label>
          <select
            id="submitGroupId"
            {...register("groupId", { required: "Please select a group" })}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.groupId ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">-- Choose your group --</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          {errors.groupId && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <FiAlertCircle size={14} /> {errors.groupId.message}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Make sure you have uploaded the assignment to the OneDrive link
            first.
          </p>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit
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
    </div>
  );
};

export default SubmissionForm;
