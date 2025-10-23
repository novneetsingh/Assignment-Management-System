import Card from "../common/Card";

const StudentAssignmentCard = ({ assignment, onSubmit }) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold">{assignment.title}</h3>
      <p className="text-gray-600 mt-2">{assignment.description}</p>
      <p className="text-sm text-gray-500 mt-2">
        Due: {new Date(assignment.dueDate).toLocaleDateString()}
      </p>
      <div className="mt-4 flex gap-2 flex-wrap">
        <a
          href={assignment.oneDriveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
        >
          OneDrive Link
        </a>
        {assignment.isSubmitted ? (
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed text-sm"
            disabled
          >
            Already Submitted
          </button>
        ) : (
          <button
            onClick={() => onSubmit(assignment)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Submit Assignment
          </button>
        )}
      </div>
    </Card>
  );
};

export default StudentAssignmentCard;
