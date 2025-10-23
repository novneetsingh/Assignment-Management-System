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
  FiAlertCircle, // Icon for error messages
} from "react-icons/fi";
import axios from "axios";

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("assignments");
  const [assignments, setAssignments] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allStudents, setAllStudents] = useState([]); // State for student list

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
    formState: { errors: groupErrors }, // Get errors for group form
  } = useForm();
  const {
    register: registerMember,
    handleSubmit: handleSubmitMember,
    reset: resetMember,
    formState: { errors: memberErrors }, // Get errors for add member form
  } = useForm();
  // Separate form state for submission modal
  const {
    register: registerSubmit,
    handleSubmit: handleSubmitSubmit,
    reset: resetSubmit,
    formState: { errors: submitErrors },
  } = useForm();

  // Fetch initial data based on tab
  useEffect(() => {
    fetchTabData();
  }, [activeTab]);

  // Fetch student list when group modal opens
  useEffect(() => {
    if (showGroupModal) {
      fetchAllStudents();
    }
  }, [showGroupModal]);

  const fetchTabData = async () => {
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
      toast.error(
        error.response?.data?.message || `Failed to fetch ${activeTab}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch all students (for group creation member selection)
  const fetchAllStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get("/users/students", { headers }); // Uses the existing endpoint
      // Filter out the current user from the list
      setAllStudents(
        res.data.data.filter((student) => student.id !== user?.id)
      );
    } catch (error) {
      toast.error("Failed to fetch student list");
      setAllStudents([]); // Reset on error
    }
  };

  // Updated createGroup function to send members array
  const createGroup = async (data) => {
    // Ensure data.members is always an array, even if only one or none selected
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
      const token = localStorage.getItem("token");
      await axios.post(
        `/groups`,
        // Send name and the array of selected member IDs
        { name: data.name, members: selectedMembers },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Group created successfully!");
      setShowGroupModal(false);
      resetGroup();
      if (activeTab === "groups") {
        fetchTabData(); // Refresh group list if on the groups tab
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
    }
  };

  const addMember = async (data) => {
    // We need the *user ID* not the email based on your backend controller logic
    // Find the student ID based on the email provided
    try {
      const token = localStorage.getItem("token");
      const studentRes = await axios.get("/users/students", {
        // Fetch students again to find the ID
        headers: { Authorization: `Bearer ${token}` },
      });
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

      // Check if student is already a member
      const isAlreadyMember = selectedGroup?.members.some(
        (m) => m.user.email === data.email
      );
      if (isAlreadyMember) {
        toast.error("This student is already in the group.");
        return;
      }

      await axios.post(
        // Use the correct API endpoint structure: /groups/:groupId/members/:userId
        `/groups/${selectedGroup.id}/members/${studentToAdd.id}`,
        {}, // No body needed as userId is in the URL
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Member added successfully!");
      setShowAddMemberModal(false);
      resetMember();
      if (activeTab === "groups") {
        fetchTabData(); // Refresh group list
      }
    } catch (error) {
      console.error("Add member error:", error.response || error);
      toast.error(error.response?.data?.message || "Failed to add member");
    }
  };

  // Uses handleSubmitSubmit now
  const submitAssignment = async (data) => {
    try {
      const token = localStorage.getItem("token");
      // Your backend expects userId implicitly from the token,
      // and optionally groupId.
      const payload = {
        assignmentId: selectedAssignment.id,
        groupId: data.groupId || null, // Ensure groupId is sent, null if not applicable (though your schema requires userId)
      };
      await axios.post(`/submissions`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // The backend response suggests it creates a submission with status "Submitted"
      // The assignment spec requires the *student* to confirm.
      // We need a student-specific confirm endpoint. Assuming it exists:
      toast.success(
        "Submission recorded! Please perform the final confirmation."
      );
      setShowSubmitModal(false);
      resetSubmit();
      if (activeTab === "assignments") {
        fetchTabData(); // Refresh assignments to show "Already Submitted"
      }
      // You might need a separate step/button to call the *student's* confirm endpoint
      // Let's assume for now the "Confirm Submission" button handles this.
    } catch (error) {
      console.error("Submit error:", error.response || error);
      toast.error(error.response?.data?.message || "Failed to submit");
    }
  };

  // This needs to hit a STUDENT confirmation endpoint.
  // Your current backend `/submissions/confirm` is for PROFESSORS.
  // Assuming a student endpoint like PATCH /submissions/:submissionId/student-confirm
  const handleStudentConfirm = async (submissionId) => {
    // Step 1: Initial "Are you sure?"
    const firstConfirm = window.confirm(
      "Are you sure you have uploaded your work externally and want to proceed with confirmation?"
    );
    if (!firstConfirm) return;

    // Step 2: Final Confirmation
    const finalConfirm = window.confirm(
      "FINAL CONFIRMATION: Please confirm that the submission is complete."
    );
    if (!finalConfirm) return;

    // --- Mocking the API call ---
    // Replace this with your actual student confirmation API endpoint call
    try {
      const token = localStorage.getItem("token");
      // **THIS ENDPOINT NEEDS TO BE CREATED ON YOUR BACKEND**
      // Example: PATCH /submissions/student-confirm/:submissionId
      // It should be protected by the `isStudent` middleware.
      // It should update the StudentConfirmation model (setting isFinal: true)
      /*
            await axios.patch(
                `/submissions/student-confirm/${submissionId}`, // Adjust endpoint as needed
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            */
      toast.success("Submission Confirmed by You!");
      // Refetch data to update UI (e.g., show "Confirmed" status)
      fetchTabData();
      console.log(
        "Mock Confirmation for submission ID:",
        submissionId,
        " - Replace with actual API call."
      );
      // Simulating a state update after successful confirmation
      // You'll need to adjust your data fetching/state management
      // to properly reflect the confirmation status from the backend.
    } catch (error) {
      console.error("Student Confirm error:", error.response || error);
      toast.error(
        error.response?.data?.message || "Failed to confirm submission"
      );
    }
    // --- End Mocking ---
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        {/* ... (header code remains the same) ... */}
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        {/* ... (tabs code remains the same) ... */}

        {/* Assignments Tab */}
        {activeTab === "assignments" && (
          <div>
            <h2 className="text-xl font-bold mb-4">All Assignments</h2>
            {loading ? (
              <p>Loading...</p>
            ) : assignments.length > 0 ? (
              <div className="grid gap-4">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="bg-white p-6 rounded-lg shadow"
                  >
                    {/* ... (assignment details remain the same) ... */}
                    <div className="mt-4 flex gap-2 flex-wrap">
                      <a
                        href={assignment.oneDriveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm" // Changed color for distinction
                      >
                        OneDrive Link
                      </a>
                      {assignment.isSubmitted ? ( // Check the flag from the API
                        <button
                          className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed text-sm"
                          disabled
                        >
                          Submission Recorded
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            // Fetch user's groups when opening submit modal if not already loaded
                            if (myGroups.length === 0) fetchTabData(); // Re-use fetchTabData to get groups if needed
                            resetSubmit(); // Reset submit form
                            setShowSubmitModal(true);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                        >
                          Submit Assignment
                        </button>
                      )}
                      {/* Add a button for student confirmation if needed, maybe based on submission status */}
                      {/* This logic depends heavily on how you track submissions and confirmations */}
                      {assignment.isSubmitted /* && !assignment.isConfirmedByStudent */ && (
                        <button
                          // You'll need the specific submission ID here.
                          // This requires fetching submission details along with assignments or groups.
                          // For now, let's pass the assignment ID as a placeholder.
                          // onClick={() => handleStudentConfirm(assignment.submissionId)} // Replace with actual submission ID
                          onClick={() =>
                            toast.error(
                              "Confirmation logic needs specific Submission ID"
                            )
                          }
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                          title="Confirm your submission (Two-Step)"
                        >
                          <FiCheckCircle className="inline mr-1" /> Confirm
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No assignments found.</p>
            )}
          </div>
        )}

        {/* Groups Tab */}
        {activeTab === "groups" && (
          <div>
            {/* ... (Groups tab header remains the same) ... */}
            {loading ? (
              <p>Loading...</p>
            ) : myGroups.length > 0 ? (
              <div className="grid gap-4">
                {myGroups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-white p-6 rounded-lg shadow"
                  >
                    {/* ... (group details remain the same) ... */}
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Members:</h4>
                      <div className="space-y-1">
                        {/* Check if members exist before mapping */}
                        {group.members && group.members.length > 0 ? (
                          group.members.map((member) => (
                            <div
                              key={member.user?.id || member.userId} // Handle potential structure differences
                              className="text-sm text-gray-600"
                            >
                              {member.user?.name || "Unknown User"} (
                              {member.user?.email || "No Email"})
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">
                            No members found.
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Only show Add Member if the current user is the creator */}
                    {group.creatorId === user?.id && (
                      <button
                        onClick={() => {
                          setSelectedGroup(group);
                          resetMember(); // Reset the add member form
                          setShowAddMemberModal(true);
                        }}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm" // Changed color
                      >
                        <FiUserPlus className="inline mr-2" />
                        Add Member by Email
                      </button>
                    )}
                    {/* Display Submissions - Requires submissions to be included in getMyGroups response */}
                    {/* {group.submissions?.length > 0 && ( ... ) } */}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">You are not part of any groups.</p>
            )}
          </div>
        )}
      </div>

      {/* Create Group Modal - UPDATED */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            {" "}
            {/* Increased max-width */}
            <h3 className="text-xl font-bold mb-4">Create New Group</h3>
            <form
              onSubmit={handleSubmitGroup(createGroup)}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="groupName"
                  className="block text-sm font-medium mb-1"
                >
                  Group Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="groupName"
                  type="text"
                  {...registerGroup("name", {
                    required: "Group name is required",
                  })}
                  placeholder="Enter group name"
                  className={`w-full px-3 py-2 border rounded-md ${
                    groupErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {groupErrors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <FiAlertCircle size={14} /> {groupErrors.name.message}
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
                  multiple // Enable multiple selection
                  {...registerGroup("members", {
                    required: "Select at least one member",
                  })}
                  className={`w-full px-3 py-2 border rounded-md h-32 ${
                    groupErrors.members ? "border-red-500" : "border-gray-300"
                  }`} // Added height for visibility
                >
                  {allStudents.length > 0 ? (
                    allStudents.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.email})
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading students...</option>
                  )}
                </select>
                {groupErrors.members && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <FiAlertCircle size={14} /> {groupErrors.members.message}
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
                  onClick={() => {
                    setShowGroupModal(false);
                    resetGroup();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Assignment Modal - UPDATED */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Submit Assignment</h3>
            <p className="mb-4 text-gray-700">
              Assignment:{" "}
              <span className="font-semibold">{selectedAssignment?.title}</span>
            </p>
            {/* Use the specific submit form handler */}
            <form
              onSubmit={handleSubmitSubmit(submitAssignment)}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="submitGroupId"
                  className="block text-sm font-medium mb-1"
                >
                  Select Group <span className="text-red-500">*</span>
                </label>
                <select
                  id="submitGroupId"
                  {...registerSubmit("groupId", {
                    required: "Please select a group",
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    submitErrors.groupId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">-- Choose your group --</option>
                  {myGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                {submitErrors.groupId && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <FiAlertCircle size={14} /> {submitErrors.groupId.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Make sure you have uploaded the assignment to the OneDrive
                  link first.
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
                  onClick={() => {
                    setShowSubmitModal(false);
                    resetSubmit();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal  */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              Add Member to{" "}
              <span className="font-semibold">{selectedGroup?.name}</span>
            </h3>
            {/* Use the specific member form handler */}
            <form
              onSubmit={handleSubmitMember(addMember)}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="memberEmail"
                  className="block text-sm font-medium mb-1"
                >
                  Member Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="memberEmail"
                  type="email"
                  {...registerMember("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="Enter member's email address"
                  className={`w-full px-3 py-2 border rounded-md ${
                    memberErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {memberErrors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <FiAlertCircle size={14} /> {memberErrors.email.message}
                  </p>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Member
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMemberModal(false);
                    resetMember();
                  }}
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
