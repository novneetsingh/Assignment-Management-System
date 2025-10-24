import { FiUserPlus } from "react-icons/fi";
import Card from "../common/Card";

const GroupCard = ({ group, currentUserId, onAddMember }) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold">{group.name}</h3>
      <p className="text-sm text-gray-500 mt-1">
        Created: {new Date(group.createdAt).toLocaleDateString()}
      </p>
      {group.creatorId === currentUserId && onAddMember && (
        <button
          onClick={() => onAddMember(group)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
        >
          <FiUserPlus className="inline mr-2" />
          Add Member
        </button>
      )}
    </Card>
  );
};

export default GroupCard;
