import Card from "../common/Card";

const SubmissionCard = ({ submission, onConfirm }) => {
  return (
    <Card>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2 flex-wrap">
            <h3 className="text-lg font-semibold">{submission.user?.name}</h3>
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
              {submission.user?.email}
            </span>
            {submission.group && (
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                Group: {submission.group.name}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Submitted: {new Date(submission.createdAt).toLocaleDateString()}
          </p>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-sm rounded-full ${
                submission.status === "Confirmed"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {submission.status}
            </span>
          </div>
        </div>
        {submission.status !== "Confirmed" && onConfirm && (
          <div className="flex gap-2">
            <button
              onClick={() => onConfirm(submission.id)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SubmissionCard;
