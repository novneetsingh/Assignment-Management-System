import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
  FiLogOut,
  FiUsers,
  FiBook,
  FiCheckCircle,
  FiPlus,
  FiUserPlus,
} from "react-icons/fi";
import axios from "axios";

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("assignments");
  const [assignments, setAssignments] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Form states
  const {
    register: registerGroup,
    handleSubmit: handleSubmitGroup,
    reset: resetGroup,
  } = useForm();
  const {
    register: registerMember,
    handleSubmit: handleSubmitMember,
    reset: resetMember,
  } = useForm();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (activeTab === "assignments") {
        const res = await axios.get(`/assignments`, { headers });
        setAssignments(res.data.data);
      } else if (activeTab === "groups") {
        const res = await axios.get(`/groups/my-groups`, { headers });
        setMyGroups(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (data) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/groups`,
        { name: data.name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Group created successfully!");
      setShowGroupModal(false);
      resetGroup();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
    }
  };

  const addMember = async (data) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/groups/${selectedGroup.id}/members`,
        { email: data.email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Member added successfully!");
      setShowAddMemberModal(false);
      resetMember();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member");
    }
  };

  const submitAssignment = async (data) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/submissions`,
        {
          assignmentId: selectedAssignment.id,
          groupId: data.groupId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Please confirm your submission");
      setShowSubmitModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit");
    }
  };

  const confirmSubmission = async (submissionId) => {
    if (!window.confirm("Are you sure you have submitted the assignment?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/submissions/${submissionId}/confirm`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Submission confirmed!");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Student Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.name}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("assignments")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              activeTab === "assignments"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FiBook /> Assignments
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              activeTab === "groups"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FiUsers /> My Groups
          </button>
        </div>

        {/* Assignments Tab */}
        {activeTab === "assignments" && (
          <div>
            <h2 className="text-xl font-bold mb-4">All Assignments</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid gap-4">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="bg-white p-6 rounded-lg shadow"
                  >
                    <h3 className="text-lg font-semibold">
                      {assignment.title}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      {assignment.description}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <a
                        href={assignment.oneDriveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        OneDrive Link
                      </a>
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setShowSubmitModal(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Submit Assignment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Groups Tab */}
        {activeTab === "groups" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">My Groups</h2>
              <button
                onClick={() => setShowGroupModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FiPlus className="inline mr-2" />
                Create Group
              </button>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid gap-4">
                {myGroups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-white p-6 rounded-lg shadow"
                  >
                    <h3 className="text-lg font-semibold">{group.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Created by: {group.creator.name}
                    </p>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Members:</h4>
                      <div className="space-y-1">
                        {group.members.map((member) => (
                          <div
                            key={member.id}
                            className="text-sm text-gray-600"
                          >
                            {member.user.name} ({member.user.email})
                          </div>
                        ))}
                      </div>
                    </div>
                    {group.creatorId === user?.id && (
                      <button
                        onClick={() => {
                          setSelectedGroup(group);
                          setShowAddMemberModal(true);
                        }}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        <FiUserPlus className="inline mr-2" />
                        Add Member
                      </button>
                    )}
                    {group.submissions?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Submissions:</h4>
                        {group.submissions.map((sub) => (
                          <div
                            key={sub.id}
                            className="text-sm text-gray-600 flex items-center gap-2"
                          >
                            {sub.assignment.title} -{" "}
                            {sub.isConfirmed ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <FiCheckCircle /> Confirmed
                              </span>
                            ) : (
                              <button
                                onClick={() => confirmSubmission(sub.id)}
                                className="text-blue-600 hover:underline"
                              >
                                Confirm Submission
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create New Group</h3>
            <form onSubmit={handleSubmitGroup(createGroup)}>
              <input
                type="text"
                {...registerGroup("name", {
                  required: "Group name is required",
                })}
                placeholder="Group Name"
                className="w-full px-3 py-2 border rounded-md"
              />
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowGroupModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Assignment Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Submit Assignment</h3>
            <p className="mb-4">Assignment: {selectedAssignment?.title}</p>
            <form onSubmit={handleSubmit(submitAssignment)}>
              <label className="block mb-2 font-medium">Select Group:</label>
              <select
                {...register("groupId", { required: "Please select a group" })}
                className="w-full px-3 py-2 border rounded-md mb-4"
              >
                <option value="">Choose a group</option>
                {myGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              Add Member to {selectedGroup?.name}
            </h3>
            <form onSubmit={handleSubmitMember(addMember)}>
              <input
                type="email"
                {...registerMember("email", { required: "Email is required" })}
                placeholder="Member Email"
                className="w-full px-3 py-2 border rounded-md"
              />
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
