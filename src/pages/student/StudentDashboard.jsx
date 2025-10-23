import { useState, useEffect, useContext } from "react";
import { FiBook, FiUsers, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  assignmentAPI,
  groupAPI,
  submissionAPI,
  userAPI,
} from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/common/Header";
import TabNavigation from "../../components/common/TabNavigation";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import StudentAssignmentCard from "../../components/lists/StudentAssignmentCard";
import GroupCard from "../../components/lists/GroupCard";
import SubmissionForm from "../../components/forms/SubmissionForm";
import GroupForm from "../../components/forms/GroupForm";
import AddMemberForm from "../../components/forms/AddMemberForm";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("assignments");
  const [assignments, setAssignments] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const tabs = [
    { id: "assignments", label: "Assignments", icon: <FiBook /> },
    { id: "groups", label: "Groups", icon: <FiUsers /> },
  ];

  useEffect(() => {
    if (activeTab === "assignments") {
      fetchAssignments();
      fetchGroups();
    } else if (activeTab === "groups") {
      fetchGroups();
    }
  }, [activeTab]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await assignmentAPI.getAll();
      setAssignments(res.data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch assignments"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await groupAPI.getMyGroups();
      setMyGroups(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch groups");
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

  const handleSubmitAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmitModal(true);
  };

  const submitAssignment = async (data) => {
    try {
      const payload = {
        assignmentId: selectedAssignment.id,
        groupId: data.groupId || null,
      };
      await submissionAPI.submit(payload);
      toast.success("Assignment submitted successfully!");
      setShowSubmitModal(false);
      fetchAssignments();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit assignment"
      );
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
      <Header title="Student Dashboard" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Assignments Tab */}
        {activeTab === "assignments" && (
          <div>
            <h2 className="text-xl font-bold mb-4">All Assignments</h2>
            {loading ? (
              <Loading />
            ) : assignments.length > 0 ? (
              <div className="grid gap-4">
                {assignments.map((assignment) => (
                  <StudentAssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    onSubmit={handleSubmitAssignment}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<FiBook />}
                message="No assignments available at the moment."
              />
            )}
          </div>
        )}

        {/* Groups Tab */}
        {activeTab === "groups" && (
          <div>
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
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Assignment"
      >
        <SubmissionForm
          assignment={selectedAssignment}
          groups={myGroups}
          onSubmit={submitAssignment}
          onCancel={() => setShowSubmitModal(false)}
        />
      </Modal>

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

export default StudentDashboard;
