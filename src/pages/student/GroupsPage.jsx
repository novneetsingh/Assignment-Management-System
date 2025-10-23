import { useState, useEffect, useContext } from "react";
import { FiUsers, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import { groupAPI, userAPI } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/common/Header";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import GroupCard from "../../components/lists/GroupCard";
import GroupForm from "../../components/forms/GroupForm";
import AddMemberForm from "../../components/forms/AddMemberForm";

const GroupsPage = () => {
  const { user } = useContext(AuthContext);
  const [myGroups, setMyGroups] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await groupAPI.getMyGroups();
      setMyGroups(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStudents = async () => {
    try {
      const res = await userAPI.getAllStudents();
      setAllStudents(
        res.data.data.filter((student) => student.id !== user?.id)
      );
    } catch (error) {
      toast.error("Failed to fetch student list");
    }
  };

  const handleCreateGroupClick = () => {
    fetchAllStudents();
    setShowGroupModal(true);
  };

  const createGroup = async (data) => {
    const selectedMembers = Array.isArray(data.members)
      ? data.members
      : data.members
      ? [data.members]
      : [];

    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member to create a group.");
      return;
    }

    try {
      await groupAPI.create({ name: data.name, members: selectedMembers });
      toast.success("Group created successfully!");
      setShowGroupModal(false);
      fetchGroups();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
    }
  };

  const handleAddMember = (group) => {
    setSelectedGroup(group);
    setShowAddMemberModal(true);
  };

  const addMember = async (data) => {
    try {
      const studentRes = await userAPI.getAllStudents();
      const studentToAdd = studentRes.data.data.find(
        (s) => s.email.toLowerCase() === data.email.toLowerCase()
      );

      if (!studentToAdd) {
        toast.error("Student with that email not found.");
        return;
      }

      if (studentToAdd.id === user?.id) {
        toast.error("You cannot add yourself to the group again.");
        return;
      }

      const isAlreadyMember = selectedGroup?.members?.some(
        (m) => m.user?.email === data.email
      );
      if (isAlreadyMember) {
        toast.error("This student is already in the group.");
        return;
      }

      await groupAPI.addMember(selectedGroup.id, studentToAdd.id);
      toast.success("Member added successfully!");
      setShowAddMemberModal(false);
      fetchGroups();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="My Groups" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Groups</h2>
          <button
            onClick={handleCreateGroupClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiPlus className="inline mr-2" />
            Create Group
          </button>
        </div>
        {loading ? (
          <Loading />
        ) : myGroups.length > 0 ? (
          <div className="grid gap-4">
            {myGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                currentUserId={user?.id}
                onAddMember={handleAddMember}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FiUsers />}
            message="You are not part of any groups."
            action={
              <button
                onClick={handleCreateGroupClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Your First Group
              </button>
            }
          />
        )}
      </div>

      <Modal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        title="Create New Group"
      >
        <GroupForm
          students={allStudents}
          onSubmit={createGroup}
          onCancel={() => setShowGroupModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        title="Add Member"
      >
        <AddMemberForm
          groupName={selectedGroup?.name}
          onSubmit={addMember}
          onCancel={() => setShowAddMemberModal(false)}
        />
      </Modal>
    </div>
  );
};

export default GroupsPage;
