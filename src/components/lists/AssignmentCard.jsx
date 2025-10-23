import Card from "../common/Card";

const AssignmentCard = ({ assignment, actions }) => {
  return (
    <Card>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{assignment.title}</h3>
          <p className="text-gray-600 mt-2">{assignment.description}</p>
          <p className="text-sm text-gray-500 mt-2">
            Due: {new Date(assignment.dueDate).toLocaleDateString()}
          </p>
          <a
            href={assignment.oneDriveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
          >
            OneDrive Link →
          </a>
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </Card>
  );
};

export default AssignmentCard;
